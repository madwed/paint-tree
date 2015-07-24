define(["controllers/signupController"], function (signupController) {
	var SignupDirective = function () {
		return {
			restrict: "E",
			controller: signupController,
			templateUrl: "/directives/signup.html"
		};
	};

	return SignupDirective;
});
