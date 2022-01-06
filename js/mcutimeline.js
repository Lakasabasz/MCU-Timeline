import {WebGLScene} from './webglscene.js';

export class MCUTimeline{
  constructor(canvasid, setupdata){
    if(canvasid === undefined || setupdata === undefined){
      throw new Error("Missing arguments in MCUTimeline constructor");
    }
    const canvas = document.getElementById(canvasid);
    this.webglscene = new WebGLScene(canvas, setupdata);
  }
}
