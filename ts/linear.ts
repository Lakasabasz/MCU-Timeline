import {MonolitFunction} from './monolitfunction.js';

export class Linear extends MonolitFunction{
  a: number
  b: number
  x: [number, number]
  constructor(node1: {x: number, y:number, d:number}, node2: {x: number, y:number, d:number}){
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

  getCoords(t: number): [number, number] {
    const x = (this.x[1]-this.x[0])*t + this.x[0];
    return [x, this.a*x+this.b];
  }

  distanceFromPoint(point: [number, number]): number {
    // Weryfikacja gdzie jest przecięcie
    const c = point[0] + this.a*point[1];
    const x = (c-this.a*this.b)/(this.a*this.a + 1);
    const y = this.a*x+this.b;

    // Obliczenie odległości w zależności od przecięcia
    if(x < this.x[0]){
      return Math.abs(point[0] - this.x[0]) + Math.abs(point[1] - (this.a * this.x[0] + this.b));
    } else if(x > this.x[1]){
      return Math.abs(point[0] - this.x[1]) + Math.abs(point[1] - (this.a * this.x[1] + this.b));
    } else{
      return Math.abs(point[0] - x) + Math.abs(point[1] - y);
    }
  }
}
