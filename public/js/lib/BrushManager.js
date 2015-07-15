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
