app.directive("thumbNail", function () {
	return {
		restrict: "E",
		scope: {
			thePainting: "=painter"
		},
		templateUrl: "/directives/thumbnail/thumbnail.html"
	}
});