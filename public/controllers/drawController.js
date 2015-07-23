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

		$scope.currentMark = {
			r: $scope.redSlide,
			g: $scope.greenSlide,
			b: $scope.blueSlide,
			a: $scope.alphaSlide
		};

		var emitMark = function (event) {
			var fullMark = {positions: event.detail, mark: $scope.currentMark};
			fullMark.mark.mark = "acrylic";
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

