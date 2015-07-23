define([], function () {

	var ImageFactory = function ($http, $rootScope) {
		var images = {loadImg: false};
		return {
			getPaintings: function () {
				return $http.get("https://ec2-52-3-59-46.compute-1.amazonaws.com:8080/paintings").
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
				var currentImgRoute = "https://ec2-52-3-59-46.compute-1.amazonaws.com:8080/paintings/" + images.currentImg.data._id;
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
