app.factory("Auth", function () {
	return {
		signin: function (credentials) {
			return $http.put("https://ec2-52-3-59-46.compute-1.amazonaws.com:8080/users/signin", credentials).
			success(function (data) {
				return data;
			}).
			error(function (data) {
				return data;
			});
		}
	};
});
