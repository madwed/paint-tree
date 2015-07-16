var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/madpainter");
mongoose.connection.on("error", console.error.bind(console, "connection error:"));

var AWS = require("aws-sdk");
var s3 = new AWS.S3();
var Promise = require("bluebird");


var drawingSchema = new mongoose.Schema({
	mainAuthor: String,
	subAuthor: String,
	dimensions: String,
	link: String,
	lastAccessed: {type: Date, default: Date.now }
});


var s3FindImage = function (imgData) {
	return s3.getObject({
		Bucket: "/madpainter/drawings", 
		Key: imgData.link,
		ResponseContentType: 'utf8'
	}, function (err, image) {
		if(err) { return err; }
		else {
			return {
				data: imgData, 
				image: image.Body.toString("utf8")
			};
		}
	});
};



drawingSchema.methods.setLink = function () {
	this.link = this._id + "";
};

drawingSchema.pre("save", function (next) {
	this.setLink();
	next();
});

drawingSchema.statics.loadImages = function () {
	//return a thumbnail version of drawing
	return this.find().exec().then(function (images) {
		return Promise.map(images, s3FindImage).then(function(results){
			return results;
		}, function(err){
			return err;
		});	
	});
};

var Drawing = mongoose.model("Drawing", drawingSchema);

module.exports = {
	Drawing: Drawing
};
