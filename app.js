var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var router = require(path.join(__dirname, "/routes"));

var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use("/bower_components", express.static(path.join(__dirname, "/bower_components")));
app.use(express.static(path.join(__dirname, "/public")));
app.use("/", router);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});

// handle any errors
app.use(function (err, req, res) {
    res.status(err.status || 500);
    console.log({error: err});
    res.send(err);
});

app.listen(3000, "0.0.0.0", function () {
	console.log("The server is listening closely on port 3000");
});
