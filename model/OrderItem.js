var mongoose = require('mongoose');

var orderItemSchema = new mongoose.Schema({
	productid: String,
	quantity: Number,
	price: Number,
	coupon: Number,
	amount: Number,
	order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' }
});

mongoose.model('OrderItem', orderItemSchema);