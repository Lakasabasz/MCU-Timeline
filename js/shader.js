export class Shader{
  constructor(gl, vShader, fShader, shaderInfo, name){
    this.gl = gl;
    const vSh = this.buildShader(gl.VERTEX_SHADER, vShader);
    const fSh = this.buildShader(gl.FRAGMENT_SHADER, fShader);
    if(vSh === null || fSh === null){
      throw new Error(name + " shader compilation failed");
    }

    const program = gl.createProgram();
    gl.attachShader(program, vSh);
    gl.attachShader(program, fSh);
    gl.linkProgram(program);

    if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
      console.error('Linking shader program error: ' + gl.getProgramInfoLog(program));
      throw new Error(name + " shader linking error");
    }
    this.program = program;

    this.attribLocation = {};
    this.uniformLocation = {};
    for(const key of Object.keys(shaderInfo.attribLocation)){
      this.attribLocation[key] = gl.getAttribLocation(program, shaderInfo.attribLocation[key]);
    }
    for(const key of Object.keys(shaderInfo.uniformLocation)){
      this.uniformLocation[key] = gl.getUniformLocation(program, shaderInfo.uniformLocation[key]);
    }
  }

  buildShader(shaderType, shaderSource){
    const shader = this.gl.createShader(shaderType);

    this.gl.shaderSource(shader, shaderSource);

    this.gl.compileShader(shader);

    if(!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)){
      console.error(shaderType + ' shader compile error: ' + this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
      return null;
    }

    return shader;
  }
}
