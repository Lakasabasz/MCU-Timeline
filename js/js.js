import {initShaderProgram} from './shader.js';
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

  const buffers = [
    createBuffer(gl, [
      -1.0, 0.0,
      -1.0, 1.0,
      0.0, 0.66,
      0.0, 0.33,
      -1.0, 0.0,
      1.0, 1.0,
      0.0, 0.66,
      1.0, 0.0,
      0.0, 0.33
    ], [1.0, .0, .0, 1.0]),
    createBuffer(gl, rect(-1.0, -1.0, 2.0, 0.5), [1.0, 0.5, 0.0, 1.0])
  ];

  drawScene(gl, shaderProgram, buffers);
}

function rect(x, y, w, h){
  return [
    x, y,
    x, y+h,
    x+w, y,
    x+w, y+h
  ];
}

function createBuffer(gl, pointList = rect(-0.5, -0.5, 1.0, 1.0), vertexPaintColor = null){
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  const positions = pointList;

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  return {
    position: positionBuffer,
    valuesPerVertex: 2,
    vertexPaintColor: vertexPaintColor,
    offset: 0,
    vertexCount: pointList.length/2
  };
}

function clearScreen(gl, color=[.0, .0, .0, 1.0]){
  gl.clearColor(...color);
  gl.clear(gl.COLOR_BUFFER_BIT);
}

/**
* @param {int} canvasWidth in pixels
* @param {int} canvasHeight in pixels
* @param {float} centerX shift in screen independent coords
* @param {float} centerY shift in screen independent coords
**/
function createIsometricProjection(canvasWidth, canvasHeight, centerX = .0, centerY = .0, near = 0.1, far = 100){
  const projectionMatrix = glMatrix.mat4.create();
  glMatrix.mat4.ortho(projectionMatrix,
                      (-canvasWidth/200.0)+centerX, (canvasWidth/200.0)+centerX,
                      (-canvasHeight/200.0)+centerY, (canvasHeight/200.0)+centerY,
                      near, far);
  return projectionMatrix;
}

function drawScene(gl, programInfo, buffers){
  clearScreen(gl);

  gl.useProgram(programInfo.program);
  const projectionMatrix = createIsometricProjection(gl.canvas.width, gl.canvas.height);
  gl.uniformMatrix4fv(programInfo.uniformLocation.pMatrix, false, projectionMatrix);

  for(const buffer of buffers){
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer.position);
    gl.vertexAttribPointer(programInfo.attribLocation.vertexPosition, buffer.valuesPerVertex, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programInfo.attribLocation.vertexPosition);

    if(buffer.vertexPaintColor !== null){
      gl.uniform1i(programInfo.uniformLocation.enableVertexPainting, true);
      gl.uniform4fv(programInfo.uniformLocation.vertexPaintColor, buffer.vertexPaintColor);
    }

    const offset = buffer.offset;
    const vertexCount = buffer.vertexCount;
    gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
  }
}

window.onload=main;
