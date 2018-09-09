class ArrayBuffer
{
  
  constructor(_gl, _data, _attribs)
  {
    this.id = _gl.createBuffer ();
    _gl.bindBuffer (_gl.ARRAY_BUFFER, this.id);
    _gl.bufferData (_gl.ARRAY_BUFFER, _data, _gl.STATIC_DRAW);
    _gl.bindBuffer (_gl.ARRAY_BUFFER, null);

    this.gl = _gl;
    this.attribs = _attribs || [];
  }

  bind()
  {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.id);

    for (var i = 0; i < this.attribs.length; ++i)
    {
      var a = this.attribs [i];
      this.gl.enableVertexAttribArray(i);
      this.gl.vertexAttribPointer (i, a.size, a.type, a.normalized || false, a.stride || 0, a.offset || 0);
    }
  }

  unbind()
  {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);

    for (var i = 0; i < this.attribs.length; ++i)
    {
      this.gl.disableVertexAttribArray (i);
    }
  }

  draw(_cmd)
  {
    this.bind ();
    this.gl.drawArrays(_cmd.mode, _cmd.first || 0, _cmd.count);
    this.unbind ();
  }

}