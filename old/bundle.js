(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 *
 */

var Vector = require("./Vector");
var utils = require("./mathLib");

function Brush(x1_, y1_, x2_, y2_, vel, life, smearDuration){
  this.life = life || 100;
  this.rgbaValues = [];
  this.pixelPositions = [];

  this.angle = 0; //display angle
  this.dAngle = -Math.PI / 2; //angle for depth, perpendicular to display angle

  //Define the Pixel Brush as a line positioned
  //at (x1,y1), stretching to (x2,y2)
  var vert1 = new Vector(x1_, y1_);
  var vert2 = new Vector(x2_, y2_);

  var tempDistVec = vert2.newSub(vert1);
  this.dist = Math.floor(tempDistVec.length());

  this.changedX = false;
  this.changedY = false;

  this.vel = vel || new Vector(0, 0);
  if(!vel){
    var theta = Math.random() * Math.PI * 2;
    this.vel.x = this.maxSpeed * Math.cos(theta);
    this.vel.y = this.maxSpeed * Math.sin(theta);
  }

  this.setMaxSpeedAndForce(.9, .05);

  this.pos = vert1.getAverage(vert2);
  this.acc = new Vector(0, 0);
  this.getPixelPositions(x1_, y1_, x2_, y2_);

  this.smearing = false; //true or false pixel is smearing
  this.smearDuration = smearDuration;
  this.smearsRemaining = smearDuration; //smears remaining
}

module.exports = Brush;

Brush.prototype.resetInit = function(){
  this.originalPixels = this.brushSys.iData.data;
};

Brush.prototype.trackInit = function(xStart_, yStart_, xEnd_, yEnd_){
  if(!this.trackStart || !this.trackEnd){
    this.trackStart = new Vector(xStart_, yStart_);
    this.trackEnd = new Vector(xEnd_, yEnd_);
    this.pos = this.trackStart.clone();

    this.desiredVelVec = this.trackEnd.newSub(this.trackStart);
    this.desiredVelVec.selfNormalize();
    this.desiredVelVec.selfMul(this.maxSpeed);
    this.vel = this.desiredVelVec.clone();

    this.update();
    this.getPixelPositions();
    this.getPixels();
  }
};

Brush.prototype.setMaxSpeed = function(num){
  this.maxSpeed = num;
};

Brush.prototype.setMaxForce = function(num){
  this.maxForce = num;
};

Brush.prototype.setMaxSpeedAndForce = function(mxSpd, mxFrc){
  this.maxSpeed = mxSpd;
  this.maxForce = mxFrc;
  this.vel.limit(mxSpd);
};

Brush.prototype.setDist = function(num){
  this.dist = num;
};


/**
 * @export
 * @return {Vector}
 */

Brush.prototype.reynoldsWalk = function(){
  //set a fixed linear velocity
  var futurePos = this.vel.clone();
  futurePos.selfNormalize();
  futurePos.selfMul(1);

  //use the fixedLinearVel to calculate a futurePos
  futurePos.selfAdd(this.pos);

  //add a random vector from a circle
  var rotatingPoint = new Vector(0, 0);
  var radius = 5;
  var theta = Math.random() * Math.PI * 2;
  rotatingPoint.x = radius * Math.cos(theta);
  rotatingPoint.y = radius * Math.sin(theta);

  futurePos.selfAdd(rotatingPoint);

  //turn the futurePos vector into a desiredPos vector
  futurePos.selfSub(this.pos);
  futurePos.selfNormalize();
  futurePos.selfMul(this.maxSpeed);

  //turn the futurePos vector into a steering vector
  futurePos.selfSub(this.vel);
  var maxForceLimit = this.maxForce;
  futurePos.limit(maxForceLimit);
  return futurePos;
};


Brush.prototype.trackMove = function(){
  if(this.vel.x !== this.desiredVelVec.x
      || this.vel.y !== this.desiredVelVec.y){
    this.vel = this.desiredVelVec.clone();
  }
  if(this.trackEnd.x < this.trackStart.x){
    if(this.pos.x < this.trackEnd.x){
      this.pos = this.trackStart.clone();
    }
  }else if(this.trackEnd.x > this.trackStart.x){
    if(this.pos.x > this.trackEnd.x){
      this.pos = this.trackStart.clone();
    }
  }else if(this.trackEnd.y < this.trackStart.y){
    if(this.pos.y < this.trackEnd.y){
      this.pos = this.trackStart.clone();
    }
  }else if(this.trackEnd.y > this.trackStart.y){
    if(this.pos.y > this.trackEnd.y){
      this.pos = this.trackStart.clone();
    }
  }
};

Brush.prototype.applyForce = function(force_, factor){
  if (typeof force_ !== "undefined"){
    var force = force_.clone();
    if (typeof factor === "undefined"){
      factor = 1;
    }
    force.selfMul(factor);
    this.acc.selfAdd(force);
  }

};

Brush.prototype.randomDistModulator = function(high, low){
  if(typeof low === "undefined"){
    low = 0;
  }
  var range = high - low;
  this.dist = Math.random() * range + low;
};

Brush.prototype.speedDistModulator = function(){
  var mod = Math.abs(this.vel.x);
  if(mod > 1 / 20){
    this.dist = 20 * mod;
  }else{
    this.dist = 1;
  }
};

Brush.prototype.update = function(){
  this.life--;
  this.vel.limit(this.maxSpeed);
  this.pos.selfAdd(this.vel);
  this.vel.selfAdd(this.acc);
  this.acc.selfMul(0);

  var angle = Math.atan2(this.vel.y, this.vel.x) + Math.PI / 2;
  this.angle = angle;
  this.dAngle = angle - Math.PI / 2;

  var x0 = Math.cos(angle) * this.dist / 2;
  var y0 = Math.sin(angle) * this.dist / 2;

  if((x0 * x0 / 2) < utils.EPSILON){
    x0 = 0;
  }
  if((y0 * y0 / 2) < utils.EPSILON){
    y0 = 0;
  }
  this.getPixelPositions(this.pos.x + x0, this.pos.y + y0, this.pos.x - x0, this.pos.y - y0);
};

Brush.prototype.getPixelPositions = function(vert1X, vert1Y, vert2X, vert2Y){
  var dx = (vert2X - vert1X) / this.dist;
  var dy = (vert2Y - vert1Y) / this.dist;

  for (var gPi = 0; gPi < Math.floor(this.dist); gPi++){
    this.pixelPositions[gPi] = [vert1X + dx * gPi, vert1Y + dy * gPi];
  }
};

Brush.prototype.getPixelPositionsDepth = function(vert1X, vert1Y, vert2X, vert2Y, num_){
  var brushWidth = Math.floor(this.dist);
  var dx = (vert2X - vert1X) / brushWidth;
  var dy = (vert2Y - vert1Y) / brushWidth;
  var bx = -Math.cos(this.dAngle);
  var by = -Math.sin(this.dAngle);

  for (var depth = 0; depth < num_ * brushWidth; depth += brushWidth){
    for (var gPi = 0; gPi < brushWidth; gPi++){
      this.pixelPositions[gPi + depth] = [vert1X + dx * gPi + bx * depth / brushWidth,
                                        vert1Y + dy * gPi + by * depth / brushWidth];
    }
  }
};

Brush.prototype.posEndlessCanvas = function(){
  if(this.pos.x < -this.dist){
    this.pos.x = width + this.dist;
  }else if(this.pos.x > width + this.dist){
    this.pos.x = -this.dist;
  }
  if(this.pos.y < -this.dist){
    this.pos.y = height + this.dist;

  }else if(this.pos.y > height + this.dist){
    this.pos.y = -this.dist;
  }
};

Brush.prototype.vertsOverEdges = function(){
  var start = this.pixelPositions[0];
  var end = this.pixelPositions[this.pixelPositions.length - 1];
  if(this.changedX === false){
    if(start[0] < 0
        && end[0] < 0){
      this.pos.x = width + Math.abs(this.pos.x);
      this.changedX = true;
      this.clearPixelRGB();
    }else if(start[0] > width
        && end[0] > width){
      this.pos.x = 0 - (this.pos.x - width);
      this.changedX = true;
      this.clearPixelRGB();
    }
  }
  if(this.changedY === false){
    if(start[1] < 0
        && end[1] < 0){
      this.pos.y = height + Math.abs(this.pos.y);
      this.changedY = true;
      this.clearPixelRGB();
    }else if(start[1] > height
        && end[1] > height){
      this.pos.y = 0 - (this.pos.y - height);
      this.changedY = true;
      this.clearPixelRGB();
    }
  }
};

Brush.prototype.vertsBackOnCanvas = function(){
  var start = this.pixelPositions[0];
  var end = this.pixelPositions[this.pixelPositions.length - 1];
  if(this.changedX === true){
    this.clearPixelRGB();
    this.posEndlessCanvas();
    if((start[0] > 0 && start[0] < width)
        || (end[1] > 0 && end[0] < width)){
      this.changedX = false;
    }
  }
  if(this.changedY === true){
    this.clearPixelRGB();
    this.posEndlessCanvas();
    if((start[1] > 0 && start[1] < height)
        || (end[1] > 0 && end[1] < height)){
      this.changedY = false;
    }
  }
};

Brush.prototype.vertsEndlessCanvas = function(){
  this.vertsOverEdges();
  this.vertsBackOnCanvas();
};


Brush.prototype.reset = function(){
  for(var resetPix = 0; resetPix < this.pixelLine.length; resetPix++){
    var pixR = this.pixelLine[resetPix] * 4;
    var pixG = this.pixelLine[resetPix] * 4 + 1;
    var pixB = this.pixelLine[resetPix] * 4 + 2;
    var pixA = this.pixelLine[resetPix] * 4 + 3;
    this.brushSys.iData.data[pixR] = this.originalPixels[pixR];
    this.brushSys.iData.data[pixG] = this.originalPixels[pixG];
    this.brushSys.iData.data[pixB] = this.originalPixels[pixB];
    this.brushSys.iData.data[pixA] = this.originalPixels[pixA];
  }
};

Brush.prototype.clearPixelRGB = function(){
  this.smearing = false;
  this.rgbaValues = [];
};

Brush.prototype.isItSmearing = function(){
  if(this.smearing === true){
    this.smearsRemaining--;
    if(!(this.smearsRemaining)){
      this.smearing = false;
    }
  } else{
    this.smearing = true;
    this.smearsRemaining = this.smearDuration;
  }
};


Brush.prototype.run = function(){
  var f = this.reynoldsWalk();
  this.applyForce(f, .01);

  this.update();
  this.isItSmearing();
  this.posEndlessCanvas();
};

},{"./Vector":5,"./mathLib":7}],2:[function(require,module,exports){
/**
 *
 */


var utils = require("./mathLib");

function BrushManager(markMethod, brushMethod, name){
	this.brushes = [];
	this.type = markMethod.bind(this) || this.smearOpaque;
	this.brushType = brushMethod.bind(this) || this.getMarks;
	this.name = name || "smear_opaque";
}

module.exports = BrushManager;

//This function frames the portion of the Piece by which
//the BrushManager is bounded. It also points the BrushManager
//to the Piece's imgData.
BrushManager.prototype.frameOnCanvas = function(imgData_, width_, height_){
	this.iData = imgData_;
	this.width = width_;
	this.height = height_;
};

BrushManager.prototype.addBrush = function(brush_){
	this.brushes.push(brush_);
};

BrushManager.prototype.run = function(){
	this.checkDeath();
	for(var i = 0; i < this.brushes.length; i++){
		this.brushes[i].run();
	}
	var markMethod = this.type;
	var getMark = this.brushType;
	markMethod(this.chargeBrushes(getMark()));
};

//Get Brushes' pixelPositions (x,y coords) and rgba values
//Convert x,y coords to imageData pixel values
BrushManager.prototype.getMarks = function(){
 var marks = {pixels: [], rGBAs: []};
 this.brushes.forEach(function(brush, index){
	var bristlePositions = brush.pixelPositions;
	marks.rGBAs[index] = brush.rgbaValues;
	var pixels = [];
	bristlePositions.forEach(function(bristle){
		pixels.push(utils.getPixel(bristle[0], bristle[1], this.width, this.height));
	}, this);
	marks.pixels[index] = pixels;
 }, this);
 return marks;
};

//Drops the first pixel, bc not doing so causes display errors
BrushManager.prototype.getMarksNoGaps = function(){
	//Create the empty marks object
	var marks = {pixels: [], rGBAs: []};
	this.brushes.forEach(function(brush, index){
		//For each brush get the brush's positions, set the rgba for the current mark in marks
		var bristlePositions = brush.pixelPositions; var bristles = bristlePositions.length;
		var pixels = [];
		var dx = Math.abs((bristlePositions[bristles - 1][0] - bristlePositions[0][0]) / bristles);
		var dy = Math.abs((bristlePositions[bristles - 1][1] - bristlePositions[0][1]) / bristles);
		var direction, getPixel;
		//If the rate of change is greater along the x axis, look for shifts along the y-axis and vice-versa
		if(dx > dy){
			direction = 1;
			getPixel = function(flat,change){return utils.getPixel(flat, change, this.width, this.height); }
		}else{
			direction = 0;
			getPixel = function(flat,change){return utils.getPixel(change, flat, this.width, this.height); }
		}
		for(var bristle = 1; bristle < bristles; bristle++){
			var oldAxis = Math.floor(bristlePositions[bristle - 1][direction]);
			var newAxis = Math.floor(bristlePositions[bristle][direction]);
			var flatAxis = bristlePositions[bristle][Math.abs(direction - 1)];
			if(oldAxis !== newAxis){pixels.push(getPixel(flatAxis, oldAxis, this.width, this.height)); }
			pixels.push(getPixel(flatAxis, newAxis, this.width, this.height));
		}
		marks.pixels[index] = pixels; marks.rGBAs[index] = brush.rgbaValues;
	}, this);
	return marks;
};

BrushManager.prototype.consolidatePixels = function(marks){
	var marksPixels = marks.pixels;
	var consolidatedPixels = [];
	marksPixels.forEach(function(pixelSet){
		consolidatedPixels = consolidatedPixels.concat(pixelSet);
	});
	return consolidatedPixels;
};

BrushManager.prototype.checkDeath = function(){
	var brushes = this.brushes;
	brushes.forEach(function(brush, index){
		if(brush.life < 1){
			brushes.splice(index, 1);
		}
	});
};

BrushManager.prototype.chargeBrushes = function(marks){
	this.brushes.forEach(function(brush, index){
		if(!brush.smearing){
			brush.rgbaValues = this.getBristleRGBAs(marks.pixels[index]);
		}
	}, this);
	return marks;
};

//Gathers Canvas RGBAs (includes transparent pixels)
BrushManager.prototype.getCanvasRGBAs = function(pixels){
	var rGBAs = [], data = this.iData;
	pixels.forEach(function(pixel){
		rGBAs.push(data[pixel], data[pixel + 1], data[pixel + 2], data[pixel + 3]);
	});
	return rGBAs;
};


BrushManager.prototype.getBristleRGBAs = function(pixels, sourcePixel){
	var rGBAs = [], data = this.iData, bristleCount = pixels.length;
	if(sourcePixel >= bristleCount){
		sourcePixel = bristleCount - 1;
	}
	var centerPixel = sourcePixel || pixels[Math.floor(bristleCount / 2)];
	if(centerPixel === "undefined"){
		rGBAs.push(undefined, undefined, undefined, undefined);
	}else{
		rGBAs.push(data[centerPixel], data[centerPixel + 1], data[centerPixel + 2], data[centerPixel + 3]);
	}
	return rGBAs;
};

BrushManager.prototype.getRandomRGBAs = function(pixels){
	var rGBAs = [];
	pixels.forEach(function(){
		rGBAs.push(Math.random() * 255, Math.random() * 255, Math.random() * 255, 255);
	});
	return rGBAs;
};

//Apply rgba values to pixels in this.iData
BrushManager.prototype.smearAll = function(marks){
	var data = this.iData;
	for(var mark = 0; mark < marks.pixels.length; mark++){
		var rGBAs = marks.rGBAs[mark];
		var rgbaEntries = rGBAs.length;
		var pixels = marks.pixels[mark];
		for(var index = 0; index < pixels.length; index++){
			var rgbaIndex = index % (rgbaEntries / 4) * 4;
			var red = rGBAs[rgbaIndex];
			var pixel = pixels[index];
			if(typeof pixel === "undefined" || typeof red === "undefined"){
				continue;
			}
			data[pixel] = rGBAs[rgbaIndex];
			data[pixel + 1] = rGBAs[rgbaIndex + 1];
			data[pixel + 2] = rGBAs[rgbaIndex + 2];
			data[pixel + 3] = rGBAs[rgbaIndex + 3];
		}
	}
	return marks;
};

BrushManager.prototype.smearOpaque = function(marks){
	var data = this.iData;
	for(var mark = 0; mark < marks.pixels.length; mark++){ 
		var rGBAs = marks.rGBAs[mark];
		var rgbaEntries = rGBAs.length;
		var pixels = marks.pixels[mark];
		for(var index = 0; index < pixels.length; index++){
			var rgbaIndex = index % (rgbaEntries / 4) * 4;
			if(rGBAs[rgbaIndex + 3]){
				var pixel = pixels[index];
				var red = rGBAs[rgbaIndex];
				if((typeof pixel === "undefined") || (typeof red === "undefined")){
					continue;
				}
				data[pixel] = rGBAs[rgbaIndex];
				data[pixel + 1] = rGBAs[rgbaIndex + 1];
				data[pixel + 2] = rGBAs[rgbaIndex + 2];
				data[pixel + 3] = rGBAs[rgbaIndex + 3];
			}
		}
	}
	return marks;
};


BrushManager.prototype.smearAntiTransparent = function(marks){
	var data = this.iData;
	for (var mark = 0; mark < marks.pixels.length; mark++){
		var rGBAs = marks.rGBAs[mark];
		var rgbaEntries = rGBAs.length;
		var pixels = marks.pixels[mark];
		for(var index = 0; index < pixels.length; index++){
			var rgbaIndex = index % (rgbaEntries / 4) * 4;
			var pixel = pixels[index];
			if(data[pixel + 3] === 0)
			{
				data[pixel] = rGBAs[rgbaIndex];
				data[pixel + 1] = rGBAs[rgbaIndex + 1];
				data[pixel + 2] = rGBAs[rgbaIndex + 2];
				data[pixel + 3] = rGBAs[rgbaIndex + 3];
			}
		}
	}
	return marks;
};

BrushManager.prototype.smearAwayDark = function(marks){
	var data = this.iData;
	for (var mark = 0; mark < marks.pixels.length; mark++){
		var rGBAs = marks.rGBAs[mark];
		var rgbaEntries = rGBAs.length;
		var pixels = marks.pixels[mark];
		for(var index = 0; index < pixels.length; index++){
			var rgbaIndex = index % (rgbaEntries / 4) * 4;
			var pixel = pixels[index];
			if((data[pixel] < rGBAs[rgbaIndex])
			|| (data[pixel + 1] < rGBAs[rgbaIndex + 1])
			|| (data[pixel + 2] < rGBAs[rgbaIndex + 2]))
			{
				data[pixel] = rGBAs[rgbaIndex];
				data[pixel + 1] = rGBAs[rgbaIndex + 1];
				data[pixel + 2] = rGBAs[rgbaIndex + 2];
				data[pixel + 3] = rGBAs[rgbaIndex + 3];
			}
		}
	}
	return marks;
};

BrushManager.prototype.smearAwayLight = function(marks){
	var data = this.iData;
	for (var mark = 0; mark < marks.pixels.length; mark++){
		var rGBAs = marks.rGBAs[mark];
		var rgbaEntries = rGBAs.length;
		var pixels = marks.pixels[mark];
		for(var index = 0; index < pixels.length; index++){
			var rgbaIndex = index % (rgbaEntries / 4) * 4;
			var pixel = pixels[index];
			if(!data[pixel + 3]
			|| ((data[pixel] > rGBAs[rgbaIndex])
			|| (data[pixel + 1] > rGBAs[rgbaIndex + 1])
			|| (data[pixel + 2] > rGBAs[rgbaIndex + 2]))
			&& rGBAs[rgbaIndex + 3])
			{
				data[pixel] = rGBAs[rgbaIndex];
				data[pixel + 1] = rGBAs[rgbaIndex + 1];
				data[pixel + 2] = rGBAs[rgbaIndex + 2];
				data[pixel + 3] = rGBAs[rgbaIndex + 3];
			}
		}
	}
	return marks;
};

BrushManager.prototype.blend = function(marks){
	var data = this.iData;
	for (var mark = 0; mark < marks.pixels.length; mark++){
		var rGBAs = marks.rGBAs[mark];
		var rgbaEntries = rGBAs.length;
		var pixels = marks.pixels[mark];
		for(var index = 0; index < pixels.length; index++){
			var rgbaIndex = index % (rgbaEntries / 4) * 4;
			var pixel = pixels[index];
			if(data[pixel + 3] && rGBAs[rgbaIndex + 3])
			{
				data[pixel] = (data[pixel] + rGBAs[rgbaIndex]) / 2;
				data[pixel + 1] = (data[pixel + 1] + rGBAs[rgbaIndex + 1]) / 2;
				data[pixel + 2] = (data[pixel + 2] + rGBAs[rgbaIndex + 2]) / 2;
				data[pixel + 3] = (data[pixel + 3] + rGBAs[rgbaIndex + 3]) / 2;
			}
		}
	}
	return marks;
};

BrushManager.prototype.blendBlackOrWhite = function(marks, degree){
	var data = this.iData;
	degree = degree || 1.9;
	for (var mark = 0; mark < marks.pixels.length; mark++){
		var pixels = marks.pixels[mark];
		for(var index = 0; index < pixels.length; index++){
			var pixel = pixels[index];
			if(data[pixel + 3])
			{
				data[pixel] = (data[pixel] * degree) / 2;
				data[pixel + 1] = (data[pixel + 1] * degree) / 2;
				data[pixel + 2] = (data[pixel + 2] * degree) / 2;
				data[pixel + 3] = 255;
			}
		}
	}
	return marks;
};

BrushManager.prototype.smearLightOrDark = function(){
	var vPosOrNeg = Math.random() - .5;
	if(vPosOrNeg >= 0){
		this.smearAwayDark();
	}else{
		this.smearAwayLight();
	}
};


BrushManager.prototype.blendOrSmear = function(num_){
	var vPosOrNeg = num_ || Math.random() - .5;
	if(vPosOrNeg >= .75){
		this.smear();
	}else{
		this.blend();
	}
};

BrushManager.prototype.blendOrSmearLightOrDark = function(){
	var vPosOrNeg = Math.random() - .5;
	if(vPosOrNeg >= 0){
		this.blend();
	}else{
		this.smearLightOrDark(vPosOrNeg);
	}
};

BrushManager.prototype.convertToBW = function(marks){
	var data = this.iData;
	for (var mark = 0; mark < marks.pixels.length; mark++){
		var pixels = marks.pixels[mark];
		for(var index = 0; index < pixels.length; index++){
			var pixel = pixels[index];
			if(data[pixel + 3]){
				var bw = (data[pixel] + data[pixel + 1] + data[pixel + 2] ) / 3;
				data[pixel] = bw;
				data[pixel + 1] = bw;
				data[pixel + 2] = bw;
			}
		}
	}
	return marks;
};


//"Issue" when brush is going slow enough to touch a pixel twice+
BrushManager.prototype.invertRGB = function(marks){
	var data = this.iData;
	for (var mark = 0; mark < marks.pixels.length; mark++){
		var pixels = marks.pixels[mark];
		for(var index = 0; index < pixels.length; index++){
			var pixel = pixels[index];
			if(data[pixel + 3]){
				data[pixel] = 255 - data[pixel];
				data[pixel + 1] = 255 - data[pixel + 1];
				data[pixel + 2] = 255 - data[pixel + 2];
			}
		}
	}
	return marks;
}

BrushManager.prototype.invertR = function(marks){
	var data = this.iData;
	for (var mark = 0; mark < marks.pixels.length; mark++){
		var pixels = marks.pixels[mark];
		for(var index = 0; index < pixels.length; index++){
			var pixel = pixels[index];
			if(data[pixel + 3]){
				data[pixel] = 255 - data[pixel];
			}
		}
	}
	return marks;
}

BrushManager.prototype.invertG = function(marks){
	var data = this.iData;
	for (var mark = 0; mark < marks.pixels.length; mark++){
		var pixels = marks.pixels[mark];
		for(var index = 0; index < pixels.length; index++){
			var pixel = pixels[index];
			if(data[pixel + 3]){
				data[pixel + 1] = 255 - data[pixel + 1];
			}
		}
	}
	return marks;
}

BrushManager.prototype.invertB = function(marks){
	var data = this.iData;
	for (var mark = 0; mark < marks.pixels.length; mark++){
		var pixels = marks.pixels[mark];
		for(var index = 0; index < pixels.length; index++){
			var pixel = pixels[index];
			if(data[pixel + 3]){
				data[pixel + 2] = 255 - data[pixel + 2];
			}
		}
	}
	return marks;
}

//BrushManager.prototype

},{"./mathLib":7}],3:[function(require,module,exports){
//sampleRate is the number of iterations that pass before the bristle arrangement is shuffled
//dryness is a percentage (0-100) used to calculate the likelihood a particular bristle is "down"

var Brush = require("./Brush");
var Vector = require("./Vector");
var utils = require("./mathLib");

function DryBrush(x1_, y1_, x2_, y2_, vel, life, smearDuration, sampleRate, dryness){
	var vert1 = new Vector(x1_, y1_);
	var vert2 = new Vector(x2_, y2_);
  	var tempDistVec = vert2.newSub(vert1);
  	this.dist = Math.floor(tempDistVec.length());
	this.dryness = dryness;
	this.bristleDown = [];
	this.calculateMarkingBristles();
	Brush.call(this, x1_, y1_, x2_, y2_, vel, life, smearDuration);
	this.sampleRate = sampleRate;
	this.sampleCount = sampleRate;
}

module.exports = DryBrush;

DryBrush.prototype = Object.create(Brush.prototype,{
	constructor:{
		value:DryBrush
	}
});

DryBrush.prototype.calculateMarkingBristles = function(){
	var dryness = this.dryness;
	for(var i = 0; i < Math.floor(this.dist); i++){
		var dry = (Math.random() * 100 + utils.EPSILON) < dryness;
		if(dry){
			this.bristleDown[i] = false;
		}else{
			this.bristleDown[i] = true;
		}
	}
}

DryBrush.prototype.getPixelPositions = function(vert1X, vert1Y, vert2X, vert2Y){
	if(this.sampleCount <= 0){
		this.calculateMarkingBristles();
		this.sampleCount = this.sampleRate;
	}else{
		this.sampleCount--;
	}

  var dx = (vert2X - vert1X) / this.dist;
  var dy = (vert2Y - vert1Y) / this.dist;

  var bristleDown = this.bristleDown;
  for (var gPi = 0; gPi < Math.floor(this.dist); gPi++){
  	if(bristleDown[gPi]){
  		this.pixelPositions[gPi] = [vert1X + dx * gPi, vert1Y + dy * gPi];
  	}
  }
}


},{"./Brush":1,"./Vector":5,"./mathLib":7}],4:[function(require,module,exports){
/**
 * @Isaac Madwed
 */

/*
 * Pieces hold and run managers.
 * You may only add managers to a Piece's
 * manager array.
 * They are a convenience object to help manage
 * different kinds of managers (and their agents)
 * from the top level.
 * You can also access the imgData directly
 * to apply it to multiple canvases.
 */
var Brush = require("./Brush");
var BrushManager = require("./BrushManager");
var DryBrush = require("./DryBrush");
var Vector = require("./Vector");
var addHTML = require("./elementAdder");

function Piece(){
  this.width = 150;
  this.height = 100;
  this.x = 0;
  this.y = 0;
  this.addingBrush = false;
}

module.exports = Piece;

Piece.prototype.init = function(canvas_){
  this.canvas = canvas_;
  var canvasStyle = window.getComputedStyle(canvas_);
  this.width = width = parseInt(canvasStyle.getPropertyValue("width"), 10);
  this.height = height = parseInt(canvasStyle.getPropertyValue("height"), 10);
  canvas_.setAttribute("width", this.width);
  canvas_.setAttribute("height", this.height);
  this.ctx = canvas_.getContext("2d");
  this.imgData = this.ctx.getImageData(0, 0, this.width, this.height);
  this.managers = [];
};

Piece.prototype.initUI = function(){
  //Add uiCanvas, clicking canvas
  var canvasBox = this.canvas.parentNode;
  var uiCanvas = addHTML("CANVAS", {id: "uiCanvas", class: "canvas", width: this.width, height: this.height});
  this.uiCanvas = canvasBox.appendChild(uiCanvas);
  this.uictx = this.uiCanvas.getContext("2d");
  //Adding UI buttons
  var container = canvasBox.parentNode;
  var buttons = addHTML("DIV", {id: "buttons"});
  //Color Selector
  var swatch = addHTML("DIV", {id: "swatch", class: "ui-widget-content ui-corner-all"});
  buttons.appendChild(swatch);
  var colors = addHTML("DIV", {id: "colors"});
  var red = addHTML("DIV", {id: "red"}), green = addHTML("DIV", {id: "green"}), blue = addHTML("DIV", {id: "blue"}), alpha = addHTML("DIV", {id: "alpha"});
  colors.appendChild(red); colors.appendChild(green); colors.appendChild(blue); colors.appendChild(alpha);
  buttons.appendChild(colors);
  //Randomness Selector
  var rand = addHTML("DIV", {id: "rand"});
  var randUnder = addHTML("P", {class: "title"}, "randomize under color values");
  var randOver = addHTML("P", {class: "title"}, "randomize over color values");
  var randOff = addHTML("P", {class: "title"}, "don't randomize");
  var randUnderInput = addHTML("INPUT", {name: "random", value: "down", type: "radio"});
  randUnder.appendChild(randUnderInput);
  var randOverInput = addHTML("INPUT", {name: "random", value: "up", type: "radio"});
  randOver.appendChild(randOverInput);
  var randOffInput = addHTML("INPUT", {name: "random", value: "no", type: "radio", checked: "checked"});
  randOff.appendChild(randOffInput);
  rand.appendChild(randUnder); rand.appendChild(randOver); rand.appendChild(randOff);
  buttons.appendChild(rand);
  //Brush Properties
  var brush = addHTML("DIV", {id: "brush"});
  var brushProperties = addHTML("DIV", {id: "brushProperties"});
  //Brush Props
  var brushProps = addHTML("DIV", {id: "brushProps"});
  var strokeLength = addHTML("P", {class: "title"}, "stroke length");
  var life = addHTML("DIV", {id: "life"});
  var smearLength = addHTML("P", {class: "title"}, "smear length");
  var smear = addHTML("DIV", {id: "smear"});
  var brushWidth = addHTML("P", {class: "title"}, "brush width");
  var size = addHTML("DIV", {id: "size"});
  brushProps.appendChild(strokeLength); brushProps.appendChild(life); brushProps.appendChild(smearLength);
  brushProps.appendChild(smear); brushProps.appendChild(brushWidth); brushProps.appendChild(size);
  brushProperties.appendChild(brushProps);
  //Brush Spins
  var brushSpins = addHTML("DIV", {id: "brushSpins"});
  var p1 = document.createElement("P");
  var lifeSpin = addHTML("INPUT", {id: "lifeSpin"});
  var p2 = document.createElement("P");
  var smearSpin = addHTML("INPUT", {id: "smearSpin"});
  var p3 = document.createElement("P");
  var sizeSpin = addHTML("INPUT", {id: "sizeSpin"});
  brushSpins.appendChild(p1); brushSpins.appendChild(lifeSpin); brushSpins.appendChild(p2);
  brushSpins.appendChild(smearSpin); brushSpins.appendChild(p3); brushSpins.appendChild(sizeSpin);
  brushProperties.appendChild(brushSpins);
  brush.appendChild(brushProperties);
  //Brush Type
  var brushTypeLabel = addHTML("LABEL", {for: "brushType"}, "Select a brush");
  brush.appendChild(brushTypeLabel);
  var brushTypeSelect = addHTML("SELECT", {name: "brushType", id: "brushType"});
  var wet = addHTML("OPTION", {selected: "selected"}, "Wet");
  var dry = addHTML("OPTION", {}, "Dry");
  brushTypeSelect.appendChild(wet); brushTypeSelect.appendChild(dry);
  brush.appendChild(brushTypeSelect);
  buttons.appendChild(brush);
  //Managers
  var managersWrapper = addHTML("DIV", {id: "managers-wrapper"});
  var managers = addHTML("DIV", {id: "managers"});
  var h3Blend = addHTML("H3", {}, "blend");
  managers.appendChild(h3Blend);
  var blend = document.createElement("DIV");
  var blendDefault = addHTML("P", {}, "default");
  var blendDefaultInput = addHTML("INPUT", {name: "action", value: "blend default", type: "radio"});
  blendDefault.appendChild(blendDefaultInput);
  blend.appendChild(blendDefault);
  var blendBW = addHTML("P", {}, "b/w");
  var blendBWInput = addHTML("INPUT", {name: "action", value: "blend b/w", type: "radio"});
  blendBW.appendChild(blendBWInput);
  blend.appendChild(blendBW);
  managers.appendChild(blend);

  var h3Smear = addHTML("H3", {}, "smear");
  managers.appendChild(h3Smear);

  var smear = document.createElement("DIV");
  var smearAll = addHTML("P", {}, "all");
  var smearAllInput = addHTML("INPUT", {name: "action", value: "smear default", type: "radio"});
  smearAll.appendChild(smearAllInput);
  smear.appendChild(blendDefault);

  var smearOpaque = addHTML("P", {}, "opaque");
  var smearOpaqueInput = addHTML("INPUT", {name: "action", value: "smear opaque", type: "radio", checked: "checked"});
  smearOpaque.appendChild(smearOpaqueInput);
  smear.appendChild(smearOpaque);

  var smearAntiTransparent = addHTML("P", {}, "antiTransparent");
  var smearAntiTransparentInput = addHTML("INPUT", {name: "action", value: "smear antiTransparent", type: "radio"});
  smearAntiTransparent.appendChild(smearAntiTransparentInput);
  smear.appendChild(smearAntiTransparent);

  var smearAwayDark = addHTML("P", {}, "awayDark");
  var smearAwayDarkInput = addHTML("INPUT", {name: "action", value: "smear awayDark", type: "radio"});
  smearAwayDark.appendChild(smearAwayDarkInput);
  smear.appendChild(smearAwayDark);
  var smearAwayLight = addHTML("P", {}, "awayLight");
  var smearAwayLightInput = addHTML("INPUT", {name: "action", value: "smear awayLight", type: "radio"});
  smearAwayLight.appendChild(smearAwayLightInput);
  smear.appendChild(smearAwayLight);
  managers.appendChild(smear);
  managersWrapper.appendChild(managers);
  buttons.appendChild(managersWrapper);
  container.appendChild(buttons);

  this.actions = document.getElementsByName("action");
  this.randoms = document.getElementsByName("random");

  console.log("UI Deployed");

  function refreshSwatch() {
    var red = $("#red").slider("value"),
      green = $("#green").slider("value"),
      blue = $("#blue").slider("value"),
      alpha = $("#alpha").slider("value");
    $( "#swatch" ).css("background-color", "rgba(" + red + ", " + green + ", " + blue + ", " + alpha / 255 + ")");
  }

  $(function() {
    //Color Picker
    $("#red, #green, #blue, #alpha").slider({
      orientation: "horizontal",
      range: "min",
      max: 255,
      value: 255,
      slide: refreshSwatch,
      change: refreshSwatch
    });
    $("#red").slider("value", 255);
    $("#green").slider("value", 140);
    $("#blue").slider("value", 60);

    //Brush width, smearSampleRate, strokeLength
    $("#size, #smear, #life").slider({
      orientation: "horizontal",
      range: "min",
      max: 300,
      min: 1,
      value: 30
    });
    $("#smear, #life").slider("option", "max", 1000);
    $("#size").on("slide", function(_, ui){$("#sizeSpin").spinner("value", ui.value); });
    $("#smear").on("slide", function(_, ui){$("#smearSpin").spinner("value", ui.value); });
    $("#life").on("slide", function(_, ui){$("#lifeSpin").spinner("value", ui.value); });

    //Accompanying spinners
    $("#sizeSpin, #smearSpin, #lifeSpin").spinner({
      max: 300,
      min: 1
    });
    $("#sizeSpin, #smearSpin, #lifeSpin").spinner("value", 30);
    $("#smearSpin, #lifeSpin").spinner("option", "max", 1000);
    $("#sizeSpin").on("spin", function(_, ui){$("#size").slider("value", ui.value); });
    $("#smearSpin").on("spin", function(_, ui){$("#smear").slider("value", ui.value); });
    $("#lifeSpin").on("spin", function(_, ui){$("#life").slider("value", ui.value); });

    //BrushType, ie wet, dry
    $("#brushType").selectmenu();

    //Managers
    $("#managers").accordion({
      active: 1,
      animate: "swing",
      collapsible: true,
      heightStyle: "content",
      icons: {"header": "ui-icon-blank", "activeHeader": "ui-icon-triangle-1-se"}
    });
  });
};

Piece.prototype.addManager = function(manager, width_, height_){
  var width_ = width_ || this.width;
  var height_ = height_ || this.height;

  this.managers.push(manager);
  this.managers[this.managers.length - 1].frameOnCanvas(this.imgData.data, width_, height_);
};

Piece.prototype.uiAddBrush = function(action, how, brush, x, y, vel, random){
  var markType;
  var name = "";
  if(action === "smear"){
    switch (how){
      case "opaque":
        markType = function(marks){this.smearOpaque(marks); };
        break;
      case "antiTransparent":
        markType = function(marks){this.smearAntiTransparent(marks); };
        break;
      case "awayLight":
        markType = function(marks){this.smearAwayLight(marks); };
        break;
      case "awayDark":
        markType = function(marks){this.smearAwayDark(marks); };
        break;
      default:
        markType = function(marks){this.smearAll(marks); };
        how = "all";
    }
  }else if(action === "blend"){
    switch (how){
      case "b/w":
        markType = function(marks){this.blendBlackOrWhite(marks); };
        name = "blendBW";
        break;
      default:
        markType = function(marks){this.blend(marks); };
        name = "blendDefault";
    }
  }
  var brushType;
  if(brush === "Dry"){
    brushType = function(){return this.getMarks(); };
  }else if(brush === "Wet"){
    brushType = function(){return this.getMarksNoGaps(); };
  }
  name = action + " " + how + " " + brush;

  var exists;
  var managers = this.managers;

  for(var index = 0; index < managers.length; index++){
    if(managers[index].name === name){
      exists = index;
      break;
    }
  }
  var manager;
  if(typeof exists === "number"){
    manager = managers[exists];
  }else{
    this.addManager(new BrushManager(markType, brushType, name));
    manager = managers[this.managers.length - 1];
  }
  var size = $("#size").slider("value");
  if(brush === "Wet"){
    manager.addBrush(new Brush(x - size / 2, y, x + size / 2, y, vel, $("#life").slider("value"), $("#smear").slider("value")));
  }else if(brush === "Dry"){
    manager.addBrush(new DryBrush(x - size / 2, y, x + size / 2, y, vel, $("#life").slider("value"), $("#smear").slider("value"), 1000, 75));
  }
  var newBrush = manager.brushes[manager.brushes.length - 1];
  newBrush.setMaxSpeedAndForce(.5, .01);
  newBrush.rgbaValues = [$("#red").slider("value"), $("#green").slider("value"), $("#blue").slider("value"), $("#alpha").slider("value")];
};

Piece.prototype.clickInterface = function(){
  var self = this;
  var canvas = this.canvas;
  
  $("#clear").button().off("click").on("click", function(event){
    var w = self.canvas.width, h = self.canvas.height;
    self.ctx.clearRect(0, 0, w, h);
    self.imgData = self.ctx.getImageData(0, 0, w, h);
    self.managers.forEach(function(manager){
      manager.frameOnCanvas(self.imgData, w, h);
    });
    return false;
  });

  var uiCanvas = this.uiCanvas;
  $("#uiCanvas").off("click").on("click", function(event){
    var eventDoc, doc, body, pageX, pageY;

    event = event || window.event; // IE-ism

    // If pageX/Y aren't available and clientX/Y are,
    // calculate pageX/Y - logic taken from jQuery.
    // (This is to support old IE)
    if (event.pageX === null && event.clientX !== null) {
        eventDoc = (event.target && event.target.ownerDocument) || document;
        doc = eventDoc.documentElement;
        body = eventDoc.body;

        event.pageX = event.clientX +
          (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
          (doc && doc.clientLeft || body && body.clientLeft || 0);
        event.pageY = event.clientY +
          (doc && doc.scrollTop || body && body.scrollTop || 0) -
          (doc && doc.clientTop || body && body.clientTop || 0 );
    }
    var rect = self.canvas.getBoundingClientRect(), root = document.documentElement;
    var x = Math.round((event.pageX - rect.left) / (rect.right - rect.left) * uiCanvas.width);
    var y = Math.round((event.pageY - rect.top) / (rect.bottom - rect.top) * uiCanvas.height);
    if(!self.addingBrush){
      self.x = x;
      self.y = y;
      self.addingBrush = true;
    }else{
      self.uictx.clearRect(0, 0, self.uiCanvas.width, self.uiCanvas.height);
      self.addingBrush = false;
      var vel = new Vector(x - self.x, y - self.y);
      var method = ["smear", "default"];
      var random = "no";
      var actions = self.actions;
      var randoms = self.randoms;
      for(var action = 0; action < actions.length; action++){
        if(actions[action].checked){
          method = actions[action].value.split(" ");
          break;
        }
      }
      for(var rIndex = 0; rIndex < randoms.length; rIndex++){
        if(randoms[rIndex].checked){
          random = randoms[rIndex].value;
          break;
        }
      }
      var brushType = $("#brushType").selectmenu("instance").buttonText[0].innerText;
      self.uiAddBrush(method[0], method[1], brushType, self.x, self.y, vel, random);
    }
  });
  $("#uiCanvas").on("mousemove", function(event) {
    var eventDoc, doc, body, pageX, pageY;

    event = event || window.event; // IE-ism

    // If pageX/Y aren't available and clientX/Y are,
    // calculate pageX/Y - logic taken from jQuery.
    // (This is to support old IE)
    if (event.pageX === null && event.clientX !== null) {
        eventDoc = (event.target && event.target.ownerDocument) || document;
        doc = eventDoc.documentElement;
        body = eventDoc.body;

        event.pageX = event.clientX +
          (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
          (doc && doc.clientLeft || body && body.clientLeft || 0);
        event.pageY = event.clientY +
          (doc && doc.scrollTop || body && body.scrollTop || 0) -
          (doc && doc.clientTop || body && body.clientTop || 0);
    }

        // Use event.pageX / event.pageY here
    var rect = self.canvas.getBoundingClientRect(), root = document.documentElement;
    self.mx = (event.pageX - rect.left) / (rect.right - rect.left) * uiCanvas.width;
    self.my = (event.pageY - rect.top) / (rect.bottom - rect.top) * uiCanvas.height;
  });

  if(self.addingBrush){
      var ctx = self.uictx;
      ctx.clearRect(0, 0, self.uiCanvas.width, self.uiCanvas.height);
      ctx.beginPath();
      ctx.strokeStyle = "gray";
      ctx.lineWidth = 1;
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.mx, this.my);
      ctx.stroke();
  }
};


Piece.prototype.run = function(){
  this.managers.forEach(function(manager){
    manager.run();
  });
  this.ctx.putImageData(this.imgData, 0, 0);
};

function randomizeColorsDown(rgba){
  var r = Math.random() * rgba[0];
  var g = Math.random() * rgba[1];
  var b = Math.random() * rgba[2];
  var a = Math.random() * rgba[3];
  return [r, g, b, a];
}

function randomizeColorsUp(rgba){
  var r = Math.random() * (255 - rgba[0]) + rgba[0];
  var g = Math.random() * (255 - rgba[1]) + rgba[1];
  var b = Math.random() * (255 - rgba[2]) + rgba[2];
  var a = Math.random() * (255 - rgba[3]) + rgba[3];
  return [r, g, b, a];
}

},{"./Brush":1,"./BrushManager":2,"./DryBrush":3,"./Vector":5,"./elementAdder":6}],5:[function(require,module,exports){
var utils = require("./mathLib");

function Vector(x_, y_){
  this.x = x_;
  this.y = y_;
  return this;
}

module.exports = Vector;

Vector.prototype.selfAdd = function(vec){
  this.x += vec.x;
  this.y += vec.y;
  return this;
}

Vector.prototype.selfAddXY = function(x_, y_){
  this.x += x_;
  this.y += y_;
  return this;
}

Vector.prototype.newAdd = function(vec){
  var tempVec = new Vector(this.x + vec.x, this.y + vec.y);
  return tempVec;
}

Vector.prototype.newAddXY = function(x_, y_){
  var tempVec = new Vector(this.x + x_, this.y + y_);
  return tempVec;
}

Vector.prototype.selfSub = function(vec){
  this.x -= vec.x;
  this.y -= vec.y;
  return this;
}

Vector.prototype.selfSubXY = function(x_, y_){
  this.x -= x_;
  this.y -= y_;
  return this;
}

Vector.prototype.newSub = function(vec){
  var tempVec = new Vector(0, 0);
  tempVec.x = this.x - vec.x;
  tempVec.y = this.y - vec.y;
  return tempVec;
}

Vector.prototype.newSubXY = function(x_, y_){
  var tempVec = new Vector(this.x - x_, this.y - y_);
  return tempVec;
}

Vector.prototype.selfMul = function(num){
  this.x *= num;
  this.y *= num;
  return this;
}

Vector.prototype.selfNormalize = function(){
  var length = this.length();
  if(length >= utils.EPSILON){
    var inv_length = 1.0 / length;
        this.x *= inv_length;
        this.y *= inv_length;
  }
  return length;
}

Vector.prototype.limit = function(limit_){
  var length = this.length();
  if (length > limit_){
    //Normalize()
    if (length >= utils.EPSILON)
      {
              var inv_length = 1.0 / length;
              this.x *= inv_length;
              this.y *= inv_length;
      }
    //SelfMul()
    this.x *= limit_;
    this.y *= limit_;

    return this;
  } else{
    return this;
  }

}

Vector.prototype.getAverage = function(vec){
  var tempVec = new Vector(this.x + vec.x, this.y + vec.y);
  tempVec.selfMul(0.5);
  return tempVec;
}

Vector.prototype.lengthSqrd = function(){
  return ((this.x * this.x) + (this.y * this.y));
}

Vector.prototype.length = function(){
  return Math.sqrt((this.x * this.x) + (this.y * this.y));
}

Vector.prototype.clone = function(){
  return new Vector(this.x, this.y);
}
},{"./mathLib":7}],6:[function(require,module,exports){
module.exports = elementAdder;

function elementAdder(type, attributes, text){
	var element = document.createElement(type);
	var attrKeys = Object.getOwnPropertyNames(attributes);
	for (var i = 0; i < attrKeys.length; i++){
		var key = attrKeys[i];
		var attr = document.createAttribute(key);
		attr.value = attributes[key];
		element.setAttributeNode(attr);
	}
	if(typeof text === "string"){element.textContent = text; }
	return element;
}

},{}],7:[function(require,module,exports){
/**
 * @Math
 */

//Constants

exports.MAXFLOAT = 1E+37;
exports.EPSILON = 1E-5;
exports.sign= function(x) {
    return typeof x === 'number' ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;
},

exports.getPixel= function(x_,y_,width,height){
    if (x_ < 0 || y_ < 0 || x_ > width || y_ > height){
      return undefined;
    }else{
      return (Math.floor(x_) * 4 + width * Math.floor(y_)*4);
    }
}







},{}],8:[function(require,module,exports){
//Run Browserify on this file to build

var Piece = require("./lib/Piece");
var BrushManager = require("./lib/BrushManager");
var DryBrush = require("./lib/DryBrush");
var Brush = require("./lib/Brush");
var Vector = require("./lib/Vector");
window.onload = function() {
  var canvas1 = document.getElementById("canvas");
  bigMan = new Piece();
  bigMan.init(canvas1);
  /*var brushMan = new BrushManager(function(marks){return this.invertG(marks); }
    , function(){return this.getMarksNoGaps(); });
  bigMan.addManager(brushMan);
  for(var i = 0; i < 100; i++){
    var pos = Math.random() * 800;
    brushMan.addBrush(new Brush(pos, pos, pos + 35 * Math.random(), pos + 15, new Vector(Math.random() - .5, Math.random() - .5), Infinity, Infinity, 20, Math.random() * 100));
    var newBrush = brushMan.brushes[brushMan.brushes.length - 1];
    newBrush.setMaxSpeedAndForce(1, .01);
    newBrush.rgbaValues = [255, 25, Math.random() * 255, 255];
  }

  var brushMan1 = new BrushManager(function(marks){return this.smearOpaque(marks); }
    , function(){return this.getMarks(); });
  bigMan.addManager(brushMan1);
  for(var i = 0; i < 100; i++){
    var pos = Math.random() * 800;
    brushMan1.addBrush(new DryBrush(pos, pos, pos + 15, pos + 15, new Vector(Math.random() - .5, Math.random() - .5), Infinity, Infinity, 20, Math.random() * 100));
    var newBrush = brushMan1.brushes[brushMan1.brushes.length - 1];
    newBrush.setMaxSpeedAndForce(1, .01);
    newBrush.rgbaValues = [Math.random() * 255, 0, Math.random() * 255, 255];
  }*/

  bigMan.initUI();

  now();
}

now = function(){

  var animloop;

  (animloop = function() {
    var animloop_id;
    animloop_id = requestAnimationFrame(animloop);
    bigMan.run();
    bigMan.clickInterface();
    

  })();
};

},{"./lib/Brush":1,"./lib/BrushManager":2,"./lib/DryBrush":3,"./lib/Piece":4,"./lib/Vector":5}]},{},[8]);
