"use strict";

var router = require("express").Router();
var AWS = require("aws-sdk");
var s3 = new AWS.S3();

router.post("/signin", function (res, req, next) {

});


module.exports = router;
