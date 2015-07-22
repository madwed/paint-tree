app.controller("CanvasCtrl", function ($scope, $http, ImageFactory) {
	var canvas = document.getElementById("drawCanvas");
	var ctx = canvas.getContext("2d");

	var saveButton = document.getElementById("save");
	saveButton.addEventListener("click", function () {
		var canvasData = canvas.toDataURL();
		var url = "/paintings/new/";
		url += $scope.theImage ? $scope.theImage.data._id.toString() : "new";
		$http.post("https://ec2-52-3-59-46.compute-1.amazonaws.com:8080" + url, {img: canvasData, author: "Isaac Madwed"}).
			success(function (data) {
				console.log(data);
			}).
			error(function (error) {
				console.log(error);
			});
	});
	if(ImageFactory.images.loadImg) {
		ImageFactory.getCurrentImage().then(function (theImage) {
			var theImgObj = new Image();
			theImgObj.onload = function () {
				ctx.drawImage(theImgObj, 0, 0, canvas.width, canvas.height);
				$scope.loaded = true;
			};
			console.log($scope.theImage);
			theImgObj.src = theImage.image;
			$scope.theImage = theImage;
		});
	}

});
