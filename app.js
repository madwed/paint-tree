
"use strict";

var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var router = require(path.join(__dirname, "/routes"));
var sass = require("node-sass");

sass.renderSync({
	file: path.join(__dirname, "/assets/stylesheets/style.scss"),
	outFile: path.join(__dirname, "/public/stylesheets/style.css")
});

var app = express();

app.use(
  sass({
    src: __dirname + '/assets', //where the sass files are 
    dest: __dirname + '/public', //where css should go
    debug: true
  })
);

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

app.listen(3000, function () {
	console.log("The server is listening closely on port 3000");
});
