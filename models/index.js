var mongoose = require("mongoose");
var Promise = require("bluebird");
mongoose.connect("mongodb://localhost/madpainter");
mongoose.connection.on("error", console.error.bind(console, "connection error:"));

// var AWS = require("aws-sdk");
// var s3 = new AWS.S3();


var drawingSchema = new mongoose.Schema({
	mainAuthor: String,
	subAuthor: String,
	lastAccessed: {type: Date, default: Date.now }
});

drawingSchema.virtual("link").get(function () {
	return "https://s3.amazonaws.com/madpainter/drawings/" + this._id;
});

//Promisified get object, actually retrieves 

// var s3FindImage = function(imgData){
// 	return new Promise(function(resolve, reject){
// 		s3.getObject({
// 			Bucket: "/madpainter/drawings", 
// 			Key: imgData.link,
// 			ResponseContentType: 'utf8'
// 		}, function(err, image){
// 			if(err) { reject(err); }
// 			else {
// 				resolve({data: imgData, image: image.Body.toString("utf8")});
// 			}
// 		});
// 	});
// };


drawingSchema.statics.loadImages = function (limit) {
	//return a thumbnail version of drawing
	return this.find().limit(limit).exec();

	// .then(function (images) {
	// 	return Promise.map(images, s3FindImage);
	// });
};

var Drawing = mongoose.model("Drawing", drawingSchema);

module.exports = {
	Drawing: Drawing
};
