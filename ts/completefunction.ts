import {Linear} from './linear.js';
import {Bezier} from './bezier.js';

export type Node = {
  x: number,
  y: number,
  d: number
};

export type Connector = {
  type: string
}

export type CompleteFunctionConfig = (Node | Connector)[]

export class CompleteFunction{
  /**
  * @param {Object[]} nclist sequence node, connector, node, [conector, ..., node]
  * @param {float} nclist[].x needed when describing node
  * @param {float} nclist[].y needed when describing node
  * @param {float} nclist[].d needed when describing node. Derivative in point (x, y)
  * @param {string} nclist[].type needed when describing connector. Type could be linear, sinus, arc
  **/
  monolits: (Bezier | Linear)[]
  constructor(nclist: CompleteFunctionConfig){
    if(nclist.length%2==0) throw Error("Invalid node connector list");
    const monolitsCount = Math.floor(nclist.length/2);
    this.monolits = [];
    for(let i = 0; i<monolitsCount; i++){
      // @ts-ignore
      this.monolits.push(this.createMonolitFunction(nclist[2*i], nclist[2*i+1].type, nclist[2*i+2]));
    }
  }

  createMonolitFunction(node1: Node, connector: string, node2: Node){
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
