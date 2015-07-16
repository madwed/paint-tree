app.directive("thumbnail", function () {
	return {
		restrict: "E",
		scope: {
			painting: "=paint-img"
		},
		templateUrl: "/directives/thumbnail/thumbnail.html"
	}
});