app.factory("ImageFactory", function ($http) {
	return {
		getPaintings: function () {
			return $http.get("https://ec2-52-3-59-46.compute-1.amazonaws.com:8080/paintings").
				then(function (res) {
					console.log(res);
					return res.data;
				}, function (err) {
					console.log(err);
				});
		},
		currentImg: undefined
	};
});

//
