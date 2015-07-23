define([], function () {
	var SignupController = function ($scope, Auth) {
		$scope.signup = function (signin) {
			if (signin) {
				$scope.credentials.login = true;
			}
	        Auth.signin($scope.credentials);
	    };
	};

	SignupController.$inject = ["$scope", "Auth"];

	return SignupController;
});
