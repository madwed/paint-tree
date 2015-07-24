define([], function () {
	"use strict";
	var UsersController = function ($scope, $http) {
		//$http.get <-- get all the users (maybe this should go in a userFactory)
		//Also will put methods to get single user, self, etc
	}

	UsersController.$inject = ["$scope", "$http"];

	return UsersController;
});
