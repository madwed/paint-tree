app.directive("thumbNail", function () {
	return {
		restrict: "E",
		scope: {
			thePainting: "=painter"
		},
		controller: "ThumbnailCtrl",
		templateUrl: "/directives/thumbnail/thumbnail.html"
	}
});