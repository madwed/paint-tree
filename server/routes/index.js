var router = require("express").Router();
var path = require("path");

//Route that serves up the main page
router.get("/", function (req, res) {
	console.log("home", req.session.userId);
	res.sendFile(path.join(__dirname, "../layout.html"));
});

var paintingsRoute = require("./painting.route");
var usersRoute = require("./users.route");
router.use("/paintings", paintingsRoute);
router.use("/users", usersRoute);

module.exports = router;

