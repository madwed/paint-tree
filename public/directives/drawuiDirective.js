define(["controllers/drawuiController"], function (drawuiController) {
	var DrawuiDirective = function () {
		return {
			restrict: "E",
			controller: drawuiController,
			templateUrl: "/directives/drawui.html"
		};
	};
	return DrawuiDirective;
});
