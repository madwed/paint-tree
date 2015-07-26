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
		$scope.redSlide = 10;
		$scope.greenSlide = 22;
		$scope.blueSlide = 91;
		$scope.alphaSlide = 1;

		$scope.redRangeSlide = {max: 110, min: 90};
		$scope.greenRangeSlide = {max: 200, min: 10};
		$scope.blueRangeSlide = {max: 50, min: 22};
		$scope.alphaRangeSlide = {max: 1, min: 0.5};

		$scope.sampleSlide = 0;
		$scope.widthSlide = 19;

		$scope.switchSlides = function (sample) {
			$scope.colorSample = sample;
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
				brush: $scope.brush,
				positions: event.detail,
				mark: {
					r: $scope.redSlide,
					g: $scope.greenSlide,
					b: $scope.blueSlide,
					a: $scope.alphaSlide,
					size: $scope.widthSlide,
					resample: $scope.sampleSlide,
					paint: $scope.paint,
					interpolationStyle: $scope.interpolationStyle
				}
			};
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

