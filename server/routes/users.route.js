"use strict";

var router = require("express").Router();
var AWS = require("aws-sdk");
var s3 = new AWS.S3();
var User = require("../models/user.model");


router.post("/signup", function (req, res, next) {
	console.log(req.body);
    User.create(req.body)
        .then(function (user) {
            res.status(201).json(user);
        })
        .then(null, next);
});

router.put("/signin", function (req, res, next) {
    User.loginAttempt(req.body)
        .then(function (user) {
            if (!user) { throw "You don't exist"; }
            req.session.userId = user.email;
            res.json(user);
        }).then(null, function (error) {
            console.log(error);
            res.send(401);
        });
});

router.put("/logout", function (req, res, next) {
    req.session.userId = undefined;
    res.send(200);
});


module.exports = router;
