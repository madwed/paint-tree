var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/madpainter");
mongoose.connection.on("error", console.error.bind(console, "connection error:"));

var drawingSchema = new mongoose.Schema({
	mainAuthor: String,
	subAuthor: String,
	dimensions: String,
	lastAccessed: {type: Date, default: Date.now }
});

drawingSchema.virtual("thumbnail").get(function () {
	//return a thumbnail version of drawing
});

var Drawing = mongoose.model("Drawing", drawingSchema);

module.exports = {
	Drawing: Drawing
};
