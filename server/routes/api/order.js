var express = require('express'),
		router = express.Router(),
		mongoose = require('mongoose');

router.get('/', function(req, res, next) {
	res.redirect('/api/orders');
});

router.get('/orders/count', function(req, res, next) {
				// get list order
				mongoose.model('Order').count({}, function(err, total) {
					if(err) {
						return next(err);
					} else {
						res.json(total);
					}
				}); // end of GET
			});

router.route('/orders/:skip/:limit')
			.get(function(req, res, next) {

				console.log('Call to API Get orderList with limit');

				var _limit = parseInt(req.params.limit),
						_skip = parseInt(req.params.skip);

				// get list order with limit
				var query = mongoose.model('Order').find()
					.skip(_skip)
					.limit(_limit)
					.exec(function(err, orders) {
					if(err) {
						return console.error(err);
					} else {
						res.format({
							html: function() {
								res.render('index', {
									title: 'Show order list',
									data: orders
								});
							},
							json: function() {
								console.log(JSON.stringify(orders));
								res.json(orders);
							}
						});
					}
				}); // end of GET
			});

router.route('/orders')
			.post(function(req, res, next) {
				// post new order
				var _category 		= req.body.category.trim(), 
					_ordername 	= req.body.ordername.trim(), 
					_price 			= req.body.price, 
					_stock 			= req.body.quatity;

				var order = mongoose.model('Order');

				// Checking order's information is not conflict
				order.findOne({
					category 	: _category, 
					ordername : _ordername
				}, function(err, order) {

					if (err) {
					
						console.error('There was the problem checking the information before insert to the database'); 
						return next(err);
					
					} else if (order) {
					
						var ierr = new Error('Item was conflict');
						return next(ierr);
					
					} else {
						// Create a new order object
						var neworder = new order({
							category 	: _category, 
							ordername : _ordername, 
							price 		: _price, 
							stock 		: _stock 
						});

						// execute adding to database
						neworder.save(function(err, order) {
							if(err) { 

								console.error('There was the problem adding the information to the database'); 
								res.send(err);

							} else { 
								
								console.log('Created successfully new order: ' + order);
								res.format({
									html: function() {
										res.location('index');
										res.redirect('/index');
									},
									json: function() {
										res.json(order);
									}
								});
							}
						}); // end of execute adding
					}
				}); // end of POST
			})
			.put(function(req, res, next) {
				// update order
				var _id 			= req.body._id,
					_category 		= req.body.category.trim(), 
					_ordername 	= req.body.ordername.trim(), 
					_price 			= req.body.price;
					// _stock 		= req.body.quatity;

				var order = mongoose.model('Order');

				// Find order's information was update
				order.findById(_id, function(err, orderUpdate) {
					if (err) {
						console.error('There was the problem getting the information from database: ' + err);
						return next(err);

					} else if (orderUpdate) {

						var changes = {
							category 	: _category, 
							ordername : _ordername, 
							price 		: _price
						};

						var optionsUpdate = {};

						// checking fields was update
						for (var property in changes) {
							if (changes.hasOwnProperty(property) && (orderUpdate[property] != changes[property])) {
								optionsUpdate[property] = changes[property];
							}
						}
						
						// execute updating
						order.findByIdAndUpdate(_id, optionsUpdate, function(err, order) {
							if(err) { 
								console.error('There was the problem updating the information to the database'); 
								res.send(err);
							} else { 
								// update order will be response
								for (var property in optionsUpdate) {
									if (optionsUpdate.hasOwnProperty(property)) {
										order[property] = optionsUpdate[property];
									}
								}

								console.log('Updated successfully order: ' + order);
								
								res.format({
									html: function() {
										res.location('index');
										res.redirect('/index');
									},
									json: function() {
										res.json(order);
									}
								});
							}
						}); // end of execute updating
					}
				}); // end PUT
			});

router.param('id', function(req, res, next, id) {
	// Validate param 'id' before query
	mongoose.model('order').findById(id, function(err, order) {
		if(err) {
			console.error(id + ' was not found');

			var ierr = new Error('Not Found');
			ierr.status = 404;
			
			res.status(404);
			res.format({
				html: function() {
					next(ierr);
				},
				json: function() {
					res.json({ message: ierr.status + ' ' + ierr });
				}
			});
		} else {
			console.log('Param is ok');
			req.id = id;
			next();
		}
	});
});

router.route('/orders/:id')
			.get(function(req, res, next) {
				// Get order by id
				console.log('Call to GetbyId API');

				mongoose.model('Order').findById(req.id, function(err, order) {
					if(err) {
						console.error('There was the problem getting the information from database: ' + err);
						return next(err);
					} else {
						console.log('Find by id: ' + order._id);
						res.format({
							html: function() {
								res.render('index', order);
							},
							json: function() {
								res.json(order);
							}
						});
					}
				}); // end of GET
			})
			.delete(function(req, res, next) {
				// delete order
				console.log('Call to Delete API');
				
				mongoose.model('Order').findByIdAndRemove(req.id, function(err, order) {
					if(err) {
						console.error('There was the problem removing the information from database: ' + err);
						return next(err);
					} else {
						console.log('Delete successfully!');
						res.format({
							html: function() {
								res.render('index', order);
							},
							json: function() {
								res.json(order);
							}
						});
					}
				}); // end of DELETE
			});

module.exports = router;