app.controller("HomeCtrl", function ($scope, ImageFactory){
	ImageFactory.getPaintings().then(function(data){
		$scope.paintings = data;
		console.log($scope.paintings);
	});
});