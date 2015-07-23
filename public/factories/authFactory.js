define([], function () {
	var AuthFactory = function ($http) {
		return {
			signin: function (credentials) {
				var method = "POST";
				if (credentials.login) {
					method = "PUT";
				}
				var req = {
					method: method,
					url: "https://ec2-52-3-59-46.compute-1.amazonaws.com:8080/users/signin",
					data: credentials
				};

				return $http(req).
				success(function (data) {
					console.log("signin success", data);
					return data;
				}).
				error(function (data) {
					console.log("signin error", data);
					return data;
				});
			}
		};
	};

	AuthFactory.$inject = ["$http"];

	return AuthFactory;
});
