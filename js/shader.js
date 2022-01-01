const vertShader = `#version 300 es
in vec3 pos_in;

uniform mat4 projectionMatrix;

void main(){
  gl_Position = projectionMatrix * vec4(pos_in, 1.0);
}
`;

const fragShader = `#version 300 es
precision mediump float;
out vec4 color_out;

void main(){
  color_out = vec4(1.0, 1.0, 1.0, 1.0);
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
      projectionMatrix: gl.getUniformLocation(program, 'projectionMatrix')
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
