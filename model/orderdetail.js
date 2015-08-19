var mongoose = require('mongoose');

var orderDetailSchema = new mongoose.Schema({
	product: { type: Number, ref: 'Product' },
	quantity: Number,
	price: Number,
	coupon: Number,
	//orderitems: [{ type: Schema.Types.ObjectId, ref: 'Product' }] }, //type : Mongoose.Schema.ObjectId
});

mongoose.model('OrderDetail', orderDetailSchema);