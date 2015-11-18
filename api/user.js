var express = require('express'),
		mongoose = require('mongoose'),
		router = express.Router(),
		sha3 = require('crypto-js/sha3');

var saltString = 'somesalt';

router.post('/login', function(req, res, next) {

	var user = req.body.username;
	var pass = req.body.password;

	if(user && user !== '' && pass && pass !== '') {
		var passHash = sha3(pass + saltString, {outputLength: 256}).toString();

		var User = mongoose.model('User');

		User.findOne({username: user, password: passHash}, function(err, user) {
			if(err) {
				return next(err);
			} else {
				if (user) {
					res.json(user);
				} else {
					return next({status: 404, message: 'User not found'});
				}
			}
		});
	} else {
		return next({status: 404, message: 'User not found'});
	}
});

module.exports = router;