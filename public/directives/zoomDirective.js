define(["controllers/zoomController"], function (zoomController) {
	var ZoomDirective = function () {
		return {
			restrict: "E",
			controller: zoomController,
			templateUrl: "/directives/zoom.html"
		};
	};

	return ZoomDirective;
});
