class Quad
{
  constructor(_gl, _x, _y, _z)
  {
    this.rx = 0;
    this.ry = 0;
    this.rz = 0;
    this.x = _x;
    this.y = _y;
    this.z = _z;
    this.r = Matrix.ID;

    var poscolor = new Array();
    var k = 0;
    for(var i = 0;i<6; ++i)
    {
      for(var j = 0;j<6; ++j)
      {
        poscolor.push(Quad.VERTICES[  Quad.INDICES[k++]  ]);
        poscolor.push(Quad.COLOR[i]);
        poscolor.push(Quad.NORMAL[i]);
      }
    }

   var vPoint = Data.FLOAT32 (poscolor);
   var a = {size: 3, type: _gl.FLOAT, offset :  0, stride: 36};
   var b = {size: 3, type: _gl.FLOAT, offset : 12, stride: 36};
   var c = {size: 3, type: _gl.FLOAT, offset : 24, stride: 36};

   this.vbo = new ArrayBuffer(_gl,vPoint, [a,b,c])

   this.cmd = {mode: _gl.TRIANGLES, offset: 0, count: 36};
 }

  draw()
  {
    this.vbo.draw(this.cmd);
  }

  isSafe()
  {
    return (this.rx==0 || this.rx==Math.PI/2 || this.rx==Math.PI || this.rx==3*Math.PI/2 || this.rx==-Math.PI/2 || this.rx==-Math.PI || this.rx==-3*Math.PI/2) && (this.ry==0 || this.ry==Math.PI/2 || this.ry==Math.PI || this.ry==3*Math.PI/2  || this.ry==-Math.PI/2 || this.ry==-Math.PI || this.ry==-3*Math.PI/2) && (this.rz==0 || this.rz==Math.PI/2 || this.rz==Math.PI || this.rz==3*Math.PI/2  || this.rz==-Math.PI/2 || this.rz==-Math.PI || this.rz==-3*Math.PI/2) 
  }

  getX()
  {
    return this.x;
  }

  getY()
  {
    return this.y;
  }

  getZ()
  {
    return this.z;
  }

  setX(x)
  {
    this.x=x;
  }

  setY(y)
  {
    this.y=y;
  }

  setZ(z)
  {
    this.z=z;
  }

  getRX()
  {
    return this.rx;
  }

  getRY()
  {
    return this.ry;
  }

  getRZ()
  {
    return this.rz;
  }

  setRX(r)
  {
    this.rx = r % (Math.PI*2);
  }

  setRY(r)
  {
    this.ry = r % (Math.PI*2);
  }
    
  setRZ(r)
  {
    this.rz = r % (Math.PI*2);
  }
  
  setR(r,axe)
  {
    this.r = r;
  }
  
  getR()
  {
    return this.r;
  }
}

Quad.VERTICES = [
  [-1, +1, +1],
  [+1, +1, +1],
  [-1, -1, +1],
  [+1, -1, +1],

  [-1, +1, -1],
  [+1, +1, -1],
  [-1, -1, -1],
  [+1, -1, -1]
]

Quad.COLOR = [
  [1, 0, 0], //red
  [0, 0, 1], //blue
  [1, 0.20, 0], //orange
  [0, 1, 0], //green
  [1, 1, 1], //white
  [1, 1, 0] //yellow
]

Quad.NORMAL = [
  [0, 0, 1],
  [1, 0, 0],
  [0, 0, -1],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
]

Quad.INDICES = [0,1,2,2,1,3   ,1,5,3,5,3,7  ,4,5,6,6,5,7  ,0,4,2,2,4,6  ,0,4,5,0,5,1  ,2,6,7,2,7,3];