function setupMyCanvas(width_, height_, type, framerate){

  // detects keypresses
  window.addEventListener("keydown", function(e) {
    if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
      e.preventDefault();
    }
  }, false);
  
  // ratio of width-height. Uses to scale everything onto a bigger screen without ruining the porportion
  var ratio = width_/height_;
    
  //finds the biggest scale factor for the window
	var sz = windowHeight;
	if(sz*ratio > windowWidth){
		sz = windowWidth*(height_/width_);
	}

  // create the canvas and position it
	var canvas = createCanvas(sz*ratio, sz, type);
	canvas.position((windowWidth-width)/2, (windowHeight-height)/2);
	canvas.id("myCanvas");
	scaleFactor = sz/height_;
	
  // other presets
	frameRate(framerate);
	angleMode(DEGREES);
	pixelDensity(2);
	
}

// turns a dataset into an image for textures
function imagify(dataset, sz){
  if(!sz){
    sz = 1;
  }
  var temp;
  var p = dataset.data;
  if(sz === 1){
    temp = createImage(dataset.width*sz, dataset.height*sz);
    temp.loadPixels();
    for(var i = 0; i < p.length; i += 4){
      temp.pixels[i] = p[i];
      temp.pixels[i+1] = p[i+1];
      temp.pixels[i+2] = p[i+2];
      temp.pixels[i+3] = 255;
    }
    temp.updatePixels();
  }else{
    temp = createGraphics(dataset.width*sz, dataset.height*sz);
    temp.noStroke();
    for (var x = 0; x < temp.width; x += sz) {
      for (var y = 0; y < temp.height; y += sz) {
        var idx = (y/sz * dataset.width + x/sz) * 4;
        temp.fill(color(p[idx], p[idx+1], p[idx+2]));
        temp.rect(x, y, sz, sz);
      }
    }
  }
  
  return temp;
}

var world = [];
var ms;
var gfx;
var displayFrameRate = 0;
var drawPlayer;

function setup() {
  setupMyCanvas(windowWidth, windowHeight, P2D, 60);
  ms = millis();
  gfx = createGraphics(windowWidth, windowHeight, WEBGL);
  gfx.angleMode(DEGREES);

  for(var x = 0; x < 5000; x += 200){
    for(var z = 0; z < 5000; z += 200){
      world.push({
        // x, y, z
        x: x,
        y: noise(x * 0.005, z * 0.005) * 1,
        z: z,
        // width, height, length
        w: 200,
        h: 200,
        l: 200,
        // type
        t: 1 + floor(random(0, 6)),
      });
      if(world[world.length - 1].t === 1){
        world[world.length - 1].y += 200;
      }
    }
  }

  drawPlayer = function(x, y, z, s, spin, legMovement){
    gfx.push();
      gfx.translate(x, y + 75, z);
      gfx.scale(s);
      gfx.rotateY(180 + spin);
      gfx.rotateX(90);
      
      gfx.noStroke();
      
      gfx.push();
        gfx.fill(233, 150, 106);
        gfx.box(100, 100, 80);
        
        gfx.translate(0, 0, -50);
        gfx.fill(149, 100, 75);
        gfx.box(100, 100, 20);
        
        gfx.translate(0, 0, 190);
        gfx.fill(77, 80, 83);
        gfx.box(120, 60, 200);
        
        gfx.translate(0, 0, 130);
        gfx.fill(44, 46, 47);
        gfx.box(124, 64, 60);
      gfx.pop();
      
      gfx.push();
        gfx.translate(-80, -30, 105);
        gfx.rotateX(45);
        gfx.rotateY(10);
        gfx.fill(77, 80, 83);
        gfx.box(50, 50, 120);
      gfx.pop();
      gfx.push();
        gfx.translate(-70, -26, 120);
        gfx.rotateX(-45);
        gfx.rotateY(-10);
        gfx.translate(0, -60, -40);
        gfx.fill(77, 80, 83);
        gfx.box(50, 50, 100);
      gfx.pop();
      gfx.push();
        gfx.translate(-70, -26, 120);
        gfx.rotateX(-45);
        gfx.rotateY(-10);
        gfx.translate(0, -60, -100);
        gfx.fill(237, 247, 255);
        gfx.box(56, 56, 20);
      gfx.pop();
      gfx.push();
        gfx.translate(-70, -26, 120);
        gfx.rotateX(-45);
        gfx.rotateY(-10);
        gfx.translate(0, -60, -120);
        gfx.fill(255, 173, 122);
        gfx.box(50, 50, 20);
      gfx.pop();
      
      gfx.push();
        gfx.translate(80, -30, 105);
        gfx.rotateX(45);
        gfx.rotateY(-30);
        gfx.fill(77, 80, 83);
        gfx.box(50, 50, 120);
      gfx.pop();
      gfx.push();
        gfx.translate(37, -101, 146);
        gfx.rotateX(95);
        gfx.rotateY(-30);
        gfx.fill(77, 80, 83);
        gfx.box(50, 50, 100);
      gfx.pop();
      gfx.push();
        gfx.translate(37, -101, 146);
        gfx.rotateX(95);
        gfx.rotateY(-30);
        gfx.translate(0, 0, 60);
        gfx.fill(237, 247, 255);
        gfx.box(56, 56, 20);
      gfx.pop();
      gfx.push();
        gfx.translate(37, -101, 146);
        gfx.rotateX(95);
        gfx.rotateY(-30);
        gfx.translate(0, 0, 80);
        gfx.fill(255, 173, 122);
        gfx.box(50, 50, 20);
      gfx.pop();
      
      gfx.push();
        gfx.translate(-30, 0, 285);
        gfx.rotateX(legMovement);
        gfx.translate(0, 0, 75);
        
        gfx.fill(44, 46, 47);
        gfx.box(60, 50, 150);
        
        gfx.translate(0, 0, 100);
        gfx.fill(50, 53, 54);
        gfx.box(60, 50, 50);
      gfx.pop();
      
      gfx.push();
        gfx.translate(30, 0, 285);
        gfx.rotateX(-legMovement);
        gfx.translate(0, 0, 75);
        
        gfx.fill(44, 46, 47);
        gfx.box(60, 50, 150);
        
        gfx.translate(0, 0, 100);
        gfx.fill(50, 53, 54);
        gfx.box(60, 50, 50);
      gfx.pop();
      
    gfx.pop();
  };
  
}

var keys = [];
function keyPressed(){
  keys[keyCode] = true;
}
function keyReleased(){
  keys[keyCode] = false;
}

var player = {
  px: 1000,
  py: 600,
  pz: 0,
  x: 1000,
  y: 600,
  z: 0,
  xVel: 0,
  yVel: 0,
  zVel: 0,
  jumping: false,
  speed: 3,
  directionSpeed: 0,
  direction: 0,
};

var tempRotX = 0;
var tempRotY = 0;
var msLag = 0;
var realFrameRate = 0;
var frameCountTimer = 0;

function box_boxColl(ax, ay, az, aw, ah, al, bx, by, bz, bw, bh, bl) {
  var a = {
    minX: ax - aw / 2,
    maxX: ax + aw / 2,
    minY: ay - ah / 2,
    maxY: ay + ah / 2,
    minZ: az - al / 2,
    maxZ: az + al / 2
  };
  
  var b = {
    minX: bx - bw / 2,
    maxX: bx + bw / 2,
    minY: by - bh / 2,
    maxY: by + bh / 2,
    minZ: bz - bl / 2,
    maxZ: bz + bl / 2
  };
   
  return (a.minX <= b.maxX && a.maxX >= b.minX) && (a.minY <= b.maxY && a.maxY >= b.minY) && (a.minZ <= b.maxZ && a.maxZ >= b.minZ);
}

var fly = false;

function move(){
  player.px = player.x;
  player.py = player.y;
  player.pz = player.z;


  if(keys[87] || keys[83] || keys[65] || keys[68]){
    player.xVel += (-sin(tempRotY + degrees(player.direction)) * player.directionSpeed * player.speed) / 5 * (40 / realFrameRate);
    player.zVel += (cos(tempRotY + degrees(player.direction)) * player.directionSpeed * player.speed) / 5 * (40 / realFrameRate);
  }
  if(keys[87] && keys[65]) {
    if(!fly){player.directionSpeed = 3*(2/3);}
    else{player.directionSpeed = 9*(2/3);}
    player.direction = 0.25*PI;
  }else 
  if(keys[87] && keys[68]) {
    if(!fly){player.directionSpeed = 3*(2/3);}
    else{player.directionSpeed = 9*(2/3);}
    player.direction = 1.75*PI;
  }else 
  if(keys[83] && keys[65]) {
    if(!fly){player.directionSpeed = 3*(1/2);}
    else{player.directionSpeed = 9*(1/2);}
    player.direction = 0.75*PI;
  }else 
  if(keys[83] && keys[68]) {
    if(!fly){player.directionSpeed = 3*(1/2);}
    else{player.directionSpeed = 9*(1/2);}
    player.direction = 1.25*PI;
  }else 
  if(keys[87]) {
    player.direction = 0;
    if(!fly){player.directionSpeed = 3;}
    else{player.directionSpeed = 9;}
  }else
  if(keys[83]) {
    if(!fly){player.directionSpeed = 3*(1/2);}
    else{player.directionSpeed = 9*(1/2);}
    player.direction = PI;
  }else
  if(keys[65]) {
    if(!fly){player.directionSpeed = 3*(2/3);}
    else{player.directionSpeed = 9*(2/3);}
    player.direction = PI/2;
  }else
  if(keys[68]) {
    if(!fly){player.directionSpeed = 3*(2/3);}
    else{player.directionSpeed = 9*(2/3);}
    player.direction = 1.5*PI;
  }else {
    player.directionSpeed = 0;
  }

  //Move Up
  if(keys[32] && !player.jumping && !fly){
    player.yVel = 22 * (40 / realFrameRate);
    player.jumping = true;
  }
  if(keys[32] && fly){
    player.yVel = 22 * (40 / realFrameRate);
  }else if(keys[16] && fly){
    player.yVel = -22 * (40 / realFrameRate);
  }else if(fly){
      player.yVel = 0
  }
  if(!fly){
    player.yVel -= (40 / realFrameRate) * (40 / realFrameRate);
  }
   //THIS IS GRAVITY
  player.y += player.yVel;

  player.zVel *= 0.9;
  player.xVel *= 0.9;

  player.x += player.xVel;
  player.z += player.zVel;

}

//PLEASE DO NOT MESS UP THIS CODE IT TOOK ME SO LONG
function collisions(){
  player.jumping = true;
  for(var i = 0; i < world.length; i++){
    var block = world[i];
    
    // y collisions
    if(box_boxColl(
      player.x, player.y + 100, player.z, 100, 2 * abs(player.yVel), 100,
      block.x, block.y - block.h / 2 - player.yVel / 2, block.z, block.w - abs(player.xVel) * 2 - 1, abs(player.yVel), block.l - abs(player.zVel) * 2 - 1
    )){
      player.y = block.y - block.h / 2 - 105;
      player.py = player.y;
      player.yVel = 0;
      
    }else if(box_boxColl(
      player.x, player.y - 100 + 40 / 2, player.z, 100, 40, 100,
      block.x, block.y + block.h / 2 - player.yVel / 2, block.z, block.w + 1, abs(player.yVel), block.l + 1
    )){
      player.y = block.y + block.h / 2 + 100;
      player.py = player.y;
      player.yVel = 0;
      player.jumping = false;
      
    }

    //x collisions
    if(box_boxColl(
      player.x + 50, player.y, player.z, 2 * abs(player.xVel), 200, 100,
      block.x - block.w / 2 - player.xVel / 2, block.y, block.z, abs(player.xVel), block.h - abs(player.yVel) * 2 - 1, block.l - abs(player.zVel) * 2 - 1
    )){
      player.x = block.x - block.w / 2 - 50 - abs(player.xVel);
      player.xVel = 0;
      player.px = player.x;
      
    }else if(box_boxColl(
      player.x - 50, player.y, player.z, 2 * abs(player.xVel), 200, 100,
      block.x + block.w / 2 - player.xVel / 2, block.y, block.z, abs(player.xVel), block.h - abs(player.yVel) * 2 - 1, block.l - abs(player.zVel) * 2 - 1
    )){
      player.x = block.x + block.w / 2 + 50 + abs(player.xVel);
      player.xVel = 0;
      player.px = player.x;
      
    }

    //z collisions
    if(box_boxColl(
      player.x, player.y, player.z + 50, 100, 200, 2 * abs(player.zVel),
      block.x, block.y, block.z - block.l / 2 - player.zVel / 2, block.w - abs(player.xVel) * 2 - 1, block.h - abs(player.yVel) * 2 - 1, abs(player.zVel)
    )){
      player.z = block.z - block.l / 2 - 50 - abs(player.zVel);
      player.zVel = 0;
      player.pz = player.z;
      
    }else if(box_boxColl(
      player.x, player.y, player.z - 50, 100, 200, 2 * abs(player.zVel),
      block.x, block.y, block.z + block.l / 2 - player.zVel / 2, block.w - abs(player.xVel) * 2 - 1, block.h - abs(player.yVel) * 2 - 1, abs(player.zVel)
    )){
      player.z = block.z + block.l / 2 + 50 + abs(player.zVel);
      player.zVel = 0;
      player.pz = player.z;
      
    }

  }

}

var fp = false;
var legMove = 0;

function draw() {
  msLag = ms;
  ms = millis();
  realFrameRate = round(1000/(ms-msLag));
  
  gfx.resetMatrix();
  gfx._renderer._update();

  if(!crateIMG && typeof crateIMG !== "string"){
    crateIMG = imagify(crateIMG);
  }
  if(!dirt_plainIMG && typeof dirt_plainIMG !== "string"){
    dirt_plainIMG = imagify(dirt_plainIMG);
  }
  if(!dirt_1IMG && typeof dirt_1IMG !== "string"){
    dirt_1IMG = imagify(dirt_1IMG);
  }
  if(!dirt_2IMG && typeof dirt_2IMG !== "string"){
    dirt_2IMG = imagify(dirt_2IMG);
  }
  if(!dirt_3IMG && typeof dirt_3IMG !== "string"){
    dirt_3IMG = imagify(dirt_3IMG);
  }
  if(!fenceIMG && typeof fenceIMG !== "string"){
    fenceIMG = imagify(fenceIMG);
  }
  
  move();
  if(!fly){collisions();}

  gfx.background(255, 255, 255);

  gfx.ambientLight(255, 255, 255);

  gfx.camera(0, 0, 0, 0, 0, -1, 0, 1, 0);

  gfx.push();

  
    //comment this out for first person
    if(!fp){
        gfx.translate(0, 0, -400);
    }

    //keycode T
    if(keys[84]){
        if(fp){
            fp = false;
        }else{
            fp = true;
        }
        keys[84] = false;
    }
    if(keys[70]){
        if(fly){
            fly = false;
        }else{
            fly = true;
        }
        keys[70] = false;
    }


    gfx.rotateX(180 + tempRotX);
  	gfx.rotateY(tempRotY);
    gfx.translate(-player.x, -player.y - 75, -player.z);

    gfx.push();
      // x axis
      gfx.translate(400, 0, 0);
      gfx.fill(255, 0, 0);
      gfx.box(1000, 5, 5);
    gfx.pop();
    gfx.push();
      // y axis
      gfx.translate(0, 400, 0);
      gfx.fill(0, 255, 0);
      gfx.box(5, 1000, 5);
    gfx.pop();
    gfx.push();
      // z axis
      gfx.translate(0, 0, 400);
      gfx.fill(0, 0, 255);
      gfx.box(5, 5, 1000);
    gfx.pop();

    for(var i = 0; i < world.length; i++){
      gfx.push();
        gfx.translate(world[i].x, world[i].y, world[i].z);
        if(world[i].t === 1){
          gfx.texture(crateIMG);
        }else if(world[i].t === 2){
          gfx.texture(dirt_plainIMG);
        }else if(world[i].t === 3){
          gfx.texture(dirt_1IMG);
        }else if(world[i].t === 4){
          gfx.texture(dirt_2IMG);
        }else if(world[i].t === 5){
          gfx.texture(dirt_3IMG);
        }else if(world[i].t === 6){
          gfx.texture(fenceIMG);
        }
        
        gfx.box(world[i].w);
      gfx.pop();
    }
    
    
    
    if(keys[87] || keys[83]){
        legMove += 5;
        if(legMove >= 180){legMove = 0;}
    }else{ 
        if(legMove > 0 && legMove < 90){
            legMove -= 5;
        }
        if(legMove > 90 && legMove < 180){
            legMove -= 5;
            if(legMove === 90){
                legMove = 0;
            }
        }
    }

    if(!fp){
        drawPlayer(player.x, player.y, player.z, 0.37, -tempRotY, sin(legMove * 2) * 45);
    }

  gfx.pop();

  // draw the 3D graphics
  image(gfx, 0, 0, width, height);

  fill(0, 0, 0);
  if(frameCountTimer <= 0) {
    displayFrameRate = realFrameRate;
    frameCountTimer = 60;
  } else {
    frameCountTimer -= 40 / realFrameRate;
  }
  
  text("FPS: " + floor(displayFrameRate), 10, 15);

  if(fly){
      text("You Are Flying", 10, 25);
  }

  fill(0, 0, 0);
  text("", 100, 100);

    if(tempRotX < -90 && !fp){
        tempRotX = -90+movedY;
    }

    if(tempRotX > 90 && !fp){
        tempRotX = 90-movedY;
    }

    if(tempRotX < -100 && fp){
        tempRotX = -100+movedY;
    }

    if(tempRotX > 100 && fp){
        tempRotX = 100-movedY;
    }

    if(player.y < -1000){
        player.x = 1000
        player.y = 1000
        player.z = 0
    }

}

function mouseClicked(){
    requestPointerLock();
}

function mouseMoved(){
    // rotate camera
    tempRotX -= round(movedY);
    tempRotY -= round(movedX);
}