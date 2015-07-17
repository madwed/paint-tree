var router = require("express").Router();
var AWS = require("aws-sdk");
var s3 = new AWS.S3();
var Promise = require("bluebird");


var models = require("../models");


// Route: /paintings/
router.get("/", function (req, res) {
	//Route that serves up a number of root images from the database
	//For viewing
	models.Drawing.loadImages().then(function (info) {
		res.json(info);
	}).then(null, function (err) {
		console.log("Error loading home page images", err);
		res.send(404);
	});
});

router.post("/new", function (req, res) {
	var image64 = req.body.img;
	// console.log(buffer);
	// console.log("data:image/png;base64," + buffer.toString("base64"));

	var draw = new models.Drawing();
	draw.mainAuthor = req.body.author;
	draw.save(function (err) {
		if (err) { throw err; }
		var drawKey = draw._id + "";
		s3.putObject({
			Bucket: "madpainter/drawings",
			Key: drawKey,
			Body: req.body.img
		}, function (error, data) {
			if(error) {
				console.log(err);
				res.send("Error");
			} else {
				console.log(data);
				res.send("Saved");
			}
		});
		// console.log(awstest2);
	});
});

router.get("/:paintingId", function (req, res) {
	//Route that serves a painting to the canvas
});

router.post("/:paintingId", function (req, res) {
	//Route that adds a new child painting to the database
	//:paintingId is the painting's direct parent


	///USE Grep like tool to search the img base64 data string for
//1)base64_decode
//2)gzinflate(base64_decode
//3)eval(gzinflate(base64_decode
//4)eval(base64_decode


	// // Loads mikeal/request Node.js library.
	// //simple way to make http calls <***<***<***<***<***<***<***<***<***<Isaac
  //   var request = require('request');

  //   // Specify the encoding (the important thing is to keep the it the same when creating the buffer after)
  //   // If you only give the URL, it breaks the downloaded data, I couldn't find another way to do it.
  //   request({
  //         url: 'http://www.cedynamix.fr/wp-content/uploads/Tux/Tux-G2.png',
  //         encoding: 'binary'
  //       }, function(error, response, body) {
  //         if (!error && response.statusCode === 200)
  //            body = new Buffer(body, 'binary');

  //            // Here "body" can be affected to the "a.img.data"
  //            // var a = new A;
  //            // a.img.data = body;
  //            // ....
  //         }
  //    });

	
	var image64 = req.body.img;
	// console.log(buffer);
	// console.log("data:image/png;base64," + buffer.toString("base64"));

	var draw = new models.Drawing();
	draw.mainAuthor = req.body.author;
	draw.save(function (err) {
		if (err) { throw err; }
		var drawKey = draw._id + "";
		s3.putObject({
			Bucket: "madpainter/drawings",
			Key: drawKey,
			Body: req.body.img
		}, function (error, data) {
			if(error) {
				console.log(err);
				res.send("Error");
			} else {
				console.log(data);
				res.send("Saved");
			}
		});
		// console.log(awstest2);


	});





});

module.exports = router;

