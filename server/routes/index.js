var router = require("express").Router();
var path = require("path");

//Route that serves up the main page
router.get("/", function (req, res) {
	res.sendFile(path.join(__dirname, "../layout.html"));
});

var paintingsRoute = require("./painting");
var usersRoute = require("./users");
router.use("/paintings", paintingsRoute);
router.use("/users", usersRoute);

module.exports = router;

