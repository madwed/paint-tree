var mongoose = require("mongoose");
var Promise = require("bluebird");
mongoose.connect("mongodb://localhost/madpainter");
mongoose.connection.on("error", console.error.bind(console, "connection error:"));

var AWS = require("aws-sdk");
var s3 = new AWS.S3();



var drawingSchema = new mongoose.Schema({
	mainAuthor: String,
	subAuthor: String,
	dimensions: String,
	link: String,
	lastAccessed: {type: Date, default: Date.now }
});

drawingSchema.methods.setLink = function () {
	this.link = this._id + "";
};

drawingSchema.pre("save", function (next) {
	this.setLink();
	next();
});

var s3FindImage = function(imgData){
	return new Promise(function(resolve, reject){
		s3.getObject({
			Bucket: "/madpainter/drawings", 
			Key: imgData.link,
			ResponseContentType: 'utf8'
		}, function(err, image){
			if(err) { reject(err); }
			else {
				resolve({data: imgData, image: image.Body.toString("utf8")});
			}
		});
	});
};


drawingSchema.statics.loadImages = function () {
	//return a thumbnail version of drawing
	return this.find().exec().then(function (images) {
		return Promise.map(images, s3FindImage);
	}).then(function(results){
		console.log(results);
		return results;
	}, function(err){
		console.log(err, "err in loadImages")
		return err;
	});	
};

var Drawing = mongoose.model("Drawing", drawingSchema);

module.exports = {
	Drawing: Drawing
};
