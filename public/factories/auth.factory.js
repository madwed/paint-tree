app.factory("Auth", function () {
	return {
		signin: function (credentials) {
			return $http.post("/signin", credentials).
			success(function (data) {
				return data;
			}).
			error(function (data) {
				return data;
			});
		}
	};
});
