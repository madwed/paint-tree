app.controller("ThumbnailCtrl", function ($scope, $http) {
	$http.get($scope.thePainting.image).then(function(response){
		$scope.imgString = response.data;
		$scope.loaded = true;
	})
});