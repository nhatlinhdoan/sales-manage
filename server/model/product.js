var mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
	category: String,
	productname: String,
	price: { type: Number, default: 0 },
	stock: { type: Number, default: 0 }
});

// productSchema.methods.fn = function (argument) {
// 	// body...
// };

// productSchema.save(function(err) {
// 	if(err) {
// 		console.error();
// 	}
// 	productSchema.save();
// });

mongoose.model('Product', productSchema);