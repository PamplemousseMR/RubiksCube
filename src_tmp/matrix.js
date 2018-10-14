class Matrix
{

  static ROTATION(_axis, _angle)
  {
    var c = Math.cos(_angle);
    var s = Math.sin(_angle);
    var t = 1 - c;
    var x = _axis[0], y = _axis[1], z = _axis[2];
    var tx = t * x, ty = t * y;
    return [
      [tx * x + c,     tx * y + s * z, tx * z - s * y, 0],
      [tx * y - s * z, ty * y + c,     ty * z + s * x, 0],
      [tx * z + s * y, ty * z - s * x, t  * z * z + c, 0],
      [0,              0,              0,              1]
    ];
  };

  static TRANSLATION(_x, _y, _z)
  {
    return [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [_x, _y, _z, 1]
    ];
  };

  static TRANSPOSE(_m)
  {
    return _m[0].map(function (col, c){
      return _m.map(function (row, r){
          return _m[r][c];
      });
    });
  };

  static MULTIPLY(_m)
  {
    var m1 = Matrix.TRANSPOSE(_m.shift());
    var m2 = _m.length > 1 ? Matrix.MULTIPLY(_m) : _m[0];
    return m2.map(function (row) {
      return m1.map(function (col) {
        return col.reduce(function (sum, v, k) {
          return sum + v * row[k];
        }, 0);
      });
    });
  };

  static PERSPECTIVE(_angle, _r, _n, _f)
  {
    var a = 1 / Math.tan(_angle / 2);
    return [
      [a/_r, 0,           0,  0],
      [  0, a,           0,  0],
      [  0, 0, (_n+_f)/(_n-_f), -1],
      [  0, 0, 2*_n*_f/(_n-_f),  0]
    ];
  }

}

Matrix.ID = [
  [1, 0, 0, 0],
  [0, 1, 0, 0],
  [0, 0, 1, 0],
  [0, 0, 0, 1]
];