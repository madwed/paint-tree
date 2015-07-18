var app = angular.module("DrawApp", ["ui.router"]);

app.config(function ($stateProvider) {
	$stateProvider.state("home", {
		url: "/paintings",
		views: {
			"body": {
				controller: "HomeCtrl",
				templateUrl: "/templates/index.html"
			},
			"map": {
				controller: "SignInCtrl",
				templateUrl: "/templates/signin.html"
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
				controller: "SignInCtrl",
				templateUrl: "/templates/signin.html"
			}
		}
	});
});
