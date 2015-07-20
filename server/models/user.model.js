var mongoose = require("mongoose");
var Promise = require("bluebird");
var db = require("../db");
var crypto = require("crypto");

var userSchema = new mongoose.Schema({
	name: String,
    photo: String,
    phone: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    hashedPassword: String,
	salt: String,
	lastAccessed: {
		type: Date,
		default: Date.now
	},
	_id: {
        type: String,
        unique: true
    }
});

userSchema.statics.loginAttempt = function (reqBody) {
    console.log(reqBody.email);
    return this.findOne({
        email: reqBody.email
    }).exec().then(function (user) {
        console.log(user);
        var hashedBuffer = crypto.pbkdf2Sync(reqBody.password, user.salt, 3, 16);
        var password = hashedBuffer.toString("base64");
        if (password === user.hashedPassword) {
            return user;
        } else {
            throw new Error("BAD LOGIN");
        }
    });
};

userSchema.virtual("password").set(function (str) {
    var saltBuffer = crypto.randomBytes(16);
    this.salt = saltBuffer.toString("base64");
    var hashedBuffer = crypto.pbkdf2Sync(str, this.salt, 3, 16);
    this.hashedPassword = hashedBuffer.toString("base64");
});

module.exports = db.model("User", userSchema);



