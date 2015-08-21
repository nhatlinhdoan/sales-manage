var express = require('express'),
		router = express.Router(),
		mongoose = require('mongoose');

router.get('/', function(req, res, next) {
	res.redirect('/api/orders');
});

router.get('/count', function(req, res, next) {
	// get list order
	mongoose.model('Order').count({}, function(err, total) {
		if(err) {
			return next(err);
		} else {
			res.json(total);
		}
	}); // end of GET
});

router.route('/:skip/:limit')
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

router.route('/')
	.post(function(req, res, next) {
		console.log('Call to Adding new order API');

		// post new order
		var _shopname = req.body.shopname,
			_orderstatus = req.body.orderstatus,
			_orderdate = req.body.orderdate,
			_orderbillingdate = req.body.orderbillingdate,
			_customername = req.body.customername,
			_customerphone = req.body.customerphone,
			_customeraddress = req.body.customeraddress,
			_customernote = req.body.customernote,
			_orderItems = req.body.orderItems;

		console.log('orderItems: ' + JSON.stringify(_orderItems));

		// Validate data at here

		console.log('Calc amount');
		var _amount = 0;
		for(var orderItem in _orderItems) {
			_amount += orderItem.amount;
		}

		console.log('Get Model');
		var Order = mongoose.model('Order');
		var OrderItem = mongoose.model('OrderItem');

		console.log('Create Order object');
		// Create a new order object
		var neworder = new Order({
			orderstatus: _orderstatus,
			orderdate: _orderdate,
			orderbillingdate: _orderbillingdate,
			amount: parseInt(_amount),
			shopname: _shopname,
			customername: _customername,
			customerphone: _customerphone,
			customeraddress: _customeraddress,
			customernote: _customernote
		});

console.log('execute adding to database');
		// execute adding to database
		neworder.save(function(err, order) {

			if(err) { 
				console.error('There was the problem adding the information to the database'); 
				res.send(err);
			} else { 
				console.log('Created successfully new order: ' + order);

				// Adding orderItems to database
				// for(var item in _orderItems) {
console.log('execute adding OrderItem to database');
					var newOrdertem = new OrderItem(_orderItems[0]);
					newOrdertem.order = neworder._id;
					newOrdertem.save();
console.log('adding OrderItem success: ' + item);
				// }

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
	}) // end of POST
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

router.route('/:id')
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