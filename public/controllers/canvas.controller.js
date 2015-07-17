app.controller("CanvasCtrl", function ($scope, $http) {
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");

	var saveButton = document.getElementById("save");
	saveButton.addEventListener("click", function () {
		var canvasData = canvas.toDataURL();
		$http.post("/paintings/new", {img: canvasData, author: "Isaac Madwed"}).
			success(function (data) {
				console.log(data);
			}).
			error(function (error) {
				console.log(error);
			});
	});

});
