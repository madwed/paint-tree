app.controller("SignupCtrl", function ($scope) {
	$scope.signup = function (signin) {
		if (signin) {
			$scope.credentials.login = true;
		}
		console.log($scope.credentials);
        // Auth.signup($scope.credentials);
    };
});
