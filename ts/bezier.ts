import {MonolitFunction} from './monolitfunction.js';

export class Bezier extends MonolitFunction{
  pk: number[][]

  constructor(node1: {x: number, y: number, d: number}, node2: {x: number, y: number, d: number}){
    super();
    // Obliczenie punktu kontrolnego
    const b1 = node1.y-node1.d*node1.x;
    const b2 = node2.y-node2.d*node2.x;
    const x = (b2-b1)/(node1.d-node2.d);
    const y = node1.d*x+b1;

    if((node1.x == x && node1.y == y) || (node2.x == x && node2.y == y)){
      throw new Error("Choosen nodes their derivatives leaves no space for arc");
    }

    this.pk = [[node1.x, node1.y], [x, y], [node2.x, node2.y]];
  }

  B(newton: number, i: number, t: number){
    return newton*Math.pow(1-t, 2-i)*Math.pow(t, i);
  }

  getSpline(){
    let p = [];
    const steps = 100;
    const move = 1/steps;

    for(let i = 0; i<steps; i++){
      let point = [0.0, 0.0];
      const current = move*i;
      p.push(this.getCoords(current));
    }
    return p;
  }

  getCoords(t: number): [number, number] {
    let point = [0, 0];
    point[0] = this.pk[0][0]*this.B(1, 0, t) + this.pk[1][0]*this.B(2, 1, t) + this.pk[2][0]*this.B(1, 2, t);
    point[1] = this.pk[0][1]*this.B(1, 0, t) + this.pk[1][1]*this.B(2, 1, t) + this.pk[2][1]*this.B(1, 2, t);
    return <[number, number]>point;
  }

}
