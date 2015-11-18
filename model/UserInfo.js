var mongoose = require('mongoose');

var userInfoSchema = new mongoose.Schema({
	user_id: String,
	fullname: String,
	gender: String,
	birthday: Date,
	address: String,
	location: String,
	phone: String,
	email: String
});

mongoose.model('UserInfo', userInfoSchema);