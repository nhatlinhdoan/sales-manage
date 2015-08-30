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
	render: function() {
		console.log('ROW -> render');
		return (
			<tr>
				<td><a href='#' rel={this.props.product.category}>{this.props.product.category}</a></td>
				<td><a href='#' onClick={this.props.showProductInfo.bind(null, this.props.index)}>{this.props.product.productname}</a></td>
				<td>{this.props.product.price}</td>
				<td>{this.props.product.stock}</td>
				<td><a href='#' onClick={this.deleteProduct}>delete</a></td>
			</tr>
		);
	}
});
