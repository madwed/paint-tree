
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
		url: "/paint",
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
