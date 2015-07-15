app.controller("CanvasCtrl", function ($scope, $http) {
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	function loadAndDrawImage (url) {
		// Create an image object. This is not attached to the DOM and is not part of the page.
		var image = new Image();

		// When the image has loaded, draw it to the canvas
		image.onload = function () {
			image.crossOrigin = "anonymous";
			// console.log(image);
			ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
		};

		// Now set the source of the image that we want to load
		image.src = url;
	}
	// loadAndDrawImage("http://payload365.cargocollective.com/1/0/31246/9612544/18-03-2015_diemme_fontesi_blacksuede_4_dl_618.jpeg");

	var saveButton = document.getElementById("save");
	saveButton.addEventListener("click", function () {
		var canvasData = canvas.toDataURL();
		$http.post("/", {img: canvasData, author: "Isaac Madwed"}).
			success(function (data) {
				console.log(data);
			}).
			error(function (error) {
				console.log(error);
			});
	});

});
