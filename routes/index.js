var router = require("express").Router();
var path = require("path");

var models = require("../models");

//Route that serves up the main page
router.get("/", function (req, res) {
	res.sendFile(path.join(__dirname, "../layout.html"));
});

var paintingsRoute = require("./painting.js");
router.use("/paintings", paintingsRoute);

module.exports = router;

