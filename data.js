class Data
{

  static FLATTEN(_t)
  {
    return (_t instanceof Array) ? _t.reduce(function (f, e) {return f.concat(Data.FLATTEN(e));}, []) : _t;
  };

  static FLOAT32(_t)
  {
    return new Float32Array(Data.FLATTEN(_t));
  };

}