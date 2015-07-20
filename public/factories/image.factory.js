app.factory("ImageFactory", function ($http) {
	return {
		getPaintings: function () {
			return $http.get("http://ec2-52-3-59-46.compute-1.amazonaws.com:4040/paintings").
				then(function (res) {
					console.log(res.data);
					return res.data;
				}, function (err) {
					console.log(err);
				});
		},
		currentImg: undefined
	};
});

//
