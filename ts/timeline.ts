import {CompleteFunction, CompleteFunctionConfig} from './completefunction.js';
import {TimelineType} from './timelinetypes.js';
import {Shader} from './shader.js';

type TimelineDescription = {
  type: TimelineType,
  shader: Shader,
  name: string,
  subnodes: {x: number, msg: string}[],
  width: number,
  selected: boolean
};

export class Timeline{
  description: TimelineDescription;
  func: CompleteFunction;
  buffersetup: { vertexCount: number; };
  constructor(description: TimelineDescription, functionScratch: CompleteFunctionConfig){
    this.description = {type: description.type,
                        shader: description.shader,
                        name: description.name,
                        subnodes: description.subnodes,
                        width: description.width,
                        selected: description.selected};
    this.func = new CompleteFunction(functionScratch);
    this.buffersetup = {vertexCount: 0};
  }

  getTriangles(){
    const fspl = this.func.getFullSpline();
    const r = this.description.width;
    let tpoints = [fspl[0][0], fspl[0][1]+r, fspl[0][0], fspl[0][1]-r];

    for(let i = 1; i<fspl.length; i++){
      const p0 = fspl[i-1];
      const p1 = fspl[i];

      const wp = [p1[0]-p0[0], p1[1]-p0[1]];
      const d = Math.sqrt((wp[0]*wp[0])+(wp[1]*wp[1]));
      let wp1 = [-wp[1], wp[0]];
      let wp2 = [wp[1], -wp[0]];

      wp1 = [wp1[0]/d, wp1[1]/d];
      wp2 = [wp2[0]/d, wp2[1]/d];

      wp1=[r*wp1[0], r*wp1[1]];
      wp2=[r*wp2[0], r*wp2[1]];

      wp1=[wp1[0] + p0[0], wp1[1] + p0[1]];
      wp2=[wp2[0] + p0[0], wp2[1] + p0[1]];

      tpoints = tpoints.concat(wp1);
      tpoints = tpoints.concat(wp2);
    }

    return tpoints;
  }
}
