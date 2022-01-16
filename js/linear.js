import {MonolitFunction} from './monolitfunction.js';

export class Linear extends MonolitFunction{
  /**
  * @param {Object} node1
  * @param {float} node1.x
  * @param {float} node1.y
  * @param {float} node1.d
  * @param {Object} node2
  * @param {float} node2.x
  * @param {float} node2.y
  * @param {float} node2.d
  **/
  constructor(node1, node2){
    if(node1.x == node2.x){
      throw new Error("Nodes x value is invalid");
    }
    if(node1.d != node2.d){
      console.warn("Derivative in nodes are diffrent. This settings will be ignored, but node will be sharp.");
    }
    super();

    this.a = (node1.y - node2.y)/(node1.x - node2.x);
    this.b = node1.y - this.a*node1.x;
    this.x = [node1.x, node2.x];
    if(node1.x > node2.x) this.x = [node2.x, node1.x];
  }

  getSpline(){
    const p0 = [this.x[0], this.a*this.x[0]+this.b];
    const p1 = [this.x[1], this.a*this.x[1]+this.b];
    return [p0, p1];
  }
}
