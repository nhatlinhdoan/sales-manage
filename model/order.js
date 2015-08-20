var mongoose = require('mongoose');

var orderSchema = new mongoose.Schema({
	orderstatus: { type: String, default: 'opening' },
	orderdate: { type: Date, default: Date.now },
	orderbillingdate: { type: Date, default: Date.now },
	orderitems: [{type: mongoose.Schema.Types.ObjectId, ref: 'OrderItem'}],
	amount: { type: Number, default: 0 },
	shopname: String,
	customername: String,
	customerphone: String,
	customeraddress: String,
	customernote: String
});

mongoose.model('Order', orderSchema);