define([], function () {
	var ThumbnailDirective = function () {
		return {
			restrict: "E",
			scope: {
				theImage: "=painter"
			},
			controller: "ThumbnailCtrl",
			templateUrl: "/directives/thumbnail.html"
		};
	};

	return ThumbnailDirective;
}); 
