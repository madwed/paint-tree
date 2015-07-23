define([], function () {
	var MainController = function ($scope, $state) {
		$state.go("home");
	};

	MainController.$inject = ["$scope", "$state"];

	return MainController;
});
