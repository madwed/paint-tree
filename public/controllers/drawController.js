define([], function () {
	var DrawController = function ($scope, $rootScope) {
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

		$scope.switchSlides = function () {
			$scope.random = !$scope.random;
			// $rootScope.$broadcast("reCalcViewDimensions");
		};

		var emitMark = function (event) {
			var fullMark = {
				positions: event.detail,
				mark: {
					r: $scope.redSlide,
					g: $scope.greenSlide,
					b: $scope.blueSlide,
					a: $scope.alphaSlide,
					size: $scope.widthSlide,
					resample: $scope.sampleSlide
				}
			};
			fullMark.mark.mark = "acrylic";
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

