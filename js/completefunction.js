import {Linear} from './linear.js';
import {Bezier} from './bezier.js';

export class CompleteFunction{
  /**
  * @param {Object[]} nclist sequence node, connector, node, [conector, ..., node]
  * @param {float} nclist[].x needed when describing node
  * @param {float} nclist[].y needed when describing node
  * @param {float} nclist[].d needed when describing node. Derivative in point (x, y)
  * @param {string} nclist[].type needed when describing connector. Type could be linear, sinus, arc
  **/
  constructor(nclist){
    if(nclist.length%2==0) throw Error("Invalid node connector list");
    const monolitsCount = Math.floor(nclist.length/2);
    this.monolits = [];
    for(let i = 0; i<monolitsCount; i++){
      this.monolits.push(this.createMonolitFunction(nclist[2*i], nclist[2*i+1].type, nclist[2*i+2]));
    }
  }

  createMonolitFunction(node1, connector, node2){
    if(connector == "linear") return new Linear(node1, node2);
    else if(connector == "bezier") return new Bezier(node1, node2);
    else throw Error("Unknown connector type");
  }

  getFullSpline(){
    let spline = this.monolits[0].getSpline();
    for(const mono of this.monolits.slice(1)){
      spline = spline.concat(mono.getSpline().slice(1));
    }
    return spline;
  }

}
