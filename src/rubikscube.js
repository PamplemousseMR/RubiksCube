var fps = { 
  startTime : 0,  
  frameNumber : 0,  
  getFPS : function()
  {    
    this.frameNumber++;   
    var d = new Date().getTime(),     
    currentTime = ( d - this.startTime ) / 1000,      
    result = Math.floor( ( this.frameNumber / currentTime ) );    
    if( currentTime > 1 )
    {      
      this.startTime = new Date().getTime();      
      this.frameNumber = 0;  
    }   
    return result;  
  } 
}

document.body.onkeypress=function(e)
{
	console.log(e.charCode);
  if(!rubik.isSafe() || rubik.resolv)return false;
  if(e.keyCode == 43)rubik.sens = 1;
  else if(e.keyCode == 45 || e.charCode == 45)rubik.sens = -1;
  else if(e.keyCode == 49 || e.charCode == 49)rubik.rotate = 1;
  else if(e.keyCode == 50 || e.charCode == 50)rubik.rotate = 2;
  else if(e.keyCode == 51 || e.charCode == 51)rubik.rotate = 3;
  else if(e.keyCode == 52 || e.charCode == 52)rubik.rotate = 4;
  else if(e.keyCode == 53 || e.charCode == 53)rubik.rotate = 5;
  else if(e.keyCode == 54 || e.charCode == 54)rubik.rotate = 6;
  else if(e.keyCode == 55 || e.charCode == 55)rubik.rotate = 7;
  else if(e.keyCode == 56 || e.charCode == 56)rubik.rotate = 8;
  else if(e.keyCode == 57 || e.charCode == 57)rubik.rotate = 9;
	else if(e.keyCode == 13 || e.charCode == 13)rubik.resolv = true;
  if( (e.keyCode != 43 && e.keyCode != 45 && e.keyCode>=49 && e.keyCode<=57) || (e.charCode != 43 && e.charCode != 45 && e.charCode>=49 && e.charCode<=57))
  {
    switch(rubik.rotate)
    {
      case 7:
        rubik.rotateZ(rubik.sens*rubik.tour,rubik.pos);
      break;
      case 8:
        rubik.rotateZ(rubik.sens*rubik.tour,0);
      break;
      case 9:
        rubik.rotateZ(rubik.sens*rubik.tour,-rubik.pos);
      break;
      case 1:
        rubik.rotateX(rubik.sens*rubik.tour,rubik.pos);
      break;
      case 2:
        rubik.rotateX(rubik.sens*rubik.tour,0);
      break;
      case 3:
        rubik.rotateX(rubik.sens*rubik.tour,-rubik.pos);
      break;
      case 4:
        rubik.rotateY(rubik.sens*rubik.tour,rubik.pos);
      break;
      case 5:
        rubik.rotateY(rubik.sens*rubik.tour,0);
      break;
      case 6:
        rubik.rotateY(rubik.sens*rubik.tour,-rubik.pos);
      break;
    }
  }
}

document.getElementById("canvas:rubikscube").onmousemove=function(e){
  if(rubik.turn){
    var rotX=(e.clientX-rubik.lastMousePos[0])/150
    var rotY=(e.clientY-rubik.lastMousePos[1])/150
    rubik.rubikRot=Matrix.MULTIPLY([Matrix.ROTATION([1,0,0],rotY),Matrix.ROTATION([0,1,0],rotX),rubik.rubikRot]);
    rubik.lastMousePos = [e.clientX, e.clientY];
  }
}

document.getElementById("canvas:rubikscube").onmousedown=function(e){
  rubik.lastMousePos = [e.clientX, e.clientY];
  rubik.turn=true;
}

document.getElementById("canvas:rubikscube").onmouseup=function(e){
  rubik.turn=false;
}

document.getElementById("canvas:rubikscube").onmouseout=function(e){
  rubik.turn=false;
}

var Rubikscube = function (canvas)
{
  this.stereo = false;
  this.cam =0.4;
  this.tab = new Array();
  this.resolv = false;
  this.i = 0;
  var c = document.getElementById (canvas);
  var gl = c.getContext ('webgl', {antialias: true});
  this.gl = gl;
  gl.enable(gl.DEPTH_TEST);
  this.program  = new Program (gl, Rubikscube.PROGRAM);
  rubik = this;
  this.recul = -12;
  //decalage de chaque cube
  this.pos = 2.0;
  //vitesse de rotation
  this.tour = Math.PI/20;
  //rotation general du rubikscube
  this.rubikRot = Matrix.MULTIPLY([Matrix.ROTATION([1,0,0],Math.PI/4),Matrix.ROTATION([0,1,0],7*Math.PI/4)]);
  this.turn = false;
  this.lastMousePos;

  //position de chaque cube
  this.POSITION = [0,0, -this.pos,this.pos, 0,this.pos, this.pos,this.pos, this.pos,0, this.pos,-this.pos, 0,-this.pos, -this.pos,-this.pos, -this.pos,0]
  this.quads = new Array();

  for(i=0;i<this.POSITION.length;i+=2){
      this.quads.push(new Quad(gl,this.POSITION[i],this.POSITION[i+1],0));
  }

  for(i=0;i<this.POSITION.length;i+=2){
      this.quads.push(new Quad(gl,this.POSITION[i],this.POSITION[i+1],this.pos));
  }

  for(i=0;i<this.POSITION.length;i+=2){
      this.quads.push(new Quad(gl,this.POSITION[i],this.POSITION[i+1],-this.pos));
  }

  //sens de rotation
  this.sens = 1;
  //face a faire tourner
  this.rotate = 1;
  this.animate ();
};

Rubikscube.prototype =
{
  constructor: Rubikscube,

  animate: function ()
  {
    var gl = this.gl;

    gl.clearColor (1.0,1.0, 1.0, 1.0);
    gl.clear (gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    this.program.use ();

    p = Matrix.PERSPECTIVE(45, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 100.0);
    this.program.uniforms ['P'] (p);
	
	if(this.resolv){
		switch(this.tab[this.tab.length-3-this.i]){
			case 'x':
				this.rotateX(3*this.tab[this.tab.length-2-this.i],this.tab[this.tab.length-1-this.i]);
			break;
			case 'y' :
				this.rotateY(3*this.tab[this.tab.length-2-this.i],this.tab[this.tab.length-1-this.i]);
			break;
			case 'z' :
				this.rotateZ(3*this.tab[this.tab.length-2-this.i],this.tab[this.tab.length-1-this.i]);
			break;
		}
		this.i+=3;
		if(this.i >= this.tab.length){
			this.resolv = false;
			this.i = 0;
			this.tab = new Array();
		}
	}
  else if(!this.isSafe())
    switch(this.rotate){
      case 7:
        this.rotateZ(this.sens*this.tour,this.pos);
      break;
      case 8:
        this.rotateZ(this.sens*this.tour,0);
      break;
      case 9:
        this.rotateZ(this.sens*this.tour,-this.pos);
      break;
      case 1:
        this.rotateX(this.sens*this.tour,this.pos);
      break;
      case 2:
        this.rotateX(this.sens*this.tour,0);
      break;
      case 3:
        this.rotateX(this.sens*this.tour,-this.pos);
      break;
      case 4:
        this.rotateY(this.sens*this.tour,this.pos);
      break;
      case 5:
        this.rotateY(this.sens*this.tour,0);
      break;
      case 6:
        this.rotateY(this.sens*this.tour,-this.pos);
      break;
    }

    this.draw();

    gl.useProgram (null);
    document.getElementById("fps").innerHTML= "FPS : "+fps.getFPS();
    requestAnimationFrame (this.animate.bind (this));
  },

  draw: function(){
    var x = 0;
    for(i=0 ; i<this.quads.length ; ++i)
    {
      var quad = this.quads[i];
        var placeCube = Matrix.TRANSLATION(quad.getX(),quad.getY(),quad.getZ());
        placeCube = Matrix.MULTIPLY([placeCube,quad.getR()]);
        var recul = Matrix.TRANSLATION(x,0,this.recul);
        var pos = Matrix.MULTIPLY([recul,this.rubikRot,placeCube]);
        this.program.uniforms ['M'] (pos);
        quad.draw();
    }
  },

  isSafe: function(){
    for(i=0;i<this.quads.length;i++){
      if(!this.quads[i].isSafe()) return false;
    }
    return true;
	
  },

  safe:function(ref,p,pos){
    var val;
    var safe;
    switch(p){
      case 'x':
        val=ref.getRX();
        safe = this.safeRX;
      break;
      case 'y':
        val=ref.getRY();
        safe = this.safeRY;
      break;
      case 'z':
        val=ref.getRZ();
        safe = this.safeRZ;
      break;
    }
    if(val>(Math.PI/2)-this.tour && val<(Math.PI/2)+this.tour)
      safe(Math.PI/2,pos);
    //demi tour
    else if(val>Math.PI-this.tour && val<Math.PI+this.tour)
      safe(Math.PI,pos);
    //3 quart tour
    else if(val>(3*Math.PI/2)-this.tour && val<(3*Math.PI/2)+this.tour)
      safe(3*Math.PI/2,pos);
    //un tour
    else if(val>-this.tour && val<this.tour)
      safe(0,pos);
    //- un quar de tour
    else if(val>(-Math.PI/2)-this.tour && val<(-Math.PI/2)+this.tour)
      safe(-Math.PI/2,pos);
    //- demi tour
    else if(val>-Math.PI-this.tour && val<-Math.PI+this.tour)
      safe(-Math.PI,pos);
    //-3 quart tour
    else if(val>(-3*Math.PI/2)-this.tour && ref.getRZ()<(-3*Math.PI/2)+this.tour)
      safe(-3*Math.PI/2,pos);
    },

  rotateZ : function(v,z){
	if(!rubik.resolv){
		rubik.tab.push('z');
		rubik.tab.push(v);
		rubik.tab.push(z);
	}
    var ref;
    for(i=0;i<this.quads.length;i++){
      var quad = this.quads[i];
      if(quad.getZ() == z){
        if(quad.getX() == 0 && quad.getY() == 0) ref = quad;
        quad.setR(Matrix.MULTIPLY([Matrix.ROTATION([0,0,1],v),quad.getR()]));
		quad.setRZ(quad.getRZ()+v);
        var pos = rotatePointZ({x:quad.getX(),y:quad.getY()},v);
        quad.setX(pos.x);
        quad.setY(pos.y);
      }
    }
    this.safe(ref,'z',z);
  },

  safeRZ: function(rot,z){
    for(i=0;i<rubik.quads.length;i++){
      var quad = rubik.quads[i];
      if(quad.getZ() == z){
          quad.setRZ(rot);
          rubik.safeMatrix(quad);
          var x = Math.round(quad.getX());
          if(x>0)quad.setX(rubik.pos);
          else if(x<0)quad.setX(-rubik.pos);
          else quad.setX(0);
          var y = Math.round(quad.getY());
          if(y>0)quad.setY(rubik.pos);
          else if(y<0)quad.setY(-rubik.pos);
          else quad.setY(0);
      }
    }
  },

  rotateX : function(v,x){
	if(!rubik.resolv){
		rubik.tab.push('x');
		rubik.tab.push(v);
		rubik.tab.push(x);
	}
    var ref;
    for(i=0;i<this.quads.length;i++){
      var quad = this.quads[i];
      if(quad.getX() == x){
        if(quad.getZ() == 0 && quad.getY() == 0) ref = quad;
        quad.setR(Matrix.MULTIPLY([Matrix.ROTATION([1,0,0],v),quad.getR()]));
		    quad.setRX(quad.getRX()+v);
        var pos = rotatePointX({y:quad.getY(),z:quad.getZ()},v);
        quad.setZ(pos.z);
        quad.setY(pos.y);
      }
    }
    this.safe(ref,'x',x);
  },

  safeRX: function(rot,x){
    for(i=0;i<rubik.quads.length;i++){
      var quad = rubik.quads[i];
      if(quad.getX() == x){
          quad.setRX(rot);
          rubik.safeMatrix(quad);
          var z = Math.round(quad.getZ());
          if(z>0)quad.setZ(rubik.pos);
          else if(z<0)quad.setZ(-rubik.pos);
          else quad.setZ(0);
          var y = Math.round(quad.getY());
          if(y>0)quad.setY(rubik.pos);
          else if(y<0)quad.setY(-rubik.pos);
          else quad.setY(0);
      }
    }
  },

  rotateY : function(v,y){
	if(!rubik.resolv){
		rubik.tab.push('y');
		rubik.tab.push(v);
		rubik.tab.push(y);
	}
    var ref;
    for(i=0;i<this.quads.length;i++){
      var quad = this.quads[i];
      if(quad.getY() == y){1
        if(quad.getX() == 0 && quad.getZ() == 0) ref = quad;
        quad.setR(Matrix.MULTIPLY([Matrix.ROTATION([0,1,0],v),quad.getR()]));
		    quad.setRY(quad.getRY()+v);
        var pos = rotatePointY({x:quad.getX(),z:quad.getZ()},v);
        quad.setX(pos.x);
        quad.setZ(pos.z);
      }
    }
    this.safe(ref,'y',y);
  },

  safeRY: function(rot,y){
    for(i=0;i<rubik.quads.length;i++){
      var quad = rubik.quads[i];
      if(quad.getY() == y){
          quad.setRY(rot);
          rubik.safeMatrix(quad);
          var x = Math.round(quad.getX());
          if(x>0)quad.setX(rubik.pos);
          else if(x<0)quad.setX(-rubik.pos);
          else quad.setX(0);
          var z = Math.round(quad.getZ());
          if(z>0)quad.setZ(rubik.pos);
          else if(z<0)quad.setZ(-rubik.pos);
          else quad.setZ(0);
      }
    }
  },

  safeMatrix: function(quad){
    var matrix = quad.getR();
    for(var k=0;k<matrix[0].length;k++){
      for(var j=0;j<matrix.length;j++){
        var temp= Math.floor(matrix[k][j]*10);
          if(temp>=10)matrix[k][j]=1;
          else if(temp<=-10)matrix[k][j]=-1;
          else matrix[k][j]=0;
      }   
    }
    quad.setR(matrix);
  }
};

Rubikscube.PROGRAM =
{
  attribs: ['a_position','a_color', 'a_normal'],

  uniforms: {'M' : 'mat4', 'P' : 'mat4'},

  vertex:
  [
    'precision mediump float;',
    'uniform mat4 M;',
    'uniform mat4 P;',
    'attribute vec3 a_position;',
    'attribute vec3 a_color;',
    'attribute vec3 a_normal;',
    'varying mat4 v_M;',
    'varying vec3 v_color;',
    'varying vec3 v_position;',  
    'varying vec3 v_normal;',
    'varying vec3 v_vertPos;',

    'void main ()',
    '{',
      'v_color = a_color;',
      'v_position = a_position;',
      'gl_Position = P * M * vec4 (a_position, 1);',

      'v_vertPos = vec3(M * vec4(a_position, 1.0));',
      'v_M = M;',
      'v_normal = a_normal;',
    '}'
  ].join ('\n'),

  fragment:
  [
    'precision mediump float;',
    'varying mat4 v_M;',
    'varying vec3 v_color;',
    'varying vec3 v_position;',  
    'varying vec3 v_normal;',
    'varying vec3 v_vertPos;',


    'const vec3 lightPos = vec3(0.0,0.0,0.0);',
    'const vec3 viewPos = vec3(0,0,0);',
    'const vec3 ambientColor = vec3(0.005, 0.005, 0.005);',
    'const vec3 specColor = vec3(0.3, 0.3, 0.3);',
    'const float shininess = 25.0;',
    'const float screenGamma = 2.2;',
    'const float PI_4 = 0.785398163397448309616/1.5;',

    'bool isInCercle(float x,float y, float a, float b, float r){',
        'return ((x-a)*(x-a)+(y-b)*(y-b) < r*r);',
    '}',

     'vec3 rotateX(vec3 normal, float a) {',
       'mat3 rotX = mat3(vec3(1.0 ,0.0    ,0.0     ),',
                        'vec3(0.0 ,cos(a) ,-sin(a) ),',
                        'vec3(0.0 ,sin(a) ,cos(a)) );',
        'vec3 res = rotX*normal;',
        'return res;',
    '}',

    'vec3 rotateY(vec3 normal, float a) {',
       'mat3 rotY = mat3(vec3(cos(a)  ,0.0 ,sin(a)  ),',
                        'vec3(0.0     ,1.0 ,0.0     ),',
                        'vec3(-sin(a) ,0.0 ,cos(a)) );',
        'vec3 res = rotY*normal;',
        'return res;',
    '}',

    'vec3 rotateZ(vec3 normal, float a) {',
       'mat3 rotZ = mat3(vec3(cos(a) ,-sin(a) ,0.0  ),',
                        'vec3(sin(a) ,cos(a)  ,0.0  ),',
                        'vec3(0.0    ,0.0     ,1.0) );',
        'vec3 res = rotZ*normal;',
        'return res;',
    '}',

    'void main ()',
    '{',
      'float delta = 0.15;',
      'vec3 color = vec3(0,0,0);',

      'float x = v_position.x;',
      'float y = v_position.y;',
      'float z = v_position.z;',
      'if(isInCercle(x,y,   -1.0+delta*2.0,-1.0+delta*2.0,   delta)',
        '|| isInCercle(x,y,   1.0-delta*2.0,-1.0+delta*2.0,   delta)',
        '|| isInCercle(x,y,   1.0-delta*2.0,1.0-delta*2.0,   delta)',
        '|| isInCercle(x,y,   -1.0+delta*2.0,1.0-delta*2.0,   delta))',
        'color = v_color;',

      'else if(isInCercle(x,z,   -1.0+delta*2.0,-1.0+delta*2.0,   delta)',
        '|| isInCercle(x,z,   1.0-delta*2.0,-1.0+delta*2.0,   delta)',
        '|| isInCercle(x,z,   1.0-delta*2.0,1.0-delta*2.0,   delta)',
        '|| isInCercle(x,z,   -1.0+delta*2.0,1.0-delta*2.0,   delta))',
        'color = v_color;',

      'else if(isInCercle(y,z,   -1.0+delta*2.0,-1.0+delta*2.0,   delta)',
        '|| isInCercle(y,z,   1.0-delta*2.0,-1.0+delta*2.0,   delta)',
        '|| isInCercle(y,z,   1.0-delta*2.0,1.0-delta*2.0,   delta)',
        '|| isInCercle(y,z,   -1.0+delta*2.0,1.0-delta*2.0,   delta))',
        'color = v_color;',

      'else if((x>-1.0+delta && x<1.0-delta && y>-1.0+2.0*delta && y<1.0-2.0*delta)',
         '|| (x>-1.0+2.0*delta && x<1.0-2.0*delta && y>-1.0+delta && y<1.0-delta))',
        'color = v_color;',

      'else if((x>-1.0+delta && x<1.0-delta && z>-1.0+2.0*delta && z<1.0-2.0*delta)',
         '|| (x>-1.0+2.0*delta && x<1.0-2.0*delta && z>-1.0+delta && z<1.0-delta))',
        'color = v_color;',

      'else if((y>-1.0+delta && y<1.0-delta && z>-1.0+2.0*delta && z<1.0-2.0*delta)',
         '|| (y>-1.0+2.0*delta && y<1.0-2.0*delta && z>-1.0+delta && z<1.0-delta))',
        'color = v_color;',

      'vec3 normal= v_normal;',

       'if(color == vec3(0,0,0)){',
      //z = 1
        'if(z > 0.999){',
      //x gauche 
          'if(x < -1.0+delta){',
            'float angle = abs (x+(1.0-delta));',
            'normal = rotateY(normal,PI_4*angle*10.0);',
          '}',
      //x droite
          'else if(x > 1.0-delta){',
            'float angle = x-(1.0-delta);',
            'normal = rotateY(normal,-PI_4*angle*10.0);',
          '}',
      //y haut
          'if(y > 1.0-delta){',
            'float angle = y-(1.0-delta);',
            'normal = rotateX(normal,PI_4*angle*10.0);',
          '}',
      //y bas
          'else if(y < -1.0+delta){',
            'float angle = abs (y+(1.0-delta));',
            'normal = rotateX(normal,-PI_4*angle*10.0);',
          '}',
        '}',


      //z = -1
        'else if(z < -0.999){',
      //x gauche 
          'if(x < -1.0+delta){',
            'float angle = abs (x+(1.0-delta));',
            'normal = rotateY(normal,-PI_4*angle*10.0);',
          '}',
      //x droite
          'else if(x > 1.0-delta){',
            'float angle = x-(1.0-delta);',
            'normal = rotateY(normal,PI_4*angle*10.0);',
          '}',
      //y haut
          'if(y > 1.0-delta){',
            'float angle = y-(1.0-delta);',
            'normal = rotateX(normal,-PI_4*angle*10.0);',
          '}',
      //y bas
          'else if(y < -1.0+delta){',
            'float angle = abs (y+(1.0-delta));',
            'normal = rotateX(normal,PI_4*angle*10.0);',
          '}',
        '}',


      //x = 1
        'else if(x > 0.999){',
      //x droite 
          'if(z < -1.0+delta){',
            'float angle = abs (z+(1.0-delta));',
            'normal = rotateY(normal,-PI_4*angle*10.0);',
          '}',
      //x gauche
          'else if(z > 1.0-delta){',
            'float angle = z-(1.0-delta);',
            'normal = rotateY(normal,PI_4*angle*10.0);',
          '}',
      //y haut
          'if(y > 1.0-delta){',
            'float angle = y-(1.0-delta);',
            'normal = rotateZ(normal,-PI_4*angle*10.0);',
          '}',
      //y bas
          'if(y < -1.0+delta){',
            'float angle = abs (y+(1.0-delta));',
            'normal = rotateZ(normal,PI_4*angle*10.0);',
          '}',
        '}',


      //x = -1
        'else if(x < -0.999){',
      //x gauche 
          'if(z < -1.0+delta){',
            'float angle = abs (z+(1.0-delta));',
            'normal = rotateY(normal,PI_4*angle*10.0);',
          '}',
      //x droite
          'else if(z > 1.0-delta){',
            'float angle = z-(1.0-delta);',
            'normal = rotateY(normal,-PI_4*angle*10.0);',
          '}',
      //y haut
          'if(y > 1.0-delta){',
            'float angle = y-(1.0-delta);',
            'normal = rotateZ(normal,PI_4*angle*10.0);',
          '}',
      //y bas
          'if(y < -1.0+delta){',
            'float angle = abs (y+(1.0-delta));',
            'normal = rotateZ(normal,-PI_4*angle*10.0);',
          '}',
        '}',


      //y = 1
        'else if(y > 0.999){',
      //x gauche 
          'if(x < -1.0+delta){',
            'float angle = abs (x+(1.0-delta));',
            'normal = rotateZ(normal,-PI_4*angle*10.0);',
          '}',
      //x droite
          'else if(x > 1.0-delta){',
            'float angle = x-(1.0-delta);',
            'normal = rotateZ(normal,PI_4*angle*10.0);',
          '}',
      //y bas
          'if(z > 1.0-delta){',
            'float angle = z-(1.0-delta);',
            'normal = rotateX(normal,-PI_4*angle*10.0);',
          '}',
      //y haut
          'if(z < -1.0+delta){',
            'float angle = abs (z+(1.0-delta));',
            'normal = rotateX(normal,PI_4*angle*10.0);',
          '}',
        '}',

      //y = -1
        'else if(y < -0.999){',
      //x gauche 
          'if(x < -1.0+delta){',
            'float angle = abs (x+(1.0-delta));',
            'normal = rotateZ(normal,PI_4*angle*10.0);',
          '}',
      //x droite
          'else if(x > 1.0-delta){',
            'float angle = x-(1.0-delta);',
            'normal = rotateZ(normal,-PI_4*angle*10.0);',
          '}',
      //y bas
          'if(z > 1.0-delta){',
            'float angle = z-(1.0-delta);',
            'normal = rotateX(normal,PI_4*angle*10.0);',
          '}',
      //y haut
          'if(z < -1.0+delta){',
            'float angle = abs (z+(1.0-delta));',
            'normal = rotateX(normal,-PI_4*angle*10.0);',
          '}',
        '}',
      '}',

      'normal = vec3(v_M * vec4(normal, 0.0));',
      'normal = normalize(normal);',
      'vec3 lightDir = normalize(lightPos-v_vertPos);',
      'vec3 viewDir = normalize(viewPos-v_vertPos);',

      'float lambertian = max(dot(lightDir,normal), 0.0);',
      'float specular = 0.0;',

      'if(lambertian > 0.0) {',
        'vec3 halfDir = normalize(lightDir + viewDir);',
        'float specAngle = max(dot(halfDir, normal), 0.0);',
        'specular = pow(specAngle, shininess);',
      '}',
      'vec3 colorLinear = ambientColor +lambertian*color + specular*specColor;',
      'vec3 colorGammaCorrected = pow(colorLinear, vec3(1.0/screenGamma));',   
      'gl_FragColor = vec4(colorGammaCorrected,1);',
    '}',
  ].join ('\n')
};

var rotatePointZ = function (p, a) {
    var s = Math.sin (a), c = Math.cos (a);
    return {x: p.x * c - p.y * s, y: p.x * s + p.y * c};
}

var rotatePointX = function (p, a) {
    var s = Math.sin (a), c = Math.cos (a);
    return {y: p.y * c - p.z * s, z: p.y * s + p.z * c};
}

var rotatePointY = function (p, a) {
    var s = Math.sin (a), c = Math.cos (a);
    return {z: p.z * c - p.x * s, x: p.z * s + p.x * c};
}
