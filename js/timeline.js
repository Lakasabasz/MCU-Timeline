import {CompleteFunction} from './completefunction.js';

export class Timeline{

  /**
  * @param {Object} description
  * @param {int} description.type
  * @param {Object} description.shader Skompilowany shader
  * @param {string} description.name Nazwa timeline
  * @param {Object[]} description.subnodes Lista node z informacjami
  * @param {float} description.width Szerokość linii (Domyślnie 0.1)
  * @param {bool} description.selected Domyślnie false
  * @param {Object[]} functionScratch
  **/
  constructor(description, functionScratch){
    this.description = this.validateDescription(description.type,
                                          description.shader,
                                          description.name,
                                          description.subnodes,
                                          description.width,
                                          description.selected);
    this.func = new CompleteFunction(functionScratch);
  }

  validateDescription(type, shader, name, subnodes, width=0.1, selected=false){
    if(!Number.isInteger(type) || type < 0 || type > 2){
      throw new TypeError("type is invalid");
    }
    if(shader == null){
      throw new TypeError("shader is null");
    }
    if(name === ""){
      throw new TypeError("name of timeline cannot be empty");
    }
    if(!Array.isArray(subnodes)){
      throw new TypeError("subnodes have to be list");
    }
    width = parseFloat(width);
    if(width < 0){
      throw new TypeError("width cannot be lower than 0");
    }
    if(selected !== false && selected !== true){
      throw new TypeError("selected have to be bool");
    }

    return {type: type, shader: shader, name: name, subnodes: subnodes, width: width, selected: selected};
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
