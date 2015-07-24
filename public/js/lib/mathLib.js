/**
* @Math
*/

//Constants

define([], function () {
	return {
		MAXFLOAT: 1E+37,
		EPSILON: 1E-5,
		sign: function (x) {
			return typeof x === "number" ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;
		},

		getPixel: function (pos, dimensions) {
			var x = pos[0],
				y = pos[1],
				width = dimensions.width,
				height = dimensions.height;
			if (x < 0 || y < 0 || x > width || y > height) {
				return undefined;
			}else {
				return Math.floor(x) * 4 + width * Math.floor(y) * 4;
			}
		}
	};

});








