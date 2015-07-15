var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/madpainter");
mongoose.connection.on("error", console.error.bind(console, "connection error:"));

var drawingSchema = new mongoose.Schema({
	author: String,
	img: String,
	contentType: String,
	dimensions: String,
	lastAccessed: {type: Date, default: Date.now }
});

drawingSchema.path("img").set(function (imgString) {
	try {
		this.contentType = imgString.match(/data\:(.*)\;/)[1];
	}catch(e) {
		console.log("img set Error: ", e);
	}

	var image64 = imgString.replace(/data:(?:.*);base64\,/, "");
	var img = new Buffer(image64, "base64");
	return img;
});

drawingSchema.virtual("thumbnail").get(function () {
	//return a thumbnail version of drawing
});

var Drawing = mongoose.model("Drawing", drawingSchema);

module.exports = {
	Drawing: Drawing
};
