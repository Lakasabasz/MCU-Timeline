import {Linear} from './linear.js';

export class CompleteFunction{
  /**
  * @param {Object[]} nclist sequence node, connector, node, [conector, ..., node]
  * @param {float} nclist[].x needed when describing node
  * @param {float} nclist[].y needed when describing node
  * @param {float} nclist[].d needed when describing node. Derivative in point (x, y)
  * @param {string} nclist[].type needed when describing connector. Type could be linear, sinus, arc
  **/
  constructor(nclist){
    //
  }

  createMonolitFunction(node1, connector, node2){
    //
  }

  getFullSpline(){
    //
  }
}
