
"use strict";

var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var router = require(path.join(__dirname, "../routes"));
var sass = require("node-sass-middleware");

var app = express();

app.use(
  sass({
    src: path.join(__dirname, "../assets"), //where the sass files are
    dest: path.join(__dirname, "../public"), //where css should go
    debug: true
  })
);

app.use(bodyParser.urlencoded({extended: false, limit: "700kb"}));
app.use(bodyParser.json({limit: "700kb"}));

app.use("/bower_components", express.static(path.join(__dirname, "../bower_components")));
app.use(express.static(path.join(__dirname, "../public")));
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

module.exports = app;
