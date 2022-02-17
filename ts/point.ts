import { Shader } from "./shader.js"

export class Point{
  visible: boolean;
  position: [number, number];
  size: number;
  shader: Shader;
  buffer: WebGLBuffer | null;
  gl: WebGL2RenderingContext;
  VERTEXES = 32;

  constructor(shader: Shader, position: [number, number] = [0.0, 0.0], visible: boolean = false, size: number = 6/200){
    this.visible = visible;
    this.position = position;
    this.size = size;
    this.shader = shader;
    this.gl = shader.gl;
    this.buffer = null;
    if(visible){
      this.generateBuffer();
      this.updateBuffer();
    }
  }

  generateBuffer(){
    this.buffer = this.gl.createBuffer();
    if(this.buffer == null){
      throw new Error("WebGL was not able to create buffer");
    }
  }

  updateBuffer(){
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    const points = this.generateVerices();
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(points), this.gl.STATIC_DRAW);
  }

  generateVerices(): number[]{
    let points = this.position;
    for(let i = 0; i<=this.VERTEXES; i++){
      points.push(this.size*Math.cos(2*i*Math.PI/this.VERTEXES) + this.position[0]);
      points.push(this.size*Math.sin(2*i*Math.PI/this.VERTEXES) + this.position[1]);
    }
    return points;
  }

  drawPoint(projectionMatrix: mat4){
    if(!this.visible) return;
    if(this.buffer == null){
      this.generateBuffer();
    }
    this.updateBuffer();
    
    this.gl.useProgram(this.shader.program);
    this.gl.uniformMatrix4fv(this.shader.uniformLocation.pMatrix, false, projectionMatrix);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    this.gl.vertexAttribPointer(this.shader.attribLocation.vertexPosition,
                              2, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(this.shader.attribLocation.vertexPosition);

    this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, this.VERTEXES+2);
  }

  setVisible(state: boolean){
    this.visible = state;
  }

  getVisible(){
    return this.visible;
  }

  setSize(size: number){
    this.size = size;
  }

  setPosition(position: [number, number]){
    this.position = position;
  }

  getPosition(){
    return this.position;
  }
}
