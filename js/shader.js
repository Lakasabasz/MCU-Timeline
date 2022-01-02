const vertShader = `#version 300 es
in vec3 pos_in;

flat out int useVertexPaint;
out vec4 vertexColor;

uniform bool enableVertexPainting;
uniform vec4 vertexPaintColor;
uniform mat4 pMatrix;

void main(){
  if(!enableVertexPainting){
    vertexColor = vec4(0.0, 0.5, 1.0, 1.0);
  } else{
    vertexColor = vertexPaintColor;
  }
  useVertexPaint = 1;
  gl_Position = vec4(pos_in, 1.0) * pMatrix;
}
`;

const fragShader = `#version 300 es
precision mediump float;
flat in int useVertexPaint;
in vec4 vertexColor;

out vec4 color_out;

void main(){
  color_out = vertexColor;
}
`;

export function initShaderProgram(gl){
  const vShader = loadShader(gl, gl.VERTEX_SHADER, vertShader);
  const fShader = loadShader(gl, gl.FRAGMENT_SHADER, fragShader);

  const program = gl.createProgram();
  gl.attachShader(program, vShader);
  gl.attachShader(program, fShader);
  gl.linkProgram(program);

  if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
    console.error('Linking shader program error: ' + gl.getProgramInfoLog(program));
    return null;
  }

  return {
    program: program,
    attribLocation: {
      vertexPosition: gl.getAttribLocation(program, 'pos_in')
    },
    uniformLocation: {
      // Vertex Shader
      enableVertexPainting: gl.getUniformLocation(program, 'enableVertexPainting'),
      pMatrix: gl.getUniformLocation(program, 'pMatrix'),
      vertexPaintColor: gl.getUniformLocation(program, 'vertexPaintColor')
    }
  };
}

function loadShader(gl, type, source){
  const shader = gl.createShader(type);

  gl.shaderSource(shader, source);

  gl.compileShader(shader);

  if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
    console.error(type + ' shader compile error: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}
