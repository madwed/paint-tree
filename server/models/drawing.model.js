var mongoose = require("mongoose");
var Promise = require("bluebird");
var db = require("../db");

var drawingSchema = new mongoose.Schema({
	mainAuthor: String,
	subAuthor: String,
	lastAccessed: {
		type: Date,
		default: Date.now
	},
	_id: {
        type: String,
        unique: true
    }
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

var resolveImage = function (imgData) {
	return {data: imgData, image: imgData.link};
};


drawingSchema.statics.loadImages = function (limit) {
	//return a thumbnail version of drawing
	return this.find().limit(limit).exec().then(function (images) {
		return Promise.map(images, resolveImage);
	});

	// .then(function (images) {
	// 	return Promise.map(images, s3FindImage);
	// });
};

module.exports = db.model("Drawing", drawingSchema);