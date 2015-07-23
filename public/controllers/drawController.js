define([], function () {
	var DrawController = function ($scope) {
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
	};

	DrawController.$inject = ["$scope"];

	return DrawController;
});

