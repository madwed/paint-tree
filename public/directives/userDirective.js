define([], function () {
	"use strict";

	var UserDirective = function () {
		return {
			scope: {
				theUser: "=user"
			},
			templateUrl: "/directives/user.html"
		};
	};

	return UserDirective;
});