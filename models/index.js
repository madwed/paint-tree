var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/madpainter");
mongoose.connection.on("error", console.error.bind(console, "connection error:"));

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

drawingSchema.virtual("thumbnail").get(function () {
	//return a thumbnail version of drawing
});

var Drawing = mongoose.model("Drawing", drawingSchema);

module.exports = {
	Drawing: Drawing
};
