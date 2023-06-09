import {WebGLScene, SetupData} from './webglscene.js';


export class MCUTimeline{
  webglscene: WebGLScene;

  constructor(canvasid: string, setupdata: SetupData){
    const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById(canvasid);
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;

    if(canvas === null){
      throw new Error("<canvas> with id " + canvasid + " not exists");
    }

    canvas.onmousemove = (event) => {this.onMouseMoveHandler(event);};
    canvas.onclick = (event) => {this.onMouseClick(event);};

    this.webglscene = new WebGLScene(canvas, setupdata);
    this.webglscene.draw();
  }

  onMouseMoveHandler(event: MouseEvent){
    const canvas: HTMLCanvasElement = <HTMLCanvasElement>event.target;
    this.webglscene.selectClosestSubnode(event.clientX-canvas.offsetLeft, event.clientY-canvas.offsetTop);
  }

  onMouseClick(event: MouseEvent){
    const canvas: HTMLCanvasElement = <HTMLCanvasElement>event.target;
    this.webglscene.selectClosestTimeline(event.clientX-canvas.offsetLeft, event.clientY-canvas.offsetTop);
  }
}
