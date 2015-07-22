app.controller("SignupCtrl", function ($scope, Auth) {
	console.log("signedup");
	$scope.signup = function (signin) {
		if (signin) {
			$scope.credentials.login = true;
		}
        Auth.signin($scope.credentials);
    };
});
