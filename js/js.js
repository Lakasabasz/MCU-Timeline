import {initShaderProgram} from './shader.js';
//import {glMatrix} from './gl-matrix-min.js';

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

  const buffers = initBuffers(gl);

  drawScene(gl, shaderProgram, buffers);
}

function rect(x, y, w, h){
  return [
    x+0.1, y+0.1,
    x, y+h,
    x+w, y,
    x+w, y+h
  ];
}

function initBuffers(gl){
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  const positions = rect(-0.5, -0.5, 1.0, 1.0);

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  return {position: positionBuffer}
}

function drawScene(gl, programInfo, buffers){
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  const projectionMatrix = glMatrix.mat4.create();
  const fov = 45 * Math.PI / 180;
  const aspect = gl.canvas.clientWidth/gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  glMatrix.mat4.perspective(projectionMatrix, fov, aspect, zNear, zFar);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
  const coordsPerVertex = 2
  gl.vertexAttribPointer(programInfo.attribLocation.vertexPosition, coordsPerVertex, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(programInfo.attribLocation.vertexPosition);

  gl.useProgram(programInfo.program);
  console.log(programInfo.uniformLocation);
  gl.uniformMatrix4fv(programInfo.uniformLocation.projectionMatrix, false, projectionMatrix);
  gl.uniform1i(programInfo.uniformLocation.othercolor, true);
  gl.uniform1i(programInfo.uniformLocation.ubool, false);
  let kolor = glMatrix.vec4.create();
  kolor[0] = 1.0;
  kolor[1] = 0.5;
  kolor[3] = 1.0;

  gl.uniform4fv(programInfo.uniformLocation.setcolor, kolor);

  const offset = 0;
  const vertexCount = 4;
  gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
}

window.onload=main;
