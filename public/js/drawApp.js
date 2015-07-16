var app = angular.module("DrawApp", ["ui.router"]);

app.config(function ($stateProvider) {
	$stateProvider.state("home", {
		url: "/paintings",
		controller: "HomeCtrl",
		templateUrl: "/templates/index.html"
	//Can this .state somehow be called later... or the CanvasCtrl not be loaded until drawingBoard is loaded?
	}).state("draw", {
		url: "/paintings/new",
		controller: "CanvasCtrl",
		templateUrl: "/templates/drawingBoard.html"
	});
});
