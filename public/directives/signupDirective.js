define([], function () {
	var SignupDirective = function () {
		return {
			restrict: "E",
			controller: "SignupCtrl",
			templateUrl: "/directives/signup.html"
		};
	};

	return SignupDirective;
});
