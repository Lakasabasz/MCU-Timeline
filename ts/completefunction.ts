import {Linear} from './linear.js';
import {Bezier} from './bezier.js';
import { MonolitFunction } from './monolitfunction.js';

type Node = {
  x: number,
  y: number,
  d: number
};

type Connector = {
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
  monolits: MonolitFunction[];
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

  getCoordsByDistance(t: number) {
    return this.monolits[Math.trunc(t)].getCoords(t-Math.trunc(t));
  }

  minimumDistanceFrom(point: [number, number]): number {
    let dist = Number.POSITIVE_INFINITY;
    for(const monolit of this.monolits){
      if(dist > monolit.distanceFromPoint(point)) dist = monolit.distanceFromPoint(point);
    }
    return dist;
  }
}
