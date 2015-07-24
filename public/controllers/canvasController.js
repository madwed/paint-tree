// define(["js/lib/Vector", "js/lib/Brush", "js/lib/DryBrush", "js/lib/BrushManager", "js/lib/Piece"], function (Vector, Brush, DryBrush, BrushManager, Piece) { 
define(["js/lib/clickInterface", "js/lib/Piece"], function (clickInterface, Piece) {
	"use strict";

	var CanvasController = function ($scope, $rootScope, $http, ImageFactory) {
		var drawCanvas = document.getElementById("drawCanvas");
		var drawCtx = drawCanvas.getContext("2d");

		var saveButton = document.getElementById("save");
		saveButton.addEventListener("click", function () {
			var canvasData = drawCanvas.toDataURL();
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
		var thePiece;
		if(ImageFactory.images.loadImg) {
			ImageFactory.getCurrentImage().then(function (theImage) {
				var theImgObj = new Image();
				theImgObj.onload = function () {
					drawCtx.drawImage(theImgObj, 0, 0, drawCanvas.width, drawCanvas.height);
					thePiece = new Piece(drawCanvas);
					$scope.loaded = true;
				};
				theImgObj.src = theImage.image;
				$scope.theImage = theImage;
			});
		}else {
			thePiece = new Piece(drawCanvas);
			$scope.loaded = true;
		}

		var clickCanvas = document.getElementById("clickCanvas");
		clickInterface(clickCanvas, $scope);

		var unbind = $rootScope.$on("markEvent", function (event, mark) {
			thePiece.draw(mark);
		});

		$scope.$on("$destroy", unbind);

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

	CanvasController.$inject = ["$scope", "$rootScope", "$http", "ImageFactory"];

	return CanvasController;
});
