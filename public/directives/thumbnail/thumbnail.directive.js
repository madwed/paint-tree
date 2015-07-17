app.directive("thumbnail", function () {
	return {
		restrict: "E",
		scope: {
			painting: "=paintImg"
		},
		templateUrl: "/directives/thumbnail/thumbnail.html"
	}
});