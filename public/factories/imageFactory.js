define([], function () {

	var ImageFactory = function ($http, $rootScope) {
		var images = {loadImg: false};
		return {
			getPaintings: function () {
				return $http.get("/paintings").
					then(function (res) {
						// console.log(res);
						return res.data;
					}, function (err) {
						console.log(err);
					});
			},
			setCurrentImage: function (image) {
				$rootScope.$emit("imageChange", image);
				images.currentImg = image;
			},
			getCurrentImage: function () {
				images.loadImg = false;
				var currentImgRoute = "/paintings/" + images.currentImg.data._id;
				console.log(currentImgRoute);
				return $http.get(currentImgRoute).
					then(function (res) {
						return res.data;
					}, function (err) {
						console.log(err);
					});
			},
			images: images
		};
	};

	ImageFactory.$inject = ["$http", "$rootScope"];

	return ImageFactory;
});
