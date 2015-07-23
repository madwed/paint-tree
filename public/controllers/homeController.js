define([], function () {
	var HomeController = function ($scope, ImageFactory) {
		ImageFactory.getPaintings().then(function (data) {
			$scope.paintings = data;
		});
	};

	HomeController.$inject = ["$scope", "ImageFactory"];

	return HomeController;
});

