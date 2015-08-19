var express = require('express'),
	router = express.Router(),
    mongoose = require('mongoose');

router.route('/orders')
			.get(function(req, res, next) {
				// get list order
				mongoose.model('Order').find({}, function(err, users) {
					if(err) {
						return console.error(err);
					} else {
						res.format({
							html: function() {
								res.render('index', {
									title: 'Show user list',
									userListData: users
								})
							},
							json: function() {
								res.json(users);
							}
						});
					}
				});
			})
			.post(function(req, res, next) {
			// post new order

			});

router.param('id', function(req, res, next, id) {
	// validate 'id' value before query

});

router.route('/orders/:id')
			.get(function(req, res, next) {
			// get order by id

			})
			.put(function(req, res, next) {
			// update order

			})
			.delete(function(req, res, next) {
			// delete order

			});

module.exports = router;