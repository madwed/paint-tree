define(["controllers/thumbnailController"], function (thumbnailController) {
	var ThumbnailDirective = function () {
		return {
			restrict: "E",
			scope: {
				theImage: "=painting"
			},
			controller: thumbnailController,
			templateUrl: "/directives/thumbnail.html"
		};
	};

	return ThumbnailDirective;
}); 
