app.controller("HomeCtrl", function ($scope, ImageFactory) {
	ImageFactory.getPaintings().then(function (data) {
		console.log(data);
		$scope.paintings = data;
	});
});
