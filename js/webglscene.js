import {Shader} from './shader.js';

export class WebGLScene{
  constructor(canvas, setupdata){
    this.gl = canvas.getContext('webgl2');
    if(this.gl === null){
      throw new Error("WebGL2 not supported");
    }

    this.shaders = {};
    for(let shaderData of setupdata.shaders){
      try{
        let shader = Shader(this.gl, shaderData.vCode, shaderData.fCode, shaderData.info, shaderData.name);
        this.shaders[shaderData.name] = shader;
      } catch{
        continue;
      }
    }

    // timelines objects compilation
  }
}
