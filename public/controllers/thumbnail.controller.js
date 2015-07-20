app.controller("ThumbnailCtrl", function ($scope, $state, ImageFactory) {

	$scope.thePainting.thumbnail = $scope.thePainting.image + "?w=168"
	$scope.loaded = true;

	$scope.editImg = function () {
		ImageFactory.currentImg = $scope.thePainting;
		$state.go("draw");
	};
});