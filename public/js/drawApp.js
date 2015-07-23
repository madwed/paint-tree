define(["controllers/mainController",
	"controllers/canvasController",
	"controllers/zoomController",
	"controllers/homeController",
	"controllers/thumbnailController",
	"controllers/signupController",
	"controllers/drawController",

	"directives/thumbnailDirective",
	"directives/drawuiDirective",
	"directives/signupDirective",
	"directives/zoomDirective",

	"factories/imageFactory",
	"factories/authFactory",

	"bower_components/angular-ui-router/release/angular-ui-router.min",
	"js/rzslider.min"],
function (mainController, canvasController, zoomController, homeController, thumbnailController, signupController, drawController, thumbnailDirective, drawuiDirective, signupDirective, zoomDirective, imageFactory, authFactory) {

	var app = angular.module("DrawApp", ["ui.router", "rzModule"]);

	app.config(function ($stateProvider) {
		$stateProvider.state("home", {
			url: "/paintings",
			views: {
				"body": {
					controller: "HomeCtrl",
					templateUrl: "/templates/home.html"
				},
				"map": {
					templateUrl: "/templates/focus.html"
				}
			}
		//Can this .state somehow be called later... or the CanvasCtrl not be loaded until drawingBoard is loaded?
		}).state("draw", {
			url: "/ paint",
			views: {
				"body": {
					controller: "CanvasCtrl",
					templateUrl: "/templates/drawingBoard.html"
				},
				"map": {
					templateUrl: "/templates/ui.html"
				}
			}
		});
	});

	app.controller("MainCtrl", mainController);
	app.controller("CanvasCtrl", canvasController);
	app.controller("ZoomCtrl", zoomController);
	app.controller("HomeCtrl", homeController);
	app.controller("ThumbnailCtrl", thumbnailController);
	app.controller("SignupCtrl", signupController);
	app.controller("DrawCtrl", drawController);

	app.directive("thumbnail", thumbnailDirective); // Can directives be combined with their controller files?
	app.directive("drawui", drawuiDirective);
	app.directive("zoom", zoomDirective);
	app.directive("signup", signupDirective);

	app.factory("ImageFactory", imageFactory);
	app.factory("Auth", authFactory);
});


