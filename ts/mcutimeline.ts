import {WebGLScene, SetupData} from './webglscene.js';


export class MCUTimeline{
  webglscene: WebGLScene;

  constructor(canvasid: string, setupdata: SetupData){
    const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById(canvasid);
    if(canvas === null){
      throw new Error("<canvas> with id " + canvasid + " not exists");
    }

    canvas.onmousemove = this.onMouseMoveHandler;

    this.webglscene = new WebGLScene(canvas, setupdata);
    this.webglscene.draw();
  }

  onMouseMoveHandler(event: MouseEvent){
    console.log(event.clientX, event.clientY);
  }
}
