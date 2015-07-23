define([], function () {
	var DrawuiDirective = function () {
		return {
			restrict: "E",
			controller: "DrawCtrl",
			templateUrl: "/directives/drawui.html"
		};
	};
	return DrawuiDirective;
});
