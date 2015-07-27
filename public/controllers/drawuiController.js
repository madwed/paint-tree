define([], function () {
	var DrawController = function ($scope, $rootScope) {
		$scope.colorSample = "standard";

		$scope.brush = "linear";
		$scope.interpolationStyle = "smooth";

		$scope.paint = "opaque";

		$scope.colorSlides = {
			max: 255,
			min: 0
		};
		$scope.opacitySlides = {
			max: 1,
			min: 0
		};

		$scope.standardColors = {
			red: 10,
			green: 22,
			blue: 91,
			alpha: 1,
			type: "standard"
		};

		$scope.rangeColors = {
			red: {max: 110, min: 90},
			green: {max: 200, min: 10},
			blue: {max: 50, min: 22},
			alpha: {max: 1, min: 0.5},
			type: "random"
		};

		var colors = $scope.standardColors;

		$scope.sampleSlide = 0;
		$scope.widthSlide = 19;

		var rangeSwatch = document.getElementById("rangeSwatch");
		var rangeSwatchLines = [], kid;
		for(var i = 0; i < 100; i++) {
			kid = document.createElement("DIV");
			kid.className = "rangeLine";
			rangeSwatchLines.push(kid);
			rangeSwatch.appendChild(kid);
		}

		var randomSwatch = function () {
			var r, g, b, a;
			var rMin = $scope.rangeColors.red.min, rRange = $scope.rangeColors.red.max - rMin,
				gMin = $scope.rangeColors.green.min, gRange = $scope.rangeColors.green.max - gMin,
				bMin = $scope.rangeColors.blue.min, bRange = $scope.rangeColors.blue.max - bMin,
				aMin = $scope.rangeColors.alpha.min, aRange = $scope.rangeColors.alpha.max - aMin;
			rangeSwatchLines.forEach(function (swatchLine) {
				r = Math.floor(Math.random() * rRange + rMin);
				g = Math.floor(Math.random() * gRange + gMin);
				b = Math.floor(Math.random() * bRange + bMin);
				a = Math.random() * aRange + aMin;
				swatchLine.style.backgroundColor = "rgba(" + r + "," + g + "," + b + "," + a + ")";
			});
		};

		var gradientSwatch = function () {
			var r, g, b, a;
			var rMin = $scope.rangeColors.red.min, rChange = ($scope.rangeColors.red.max - rMin) / 99,
				gMin = $scope.rangeColors.green.min, gChange = ($scope.rangeColors.green.max - gMin) / 99,
				bMin = $scope.rangeColors.blue.min, bChange = ($scope.rangeColors.blue.max - bMin) / 99,
				aMin = $scope.rangeColors.alpha.min, aChange = ($scope.rangeColors.alpha.max - aMin) / 99;
			rangeSwatchLines.forEach(function (swatchLine, index) {
				r = Math.floor(index * rChange + rMin);
				g = Math.floor(index * gChange + gMin);
				b = Math.floor(index * bChange + bMin);
				a = index * aChange + aMin;
				swatchLine.style.backgroundColor = "rgba(" + r + "," + g + "," + b + "," + a + ")";
			});
		};


		$scope.switchSlides = function (sample) {
			$scope.colorSample = sample;
			if(sample === "standard") {
				colors = $scope.standardColors;
			}else {
				// randomSwatch();
				gradientSwatch();
				colors = $scope.rangeColors;
			}
			setTimeout(function () { $rootScope.$broadcast("reCalcViewDimensions"); }, 1);
		};
		$scope.switchBrush = function (brush) {
			$scope.brush = brush;
		};
		$scope.switchPaint = function (paint) {
			$scope.paint = paint;
		};
		$scope.switchInterpolationStyle = function (style) {
			$scope.interpolationStyle = style;
		};

		var emitMark = function (event) {
			var fullMark = {
				brush: {
					variety: $scope.brush,
					positions: event.detail,
					size: $scope.widthSlide,
					interpolationStyle: $scope.interpolationStyle
				},
				mark: {
					r: colors.red,
					g: colors.green,
					b: colors.blue,
					a: colors.alpha,
					resample: $scope.sampleSlide,
					paint: $scope.paint
				}
			};
			console.log(fullMark);
			$rootScope.$emit("markEvent", fullMark);
		};
		document.addEventListener("lineEvent", emitMark);
		var unbind = function () {
			document.removeEventListener("lineEvent", emitMark);
		};
		$scope.$on("$destroy", unbind);

	};

	DrawController.$inject = ["$scope", "$rootScope"];

	return DrawController;
});

