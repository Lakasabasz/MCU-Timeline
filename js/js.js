import {createBuffer, drawScene} from './wgl-tools.js';
import {MCUTimeline} from './mcutimeline.js';
import * as simpleShader from './shaders/simpleshader.js';
import {TimelineType} from './timelinetypes.js';
import {Linear} from './linear.js';

let mcutimeline = null;

let setupdata = {
  shaders: [
    {vCode: simpleShader.vertShader, fCode: simpleShader.fragShader, info: simpleShader.shaderInfo, name: "simple"}
  ],
  timelines:[
    {
      description: {
        type: TimelineType.COMPLEX,
        shader: "simple",
        selected: false,
        width: 1.0/100,
        subnodes: [
          {x: -1.0, msg: 'Punkt A'},
          {x: 0.0, msg: 'Punkt B'}
        ],
        name: "test"
      },
      completefunction: [
        {x: -2.0, y: 0.0, d: 0.0},
        {type: "linear"},
        {x: -1.0, y: 0.0, d: 0.0},
        {type: "sinus"},
        {x: 0.5, y: 1.0, d: 1.0},
        {type: "linear"},
        {x: 2.5, y: 3.0, d: 1.0}
      ]
    }
  ]
};

function load(){
  let abstracttest = new Linear();
  mcutimeline = new MCUTimeline("canvas", setupdata);
}

function main(){
  const canvas = document.getElementsByTagName("canvas")[0];
  const gl = canvas.getContext("webgl2");

  if(gl === null){
    alert("Unable to initialize WebGL");
    return;
  } else {
    console.log('WebGL initialized ' + gl.getParameter(gl.SHADING_LANGUAGE_VERSION));
  }

  wglcore.loadShader(simpleShader.vertShader, simpleShader.fragShader, simpleShader.shaderInfo, "simple");

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
  const p0x = 0.0;
  const p0y = 0.0;
  const dp0 = 0.0;
  const p1x = 1.5;
  const p1y = 1.0;
  const dp1 = 1.0;

  let f0 = fsolve(p1x, p1y, dp0, dp1);
  let h0 = h(f0, p1x, p1y, dp0, dp1);
  let a0 = a(f0, h0, p1x, p1y);
  let v0 = v(a0, h0);

  const functionSettings = [
    {'linear': true, 'x0': -2, 'y0': 0, 'a': dp0, 'x1': p0x},
    {'linear': false, 'x0': p0x, 'y0': p0y, 'a': a0, 'f': f0, 'h': h0, 'v': v0, 'x1': p1x},
    {'linear': true, 'x0': p1x, 'y0': p1y, 'a': dp1, 'x1': 2}
  ];

  // Obliczamy punkty dla funkcji
  let points = genSpline(functionSettings, 0.1);
  console.log(points);

  // Obliczamy wierzchołki trójkątów
  let width = 0.05/2;
  let vertexes = [];

  for(const p of points){
    let func=null;
    for(const fSet of functionSettings){
      if(fSet['x0'] <= p[0] && p[0] <= fSet['x1']){
        func = fSet;
        break;
      }
    }

    let a = null;
    if(func['linear']){
      a = func['a'];
    } else{
      a = dArcSin(p[0], func['a'], func['f'], func['h']);
    }

    if(a == 0){
      vertexes = vertexes.concat([p[0], p[1]+width]);
      vertexes = vertexes.concat([p[0], p[1]-width]);
    } else{
      let alfa = Math.atan(-1/a);
      vertexes = vertexes.concat([p[0] + width*Math.cos(alfa), p[1] + width*Math.sin(alfa)]);
      vertexes = vertexes.concat([p[0] - width*Math.cos(alfa), p[1] - width*Math.sin(alfa)]);
    }
  }

  return vertexes;
}

window.onload=load;
