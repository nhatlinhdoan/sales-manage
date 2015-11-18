var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	username: String,
	password: String,
	register_date: Date,
	status: String
});

mongoose.model('User', userSchema);