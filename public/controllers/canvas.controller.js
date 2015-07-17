app.controller("CanvasCtrl", function ($scope, $http, ImageFactory) {
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");

	var saveButton = document.getElementById("save");
	saveButton.addEventListener("click", function () {
		var canvasData = canvas.toDataURL();
		console.log("Saving");
		$http.post("/paintings/new", {img: canvasData, author: "Isaac Madwed"}).
			success(function (data) {
				console.log("Saved");
				console.log(data);
			}).
			error(function (error) {
				console.log(error);
			});
	});

	if(ImageFactory.currentImg){
		$scope.thePainting = ImageFactory.currentImg;
		ImageFactory.currentImg = undefined;
		var theImg = new Image();
		theImg.onload = function () {
			console.log(theImg.height);
			ctx.drawImage(theImg, 0, 0, canvas.width, canvas.height);
		}

		$http.get($scope.thePainting.image).then(function(response){
			theImg.src = response.data;
			$scope.loaded = true;
		});
	}

});
