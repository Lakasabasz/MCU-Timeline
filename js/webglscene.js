import {Shader} from './shader.js';
import {Timeline} from './timeline.js';


export class WebGLScene{
  constructor(canvas, setupdata){
    this.gl = canvas.getContext('webgl2');
    if(this.gl === null){
      throw new Error("WebGL2 not supported");
    }

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
    this.timelines = [];
    for(const timelineScatch of setupdata.timelines){
      console.log(timelineScatch);
      this.timelines.push(new Timeline({name: timelineScatch.description.name,
                                shader: this.shaders[timelineScatch.description.shader],
                                type: timelineScatch.description.type,
                                subnodes: timelineScatch.description.subnodes}, timelineScatch.completefunction))
    }
    console.log(this.timelines);
  }
}
