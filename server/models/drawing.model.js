var mongoose = require("mongoose");
var Promise = require("bluebird");
var db = require("../db");
var AWS = require("aws-sdk");
var s3 = new AWS.S3();

var drawingSchema = new mongoose.Schema({
	mainAuthor: String,
	subAuthor: String,
	parent: String,
	lastAccessed: {
		type: Date,
		default: Date.now
	}
});

drawingSchema.virtual("link").get(function () {
	return "https://s3.amazonaws.com/madpainter/drawings/" + this._id;
});


var resolveImageLink = function (imgData) {
	return {data: imgData, image: imgData.link};
};
drawingSchema.statics.loadImages = function (limit) {
	//return a thumbnail version of drawing
	return this.find().limit(limit).exec().then(function (images) {
		return Promise.map(images, resolveImageLink);
	});
};

//Promisified get object, retrieves img string
var s3FindImage = function (imgData) {
	return new Promise(function (resolve, reject) {
		s3.getObject({
			Bucket: "/madpainter/drawings",
			Key: imgData._id + ""
		}, function (err, image) {
			console.log("imgFromS3", image);
			if(err) { reject(err); }
			else {
				var imgString = "data:image/png;base64," + image.Body.toString("base64");
				resolve({data: imgData, image: imgString});
			}
		});
	});
};
drawingSchema.statics.loadImageForDrawing = function (imageId) {
	return this.findOne({_id: imageId}).exec().then(function (image) {
		return s3FindImage(image);
	});
};

module.exports = db.model("Drawing", drawingSchema);
