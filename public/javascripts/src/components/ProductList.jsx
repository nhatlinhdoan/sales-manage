var React = require('react');
var ProductRow = require('./../components/ProductRow.jsx');

module.exports = React.createClass({
	render: function() {
		return (
			<div id='productList' className='panel panel-default'>
				<div className='panel-heading'>Product List</div>
				<table className='table table-bordered table-striped menu-items'>
					<thead>
						<tr>
							<th>Category</th>
							<th>Name</th>
							<th>Price</th>
							<th>Stock</th>
							<th>Delete?</th>
						</tr>
					</thead>
					<tbody>
					{
						this.props.productListData.map(function(product, index) {
							return (
								<ProductRow 
									key={'productRow-'+index}
									index={index}
									product={product}
									{...this.props}/>
							);
						}, this)
					}
					</tbody>
				</table>
			</div>
		);
	}
});