import {Shader} from './shader.js';
import {Timeline, Subnodes} from './timeline.js';
import {TimelineType} from './timelinetypes.js'
import {CompleteFunctionConfig} from './completefunction.js';
//@ts-ignore
import * as glMatrix from './gl-matrix/index.js';
import { maxdistancefrompoint } from './settings.env.js';
import { Point } from './point.js';

type ShaderConfig = {
  vCode: string,
  fCode: string,
  info: {
    attribLocation: {vertexPosition: string}
    uniformLocation: {
      enableVertexPainting: string,
      pMatrix: string,
      vertexPaintColor: string
    }
  },
  name: string
}[];

type TimelineDescriptionConfig = {
  type: TimelineType,
  shader: string,
  selected: boolean,
  width: number,
  subnodes: Subnodes,
  name: string
};

export type SetupData = {
  shaders: ShaderConfig,
  timelines:{
    description: TimelineDescriptionConfig,
    completefunction: CompleteFunctionConfig
  }[],
}

export class WebGLScene{
  gl: WebGL2RenderingContext;
  canvas: HTMLCanvasElement;
  VERTEX_PER_VALUE: number;
  shaders: Record<string, Shader>;
  timelines: {timeline: Timeline, buffer: WebGLBuffer | null, uptodate: boolean}[]
  buffers: []
  projectionMatrix: mat4;
  subpoint: Point;

  constructor(canvas: HTMLCanvasElement, setupdata: SetupData){
    let gl = canvas.getContext('webgl2');
    if(gl === null){
      throw new Error("WebGL2 not supported");
    }
    this.gl = gl;
    this.canvas = canvas;
    this.VERTEX_PER_VALUE = 2;

    this.shaders = {};
    for(const shaderData of setupdata.shaders){
      try{
        let shader = new Shader(this.gl, shaderData.vCode, shaderData.fCode, shaderData.info, shaderData.name);
        this.shaders[shaderData.name] = shader;
      } catch(e){
        console.error(e);
        continue;
      }
    }

    // timelines objects compilation
    this.buffers = [];
    this.timelines = [];
    for(const timelineScatch of setupdata.timelines){
      const timeline = new Timeline({name: timelineScatch.description.name,
                                shader: this.shaders[timelineScatch.description.shader],
                                type: timelineScatch.description.type,
                                subnodes: timelineScatch.description.subnodes,
                                width: timelineScatch.description.width,
                                selected: timelineScatch.description.selected}, timelineScatch.completefunction);
      this.timelines.push({timeline: timeline, buffer: null, uptodate: false});
    }

    this.projectionMatrix = this.createIsometricProjection(this.canvas.width, this.canvas.height);

    this.subpoint = new Point(this.shaders["simple"]);
  }

  calcRelativeCoord(value: number){
    return value/200.0;
  }

  createIsometricProjection(canvasWidth: number, canvasHeight: number, centerX = .0, centerY = .0, near = 0.1, far = 100): mat4{
    const projectionMatrix = glMatrix.mat4.create();
    glMatrix.mat4.ortho(projectionMatrix,
                        this.calcRelativeCoord(-canvasWidth)+centerX, this.calcRelativeCoord(canvasWidth)+centerX,
                        this.calcRelativeCoord(-canvasHeight)+centerY, this.calcRelativeCoord(canvasHeight)+centerY,
                        near, far);
    return projectionMatrix;
  }

  draw(){
    this.clear();
    this.createBuffers();
    for(const tldata of this.timelines){
      if(tldata.buffer === null){
        console.error("Cannot draw timeline " + tldata.timeline.description.name + " because of null buffer");
        continue;
      }
      this.drawTimeline(tldata.timeline, tldata.buffer, tldata.timeline.buffersetup);
    }
    this.subpoint.drawPoint(this.projectionMatrix);
  }

  clear(){
    this.gl.clearColor(.0, .0, .0, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }

  createBuffers(){
    for(let i = 0; i < this.timelines.length; i++){
      if(this.timelines[i].buffer === null){
        let buffer = this.gl.createBuffer();
        if(buffer === null){
          throw new Error("GL buffer cannot be created");
        }
        this.timelines[i].buffer = buffer;
      }
      if(!this.timelines[i].uptodate){
        this.updateBuffer(this.timelines[i].buffer, this.timelines[i].timeline);
        this.timelines[i].uptodate = true;
      }
    }
  }

  updateBuffer(buffer: WebGLBuffer | null, timeline: Timeline){
    if(buffer == null){
      throw new Error("Cannot update null buffer")
    }
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    const triangleVertices = timeline.getTriangles();
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(triangleVertices), this.gl.STATIC_DRAW);
    timeline.buffersetup = {vertexCount: triangleVertices.length/2};
  }

  drawTimeline(timeline: Timeline, buffer: WebGLBuffer, buffinfo: { vertexCount: number}){
    this.gl.useProgram(timeline.description.shader.program);
    this.gl.uniformMatrix4fv(timeline.description.shader.uniformLocation.pMatrix, false, this.projectionMatrix);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.vertexAttribPointer(timeline.description.shader.attribLocation.vertexPosition,
                              this.VERTEX_PER_VALUE, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(timeline.description.shader.attribLocation.vertexPosition);

    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, buffinfo.vertexCount);
  }

  calcDistance(a: [number, number], b: [number, number]): number{
    return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
  }

  selectClosestSubnode(pixX:number, pixY:number){
    const n = this.calcRelativeCoord(this.canvas.width);
    const m = this.calcRelativeCoord(-this.canvas.width)
    let a = (n-m)/this.canvas.width;
    const x = a*pixX+m /* Dodać przesunięcie canvasa gdy będzie go obsługiwać kod */;
    const r = this.calcRelativeCoord(this.canvas.height);
    const p = this.calcRelativeCoord(-this.canvas.height);
    a = (r-p)/this.canvas.height;
    const y = -(a*pixY+p);

    // Select closest subpoint
    let closestSubpoint: null | {t: number, msg: string, timeline: Timeline} = null;
    for(let tl of this.timelines){
      let last: null | {t: number, msg: string} = null;

      for(let subn of tl.timeline.description.subnodes){
        if(last == null){
          last = subn;
          continue;
        }
        if(this.calcDistance(tl.timeline.getCoordsOfSubnode(subn.t), [x, y]) > this.calcDistance(tl.timeline.getCoordsOfSubnode(last.t), [x, y])) break;
        last = subn;
      }

      if(last == null) continue;
      else if(closestSubpoint == null){
        closestSubpoint = {t: last.t, msg: last.msg, timeline: tl.timeline};
      } else if(this.calcDistance(closestSubpoint.timeline.getCoordsOfSubnode(closestSubpoint.t), [x, y]) > this.calcDistance(tl.timeline.getCoordsOfSubnode(last.t), [x, y])){
        closestSubpoint = {t: last.t, msg: last.msg, timeline: tl.timeline};
      }
    }

    if(closestSubpoint == null) {
      console.warn("None subpoints found");
      return;
    }

    if(this.calcDistance(closestSubpoint.timeline.getCoordsOfSubnode(closestSubpoint.t), [x, y]) > maxdistancefrompoint) {
      if(this.subpoint.getVisible()){
        this.subpoint.setVisible(false);
        this.clear();
        this.draw();
      }
    } else{
      if(!this.subpoint.getVisible() || !closestSubpoint.timeline.getCoordsOfSubnode(closestSubpoint.t).every((v, i) => this.subpoint.getPosition()[i] == v)){
        this.subpoint.setPosition(closestSubpoint.timeline.getCoordsOfSubnode(closestSubpoint.t));
        this.subpoint.setSize(10/200 + closestSubpoint.timeline.description.width);
        this.subpoint.setVisible(true);
        this.clear();
        this.draw();
      }
    }
    // Add/Move if needed point
    // Clear board if needed
    // Redraw board if needed
  }
}
