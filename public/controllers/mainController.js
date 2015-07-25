define([], function () {
	var MainController = function ($scope, $state) {
		$state.go("home");
		$scope.signupnow = false;
	};

	MainController.$inject = ["$scope", "$state"];

	return MainController;
});
