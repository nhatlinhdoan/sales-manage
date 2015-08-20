var mongoose = require('mongoose');

var orderItemSchema = new mongoose.Schema({
	productid: String,
	quantity: Number,
	price: Number,
	coupon: Number,
	amount: Number
});

mongoose.model('OrderItem', orderItemSchema);