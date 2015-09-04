var React = require('react');

module.exports = React.createClass({
	deleteProduct: function(e) {
		e.preventDefault();

		var comfirmination = confirm('Are you sure?');
		
		if(comfirmination) {
			$.ajax({
				type: 'DELETE',
				dataType: 'json',
				url: '/api/products/' + this.props.product._id,
				success: function(product) {
					if(!$.isEmptyObject(product)) {
						console.log('Delete product successfully!');
						this.props.deleteCallback(product._id);
					}
				}.bind(this),
				error: function(xhr, status, err) {
					console.error('/api/products', status, err.toString());
				}
			});
		}
	},
	showProductInfo: function(e) {
		e.preventDefault();
		this.props.showProductInfo(this.props.index);
	},
	render: function() {
		var product = this.props.product;
		return (
			<tr>
				<td><a href='#' rel={product.category}>{product.category}</a></td>
				<td><a href='#' onClick={this.showProductInfo}>{product.productname}</a></td>
				<td className='text-right'>{product.price.toLocaleString('de-DE', { style: 'currency', currency: 'VND' })}</td>
				<td className='text-right'>{product.stock}</td>
				<td><a href='#' onClick={this.deleteProduct}>delete</a></td>
			</tr>
		);
	}
});
