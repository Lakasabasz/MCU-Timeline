type ShaderInfo = {
  attribLocation: Record<any, string>,
  uniformLocation: Record<any, string>
}

export class Shader{
  gl: WebGL2RenderingContext;
  name: string;
  program: WebGLProgram;
  attribLocation: Record<any, number>;
  uniformLocation: Record<any, WebGLUniformLocation>;

  constructor(gl: WebGL2RenderingContext, vShader: string, fShader: string, shaderInfo: ShaderInfo, name: string){
    this.gl = gl;
    const vSh = this.buildShader(gl.VERTEX_SHADER, vShader);
    const fSh = this.buildShader(gl.FRAGMENT_SHADER, fShader);
    if(vSh === null || fSh === null){
      throw new Error(name + " shader compilation failed");
    }

    const program = gl.createProgram();
    if(program === null){
      throw new Error("WebGL2 was not able to create shader program");
    }
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
      const location = gl.getUniformLocation(program, shaderInfo.uniformLocation[key]);
      if(location === null){
        throw new Error("Shader " + name + " not found uniform " + shaderInfo.uniformLocation[key]);
      }
      this.uniformLocation[key] = location;
    }

    this.name = name;
  }

  buildShader(shaderType: number, shaderSource: string){
    const shader = this.gl.createShader(shaderType);
    if(shader === null){
      throw new Error("WebGL was not able to create Shader");
    }

    this.gl.shaderSource(shader, shaderSource);

    this.gl.compileShader(shader);

    if(!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)){
      console.error(shaderType + ' shader compile error: ' + this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  getName(){
    return this.name;
  }
}
