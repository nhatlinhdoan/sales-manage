var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	username: String,
	fullname: String,
	dob: { type: Date, default: Date.now },
	address: String,
	gender: String,
	location: String,
	userphone: String
});

mongoose.model('User', userSchema);