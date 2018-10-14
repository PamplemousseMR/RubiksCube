class Program
{
  constructor(_gl, _params)
  {
    var id = _gl.createProgram();

    _gl.attachShader(id, Program.SHADER(_gl, _gl.VERTEX_SHADER,   _params.vertex));
    _gl.attachShader(id, Program.SHADER(_gl, _gl.FRAGMENT_SHADER, _params.fragment));

    _gl.linkProgram(id);
    if(! _gl.getProgramParameter(id, _gl.LINK_STATUS))
    {
      throw gl.getProgramInfoLog(id);
    }

    for(var i = 0; i < _params.attribs.length; ++i)
    {
      _gl.bindAttribLocation(id, i, _params.attribs[i]);
    }

    this.uniforms = {};
    for(var name in _params.uniforms)
    {
      switch(_params.uniforms[name])
      {
        case 'int'   : this.uniforms[name] = Program.UNIFORM1i(_gl, id, name); break;

        case 'float' : this.uniforms[name] = Program.UNIFORM1f(_gl, id, name); break;

        case 'vec2'  : this.uniforms[name] = Program.UNIFORM2fv(_gl, id, name); break;
        case 'vec3'  : this.uniforms[name] = Program.UNIFORM3fv(_gl, id, name); break;
        case 'vec4'  : this.uniforms[name] = Program.UNIFORM4fv(gl, id, name); break;

        case 'mat2'  : this.uniforms[name] = Program.UNIFORMMATRIX2fv(_gl, id, name); break;
        case 'mat3'  : this.uniforms[name] = Program.UNIFORMMATRIX3fv(_gl, id, name); break;
        case 'mat4'  : this.uniforms[name] = Program.UNIFORMMATRIX4fv(_gl, id, name); break;
      }
    }

    this.gl = _gl;
    this.id = id;
  }

  use()
  {
    this.gl.useProgram(this.id);
  }

  static SHADER(gl, type, source)
  {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if(! gl.getShaderParameter(shader, gl.COMPILE_STATUS))
      throw gl.getShaderInfoLog(shader);

    return shader;
  }

  static SOURCE(id)
  {
    return document.getElementById(id).textContent;
  }

  static LOCATION(gl, id, name)
  {
    return gl.getUniformLocation(id, name);
  }

  static UNIFORM1(gl, id, name, f)
  {
    var l = Program.LOCATION(gl, id, name);
    return function(x)
    {
      f.call(gl, l, x);
    };
  }

  static UNIFORM1i(gl, id, name) 
  {
    return Program.UNIFORM1(gl, id, name, gl.uniform1i);
  }

  static UNIFORM1f(gl, id, name) 
  {
    return Program.UNIFORM1(gl, id, name, gl.uniform1f);
  }

  static UNIFORMfv(gl, id, name, f)
  {
    var l = Program.LOCATION(gl, id, name);
    return function(v){
      f.call(gl, l, new Float32Array(v));
    };
  }

  static UNIFORM2fv(gl, id, name) 
  {
    return Program.UNIFORMfv(gl, id, name, gl.uniform2fv);
  }

  static UNIFORM3fv(gl, id, name) 
  {
    return Program.UNIFORMfv(gl, id, name, gl.uniform3fv);
  }

  static UNIFORM4fv(gl, id, name) 
  {
    return Program.UNIFORMfv(gl, id, name, gl.uniform4fv);
  }

  static UNIFORMMATRIXfv(gl, id, name, f)
  {
    var l = Program.LOCATION(gl, id, name);
    return function(m) {f.call(gl, l, false, Data.FLOAT32(m));};
  }

  static UNIFORMMATRIX2fv(gl, id, name) 
  {
    return Program.UNIFORMMATRIXfv(gl, id, name, gl.uniformMatrix2fv);
  }

  static UNIFORMMATRIX3fv(gl, id, name) 
  {
    return Program.UNIFORMMATRIXfv(gl, id, name, gl.uniformMatrix3fv);
  }

  static UNIFORMMATRIX4fv(gl, id, name) 
  {
    return Program.UNIFORMMATRIXfv(gl, id, name, gl.uniformMatrix4fv);
  }

}