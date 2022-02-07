import {Shader} from './shader.js';
import {Timeline} from './timeline.js';
import {TimelineType} from './timelinetypes.js'
import {CompleteFunctionConfig} from './completefunction.js';
//@ts-ignore
import * as glMatrix from './gl-matrix/index.js';

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
  subnodes:{x: number, msg: string}[],
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
  }

  createIsometricProjection(canvasWidth: number, canvasHeight: number, centerX = .0, centerY = .0, near = 0.1, far = 100): mat4{
    const projectionMatrix = glMatrix.mat4.create();
    glMatrix.mat4.ortho(projectionMatrix,
                        (-canvasWidth/200.0)+centerX, (canvasWidth/200.0)+centerX,
                        (-canvasHeight/200.0)+centerY, (canvasHeight/200.0)+centerY,
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
}
