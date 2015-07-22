app.controller("ThumbnailCtrl", function ($scope, $state, ImageFactory) {
	$scope.loaded = true;

	$scope.editImg = function () {
		ImageFactory.currentImg = $scope.thePainting;
		$state.go("draw");
	};
});