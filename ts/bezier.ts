import {MonolitFunction} from './monolitfunction.js';

export class Bezier extends MonolitFunction{
  pk: [number, number][]

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

  distanceFromPoint(point: [number, number]): number {
    let A = [this.pk[1][0]-this.pk[0][0], this.pk[1][1]-this.pk[0][1]]; // self.x - v.x, self.y - v.y
    let B = [this.pk[2][0] - this.pk[1][0] - A[0], this.pk[2][1] - this.pk[1][1] - A[1]];
    let V = [this.pk[0][0] - point[0], this.pk[0][1] - point[1]];

    let result = this.solver(B[0]*B[0]+B[1]*B[1],
                            3*(A[0]*B[0]+A[1]*B[1]),
                            2 * (A[0]*A[0]+A[1]*A[1]) + (B[0]*V[0]+B[1]*V[1]),
                            A[0]*V[0] + A[1]*V[1]);
    let valid = result.filter(function(a){return a >= 0 && a <=1});
    let points: {point: [number, number], distance: number}[] = [];
    for(const a of valid){
      let v = this.getCoords(a);
      points.push({point: v, distance: Math.abs(point[0]-v[0]) + Math.abs(point[1]-v[1])})
    }

    points.push({point: this.pk[0], distance: Math.abs(point[0]-this.pk[0][0]) + Math.abs(point[1]-this.pk[0][1])});
    points.push({point: this.pk[2], distance: Math.abs(point[0]-this.pk[2][0]) + Math.abs(point[1]-this.pk[2][1])});

    let min = Number.POSITIVE_INFINITY;
    for(let p of points){
      if(min > p.distance){
        min = p.distance;
      }
    }
    return min;
  }

  solver(a: number, b: number, c:number, d:number) {
    var zero = 0.0000001,
    //JavaScript fail to evaluate cube root from negative number - NaN
    //http://www.ecma-international.org/ecma-262/5.1/#sec-15.8.2.13
        cbrt = function (a: number) {
            return a >= 0 ? Math.pow(a, 1 / 3) : -Math.pow(-a, 1 / 3);
        };
    if (Math.abs(a) > zero) {
        // normalize, convert to form: x3 + ax2 + bx + c = 0
        b = b / a;
        c = c / a;
        d = d / a;

        var p = c - b * b / 3,
            q = b * (2 * b * b - 9 * c) / 27 + d,
            p3 = p * p * p,
            D = q * q + 4 * p3 / 27,
            subst = -b / 3;

        if (D > zero) {
            D = Math.sqrt(D)
            var u = cbrt((-q + D) / 2),
                v = cbrt((-q - D) / 2);

            return [u + v + subst];
        } else if (D < -zero) {
            //If (D < 0) => p < 0, change sign of p
            var u = 2 * Math.sqrt(-p / 3),
            v = Math.acos(-Math.sqrt(-27 / p3) * q / 2) / 3;
            return [u * Math.cos(v) + subst,
                u * Math.cos(v + 2 * Math.PI / 3) + subst,
                u * Math.cos(v + 4 * Math.PI / 3) + subst];
        } else {
            // D zero
            var u = -cbrt(q / 2);
            return [2 * u + subst, -u + subst];
        }
    } else {
        // a = 0, 2nd degree equation: ax3+bx2+cx+d => bx2+cx+d
        if (Math.abs(b) <= zero) {
            if (Math.abs(c) <= zero)
                return [];
            else
                return [-d / c];
        }
        var D = c * c - 4 * b * d;
        if (D > zero) {
            D = Math.sqrt(D);
            return [(-c - D) / (2 * b), (-c + D) / (2 * b)];
        } else if (D < -zero) {
            return [];
        } else { //D = 0
            return [-c / (2 * b)];
        }
    }
  }
}
