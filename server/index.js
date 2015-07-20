"use strict";

var https = require("https");
var app = require("./app");
var fs = require("fs");
var path = require("path");

var options = {
	key: fs.readFileSync(path.join(__dirname, "../key.pem")),
	cert: fs.readFileSync(path.join(__dirname, "../cert.pem"))
};

var porthttps = 8080;
var porthttp = 4040;


var httpServer = app.listen(porthttp, function () {
	console.log("HTTP server quietly listening on port", porthttp);
});

var httpsServer = https.createServer(options, app).listen(porthttps, function () {
	console.log("HTTPS server patiently listening on port", porthttps);
});


module.exports = {
	https: httpsServer,
	http: httpServer
};
