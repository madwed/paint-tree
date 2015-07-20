app.controller("CanvasCtrl", function ($scope, $http, ImageFactory) {
	var canvas = document.getElementById("drawCanvas");
	var ctx = canvas.getContext("2d");

	var saveButton = document.getElementById("save");
	saveButton.addEventListener("click", function () {
		var canvasData = canvas.toDataURL();
		console.log("Saving");
		$http.post("https://ec2-52-3-59-46.compute-1.amazonaws.com:8080/paintings/new", {img: canvasData, author: "Isaac Madwed"}).
			success(function (data) {
				console.log(data);
			}).
			error(function (error) {
				console.log(error);
			});
	});

	if(ImageFactory.currentImg) {
		$scope.thePainting = ImageFactory.currentImg;
		ImageFactory.currentImg = undefined;
		var theImg = new Image();
		theImg.onload = function () {
			ctx.drawImage(theImg, 0, 0, canvas.width, canvas.height);
			$scope.loaded = true;
		};

		theImg.src = $scope.thePainting.image;
	}

});
