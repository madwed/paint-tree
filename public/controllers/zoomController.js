define([], function () {
	var ZoomController = function ($scope, $rootScope, $state, ImageFactory) {
		var unbind = $rootScope.$on("imageChange", function (event, image) {
			$scope.theImage = image;
		});

		$scope.theImage = ImageFactory.images.currentImg;

		$scope.editImg = function () {
			ImageFactory.images.loadImg = true;
			$state.go("draw");
		};

		$scope.$on("$destroy", unbind);
	};

	ZoomController.$inject = ["$scope", "$rootScope", "$state", "ImageFactory"];

	return ZoomController;
});
