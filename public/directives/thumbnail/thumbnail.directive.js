app.directive("thumbnail", function () {
	return {
		restrict: "E",
		scope: {
			theImage: "=painter"
		},
		controller: "ThumbnailCtrl",
		templateUrl: "/directives/thumbnail/thumbnail.html"
	};
});
