/**
* @Math
*/

//Constants

define([], function () {

	var getPixel = function (pos, width, height) {
		var x = pos[0],
			y = pos[1];
		if (x < 0 || y < 0 || x > width || y > height) {
			return undefined;
		}else {
			return Math.floor(x) * 4 + width * Math.floor(y) * 4;
		}
	};

	var getPixels = function (positions, dimensions) {
		var width = dimensions.width,
			height = dimensions.height;
		return positions.map(function (pos) {
			return getPixel(pos, width, height);
		});
	};

	var getPixelsNoGaps = function (positions, dimensions) {
		var width = dimensions.width,
			height = dimensions.height,
			posCount = positions.length,
			pixels = [],
			dx = Math.abs((positions[posCount - 1][0] - positions[0][0]) / posCount),
			dy = Math.abs((positions[posCount - 1][1] - positions[0][1]) / posCount),
			direction, getPixelFunc;
		//If the rate of change is greater along the x axis, look for shifts along the y-axis and vice-versa
		if(dx > dy) {
			direction = 1;
			getPixelFunc = function (flat, change) { return getPixel([flat, change], width, height); };
		}else {
			direction = 0;
			getPixelFunc = function (flat, change) {return getPixel([change, flat], width, height); };
		}
		var oldAxis = Math.floor(positions[0][direction]),
			inverseDirection = Math.abs(direction - 1),
			bristle, newAxis, flatAxis;
		for(bristle = 0; bristle < posCount; bristle++) {
			newAxis = Math.floor(positions[bristle][direction]);
			flatAxis = positions[bristle][inverseDirection];
			if(oldAxis !== newAxis) {
				pixels.push(getPixelFunc(flatAxis, oldAxis));
				oldAxis = newAxis;
			}
			pixels.push(getPixelFunc(flatAxis, newAxis));
		}
		return pixels;
	};

	return {
		MAXFLOAT: 1E+37,
		EPSILON: 1E-5,
		sign: function (x) {
			return typeof x === "number" ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;
		},

		getPixel: getPixel,
		getPixels: function (positions, dimensions, style) {
			console.log(style);
			if(style === "smooth") {
				// console.log(positions);
				// console.log(getPixelsNoGaps(positions, dimensions));
				return getPixelsNoGaps(positions, dimensions);
			}else {
				return getPixels(positions, dimensions);
			}
		}
	};
});
