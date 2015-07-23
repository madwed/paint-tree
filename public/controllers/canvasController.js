// define(["js/lib/Vector", "js/lib/Brush", "js/lib/DryBrush", "js/lib/BrushManager", "js/lib/Piece", "js/lib/clickInterface"], function (Vector, Brush, DryBrush, BrushManager, Piece) { 
define([], function () {

	var CanvasController = function ($scope, $http, ImageFactory) {
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
				theImgObj.src = theImage.image;
				$scope.theImage = theImage;
			});
		}

		// var clickCanvas = document.getElementById("clickCanvas");
		// clickInterface(clickCanvas);


		// window.onload = function() {
		//   var canvas1 = document.getElementById("canvas1");
		//   bigMan = new Piece();
		//   bigMan.init(canvas1);
		//   var brushMan = new BrushManager(function(marks){return this.invertG(marks); }
		//     , function(){return this.getMarksNoGaps(); });
		//   bigMan.addManager(brushMan);
		//   for(var i = 0; i < 100; i++){
		//     var pos = Math.random() * 800;
		//     brushMan.addBrush(new Brush(pos, pos, pos + 35 * Math.random(), pos + 15, new Vector(Math.random() - .5, Math.random() - .5), Infinity, Infinity, 20, Math.random() * 100));
		//     var newBrush = brushMan.brushes[brushMan.brushes.length - 1];
		//     newBrush.setMaxSpeedAndForce(1, .01);
		//     newBrush.rgbaValues = [255, 25, Math.random() * 255, 255];
		//   }

		//   var brushMan1 = new BrushManager(function(marks){return this.smearOpaque(marks); }
		//     , function(){return this.getMarks(); });
		//   bigMan.addManager(brushMan1);
		//   for(var i = 0; i < 100; i++){
		//     var pos = Math.random() * 800;
		//     brushMan1.addBrush(new DryBrush(pos, pos, pos + 15, pos + 15, new Vector(Math.random() - .5, Math.random() - .5), Infinity, Infinity, 20, Math.random() * 100));
		//     var newBrush = brushMan1.brushes[brushMan1.brushes.length - 1];
		//     newBrush.setMaxSpeedAndForce(1, .01);
		//     newBrush.rgbaValues = [Math.random() * 255, 0, Math.random() * 255, 255];
		//   }

		//   bigMan.initUI();

		//   now();
		// }

		// now = function(){

		//   var animloop;

		//   (animloop = function() {
		//     var animloop_id;
		//     animloop_id = requestAnimationFrame(animloop);
		//     bigMan.run();
		//     bigMan.clickInterface();
		    

		//   })();
		// };

	};

	CanvasController.$inject = ["$scope", "$http", "ImageFactory"];

	return CanvasController;
});
