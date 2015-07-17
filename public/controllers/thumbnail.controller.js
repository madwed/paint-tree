app.controller("ThumbnailCtrl", function ($scope, $http, $state, ImageFactory) {
	// $http.get($scope.thePainting.image).then(function(response){
	// 	$scope.thePainting.imgString = response.data;
	// 	
	// });
	$scope.loaded = true;
	
	$scope.editImg = function () {
		ImageFactory.currentImg = $scope.thePainting;
		$state.go("draw");
	};
});