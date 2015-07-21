app.directive("thumbnail", function () {
	return {
		restrict: "E",
		scope: {
			thePainting: "=painter"
		},
		controller: "ThumbnailCtrl",
		templateUrl: "/directives/thumbnail/thumbnail.html"
	};
});
