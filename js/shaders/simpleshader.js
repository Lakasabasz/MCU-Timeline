export const vertShader = `#version 300 es
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

export const fragShader = `#version 300 es
precision mediump float;
flat in int useVertexPaint;
in vec4 vertexColor;

out vec4 color_out;

void main(){
  color_out = vertexColor;
}
`;

export const shaderInfo = {
  attribLocation:{
    "vertexPosition": "pos_in"
  },
  uniformLocation:{
    enableVertexPainting: 'enableVertexPainting',
    pMatrix: 'pMatrix',
    vertexPaintColor: 'vertexPaintColor'
  }
}
