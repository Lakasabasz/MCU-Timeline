import {MonolitFunction} from './monolitfunction.js';

export class Bezier extends MonolitFunction{
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
    super();
    // Obliczenie punktu kontrolnego
    const b1 = node1.y-node1.d*node1.x;
    const b2 = node2.y-node2.d*node2.x;
    const x = (b2-b1)/(node1.d-node2.d);
    const y = node1.d*x+b1;

    if((node1.x == x && node1.y == y) || (node2.x == x && node2.y == y)){
      throw new Error("Choosen nodes their derivatives leaves no space for arc");
    }

    this.pk = [(node1.x, node1.y), (x, y), (node2.x, node2.y)];
  }
}
