define([], function () {
	var ZoomDirective = function () {
		return {
			restrict: "E",
			controller: "ZoomCtrl",
			templateUrl: "/directives/zoom.html"
		};
	};

	return ZoomDirective;
});
