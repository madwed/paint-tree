"use strict";

var express = require("express");
var session = require("express-session");
var path = require("path");
var bodyParser = require("body-parser");
var router = require(path.join(__dirname, "./routes"));
var sass = require("node-sass-middleware");
var fs = require("fs");
var logger = require("morgan");
var db = require(path.join(__dirname, "./db"));
var MongoStore = require("connect-mongo")(session);

var app = express();

app.use(logger("dev"));

// app.use(express.cookieParser());
app.use(session({
  secret: fs.readFileSync(path.join(__dirname, "./sessionKey.txt"), "utf8"),
  resave: false,
  saveUninitialize: false,
  cookie: {
    httpOnly: false,
    secure: true
  },
  store: new MongoStore({mongooseConnection: db, ttl: 7 * 24 * 60 * 60})
}));

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

// var cors = {
//     origin: ["www.one.com", "www.two.com", "www.three.com"],
//     default: "www.one.com"
// };

// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "http://ec2-52-3-59-46.compute-1.amazonaws.com:4040");
//   res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });


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
