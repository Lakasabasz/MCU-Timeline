import {initShaderProgram} from './shader.js';
//import {rect} from './shapes.js';
import {createBuffer, drawScene} from './wgl-tools.js';
import * as glMatrix from './gl-matrix/index.js';

console.log(glMatrix);

function main(){
  const canvas = document.getElementsByTagName("canvas")[0];
  const gl = canvas.getContext("webgl2");

  if(gl === null){
    alert("Unable to initialize WebGL");
    return;
  } else {
    console.log('WebGL initialized ' + gl.getParameter(gl.SHADING_LANGUAGE_VERSION));
  }

  const shaderProgram = initShaderProgram(gl);

  const timeline = arc();
  console.log(timeline);

  const buffers = [
    createBuffer(gl, timeline, [0.0, 2.0/3, 1.0, 1.0])
  ];

  drawScene(gl, shaderProgram, buffers);
}

function f(x, x1, y1, y2, y3){
  const l = -y1*x*Math.cos(Math.atan((y2-y3)/(x*y1)) - (x*x1)/2);
  const m = 2*Math.sin((-x*x1)/2)*Math.cos(Math.atan((y2-y3)/(x*y1)));
  return l/m - y2;
}

function fsolve(x1, y1, y2, y3, a=0.000001, eps=0.001){
  if(x1 == 0 || y1 == 0){
    console.error("x1 == 0 || y1 == 0");
    return null;
  }

  let argset = [x1, y1, y2, y3];
  let b = 2*Math.PI/x1;
  let mid = 0;
  let fmid = 0;
  if(f(a, ...argset) * f(b, ...argset) > 0){
    console.warn(...argset);
    console.warn("Cannot fully solve f");
  }
  while(b-a >= eps){
    mid = (a+b)/2;
    fmid = f(mid, ...argset);
    if(fmid > 0) a = mid;
    else if (fmid < 0) b = mid;
    else return mid;
  }
  return (a+b)/2;
}

function h(f0, x1, y1, y2, y3){
  return -(Math.atan((y2-y3)/(f0*y1))-(f0*x1)/2);
}

function a(f0, h0, x1, y1){
  return -y1/(Math.sin(-h0) - Math.sin(f0*x1-h0));
}

function v(a0, h0){
  return -a0*Math.sin(-h0);
}

function arcSin(x, a0, f0, h0, v0){
  return a0*Math.sin(x*f0-h0) + v0;
}

function dArcSin(x, a0, f0, h0){
  return a0*f0*Math.cos(f0*x-h0);
}

// <x0, x1>, linear: bool,
function genSpline(funcList, next = 0.01){
  let points = [];
  for(const fdata of funcList){
    if(fdata['linear']){
      let x = fdata['x0'];
      let alfa = Math.atan(fdata['a']);
      let step = next * Math.cos(alfa);
      let b = fdata['y0'] - fdata['a']*x;
      while(x < fdata['x1']){
        points.push([x, fdata['a']*x+b]);
        x += step;
      }
    } else{
      let shiftVector = [fdata['x0'], fdata['y0']];
      let x1 = fdata['x1']-fdata['x0'];
      let x = 0.0;
      while(x < x1){
        points.push([x + shiftVector[0], arcSin(x, fdata['a'], fdata['f'], fdata['h'], fdata['v']) + shiftVector[1]]);
        let alfa = Math.atan(dArcSin(x, fdata['a'], fdata['f'], fdata['h']));
        let step = next * Math.cos(alfa);
        x += step;
      }
    }
  }
  return points;
}

function arc(){
  /* y=0 dla <-2; 0)
  *  y=asin(fx-h)+v dla <0; 1>
  *  y=x dla (1; 2)
  */

  // Obliczamy współczynniki dla sinusa
  let f0 = fsolve(1, 1, 0, 1);
  let h0 = h(f0, 1, 1, 0, 1);
  let a0 = a(f0, h0, 1, 1);
  let v0 = v(a0, h0);

  const functionSettings = [
    {'linear': true, 'x0': -2, 'y0': 0, 'a': 0, 'x1': 0},
    {'linear': false, 'x0': 0, 'y0': 0, 'a': a0, 'f': f0, 'h': h0, 'v': v0, 'x1': 1},
    {'linear': true, 'x0': 1, 'y0': 1, 'a': 1, 'x1': 2}
  ];

  // Obliczamy punkty dla funkcji
  let points = genSpline(functionSettings, 0.1);

  // Obliczamy wierzchołki trójkątów
  let width = 0.1/2;
  let vertexes = [];

  for(const p of points){
    let func=null;
    for(const fSet of functionSettings){
      if(fSet['x0'] <= p[0] && p[0] <= fSet['x1']){
        func = fSet;
        break;
      }
    }

    if(func['linear']){
      if(func['a'] == 0){
        vertexes = vertexes.concat([p[0], p[1]+width]);
        vertexes = vertexes.concat([p[0], p[1]-width]);
      } else{
        let alfa = Math.atan(-1/func['a']);
        vertexes = vertexes.concat([p[0] + width*Math.cos(alfa), p[1] + width*Math.sin(alfa)]);
        vertexes = vertexes.concat([p[0] - width*Math.cos(alfa), p[1] - width*Math.sin(alfa)]);
      }
    } else{
      let a = dArcSin(p[0], func['a'], func['f'], func['h']);
      if(a == 0){
        vertexes = vertexes.concat([p[0], p[1]+width]);
        vertexes = vertexes.concat([p[0], p[1]-width]);
      } else{
        let alfa = Math.atan(-1/a);
        vertexes = vertexes.concat([p[0] + width*Math.cos(alfa), p[1] + width*Math.sin(alfa)]);
        vertexes = vertexes.concat([p[0] - width*Math.cos(alfa), p[1] - width*Math.sin(alfa)]);
      }
    }
  }

  return vertexes;
}

window.onload=main;
