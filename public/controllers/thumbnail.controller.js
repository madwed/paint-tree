app.controller("ThumbnailCtrl", function ($scope, $state, ImageFactory) {
	console.log($scope.thePainting, "thumb");
	$scope.thePainting.thumbnail = $scope.thePainting.image;
	$scope.loaded = true;

	$scope.editImg = function () {
		ImageFactory.currentImg = $scope.thePainting;
		$state.go("draw");
	};
});