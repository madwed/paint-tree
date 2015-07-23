define([], function () {
	var ThumbnailController = function ($scope, ImageFactory) {
		$scope.loaded = true;
		if (!ImageFactory.images.currentImg) {
			ImageFactory.setCurrentImage($scope.theImage);
		}

		$scope.changeImg = function () {
			ImageFactory.setCurrentImage($scope.theImage);
		};
	};

	ThumbnailController.$inject = ["$scope", "ImageFactory"];

	return ThumbnailController;
});
