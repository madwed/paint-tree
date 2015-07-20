app.controller("SignupCtrl", function ($scope) {
	$scope.signup = function () {
		console.log($scope.credentials);
        // Auth.signup($scope.credentials);
    }
});
