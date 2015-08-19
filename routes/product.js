var express = require('express'),
		router = express.Router(),
		mongoose = require('mongoose');

router.get('/', function(req, res, next) {
	res.redirect('/app/products');
});

router.route('/products')
			.get(function(req, res, next) {
				// get list product
				mongoose.model('Product').find({}, function(err, products) {
					if(err) {
						return console.error(err);
					} else {
						res.format({
							html: function() {
								res.render('index', {
									title: 'Show product list',
									data: products
								});
							},
							json: function() {
								console.log('Call to API get Product list');
								console.log(JSON.stringify(products));
								res.json(products);
							}
						});
					}
				}); // end of GET
			})
			.post(function(req, res, next) {
				// post new product
				var _category 		= req.body.category.trim(), 
						_productname 	= req.body.productname.trim(), 
						_price 				= req.body.price, 
						_stock 				= req.body.quatity;

				var Product = mongoose.model('Product');

				// Checking product's information is not conflict
				Product.findOne({
					category : _category, 
					productname : _productname
				}, function(err, product) {

					if (err) {
					
						console.error('There was the problem checking the information before insert to the database'); 
						return next(err);
					
					} else if (product) {
					
						var ierr = new Error('Item was conflict');
						return next(ierr);
					
					} else {
						// Create a new Product object
						var newProduct = new Product({
							category : _category, 
							productname : _productname, 
							price : _price, 
							stock : _stock 
						});

						// execute adding to database
						newProduct.save(function(err, product) {
							if(err) { 

								console.error('There was the problem adding the information to the database'); 
								res.send(err);

							} else { 
								
								console.log('Created successfully new Product: ' + product);
								res.format({
									html: function() {
										res.location('index');
										res.redirect('/index');
									},
									json: function() {
										res.json(product);
									}
								});
							}
						}); // end of execute adding
					}
				}); // end of POST
			})
			.put(function(req, res, next) {
				// update product
				var _id 					= req.body._id,
						_category 		= req.body.category.trim(), 
						_productname 	= req.body.productname.trim(), 
						_price 				= req.body.price;
						// _stock 				= req.body.quatity;

				var Product = mongoose.model('Product');

				// Find product's information was update
				Product.findById(_id, function(err, productUpdate) {
					if (err) {
						console.error('There was the problem getting the information from database: ' + err);
						return next(err);

					} else if (productUpdate) {

						var changes = {
							category : _category, 
							productname : _productname, 
							price : _price
						};

						var optionsUpdate = {};

						// checking fields was update
						for (var property in changes) {
			        if (changes.hasOwnProperty(property) && (productUpdate[property] != changes[property])) {
		          	optionsUpdate[property] = changes[property];
			        }
			      }
						
						// execute updating
						Product.findByIdAndUpdate(_id, optionsUpdate, function(err, product) {
							if(err) { 
								console.error('There was the problem updating the information to the database'); 
								res.send(err);
							} else { 
								// update product will be response
								for (var property in optionsUpdate) {
					        if (optionsUpdate.hasOwnProperty(property)) {
				          	product[property] = optionsUpdate[property];
					        }
					      }

								console.log('Updated successfully Product: ' + product);
								
								res.format({
									html: function() {
										res.location('index');
										res.redirect('/index');
									},
									json: function() {
										res.json(product);
									}
								});
							}
						}); // end of execute updating
					}
				}); // end PUT
			});

router.param('id', function(req, res, next, id) {
	// Validate param 'id' before query
	mongoose.model('Product').findById(id, function(err, product) {
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

router.route('/products/:id')
			.get(function(req, res, next) {
				// Get product by id
				console.log('Call to GetbyId API');

				mongoose.model('Product').findById(req.id, function(err, product) {
					if(err) {
						console.error('There was the problem getting the information from database: ' + err);
						return next(err);
					} else {
						console.log('Find by id: ' + product._id);
						res.format({
							html: function() {
								res.render('index', product);
							},
							json: function() {
								res.json(product);
							}
						});
					}
				}); // end of GET
			})
			.delete(function(req, res, next) {
				// delete product
				console.log('Call to Delete API');
				
				mongoose.model('Product').findByIdAndRemove(req.id, function(err, product) {
					if(err) {
						console.error('There was the problem removing the information from database: ' + err);
						return next(err);
					} else {
						console.log('Delete successfully!');
						res.format({
							html: function() {
								res.render('index', product);
							},
							json: function() {
								res.json(product);
							}
						});
					}
				}); // end of DELETE
			});

module.exports = router;