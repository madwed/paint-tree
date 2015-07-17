app.factory("ImageFactory", function ($http) {
	return {
		getPaintings: function () {
			return $http.get("/paintings").
				then(function (res) {
					return res.data;
				}, function (err) {
					console.log(err);
				});
		},
		currentImg: undefined
	}
});