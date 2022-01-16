import {Shader} from './shader.js';
import {Timeline} from './timeline.js';
import * as glMatrix from './gl-matrix/index.js';


export class WebGLScene{
  constructor(canvas, setupdata){
    this.gl = canvas.getContext('webgl2');
    if(this.gl === null){
      throw new Error("WebGL2 not supported");
    }
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
                                subnodes: timelineScatch.description.subnodes}, timelineScatch.completefunction);
      this.timelines.push({timeline: timeline, buffer: null, uptodate: false});
    }

    this.projectionMatrix = this.createIsometricProjection(this.canvas.width, this.canvas.height);
  }

  createIsometricProjection(canvasWidth, canvasHeight, centerX = .0, centerY = .0, near = 0.1, far = 100){
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
        this.timelines[i].buffer = this.gl.createBuffer();
      }
      if(!this.timelines[i].uptodate){
        this.updateBuffer(this.timelines[i].buffer, this.timelines[i].timeline);
        this.timelines[i].uptodate = true;
      }
    }
  }

  updateBuffer(buffer, timeline){
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    const triangleVertices = timeline.getTriangles();
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(triangleVertices), this.gl.STATIC_DRAW);
    timeline.buffersetup = {vertexCount: triangleVertices.length/2};
  }

  drawTimeline(timeline, buffer, buffinfo){
    console.log(timeline.description.shader);
    this.gl.useProgram(timeline.description.shader.program);
    this.gl.uniformMatrix4fv(timeline.description.shader.uniformLocation.pMatrix, false, this.projectionMatrix);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.vertexAttribPointer(timeline.description.shader.attribLocation.vertexPosition,
                              this.VERTEX_PER_VALUE, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(timeline.description.shader.attribLocation.vertexPosition);

    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, buffinfo.vertexCount);
  }
}
