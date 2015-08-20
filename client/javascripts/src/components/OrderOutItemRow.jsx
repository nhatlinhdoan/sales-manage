var React = require('react');

module.exports = React.createClass({
	getInitialState: function() {
		// hard code
		var _categoryList = [
			{ key: '' },
			{ key: 'Ram' },
			{ key: 'CPU' },
			{ key: 'Pan' },
			{ key: 'Mouse' },
			{ key: 'Keyboard' }
		];

		return ({
			categoryList: _categoryList,
			productList: [],
			currentCategory: '',
			currentProduct: ''
		});
	},
	componentDidMount: function() {

	},
	getProductByCat: function(category) {
		// Get products by Category
		if(category) {
			$.ajax({
				type: 'GET',
				dataType: 'json',
				url: '/api/products/cat/' + category,
				cache: false,
				success: function(products) {
					if(!$.isEmptyObject(products)) {
						var newProductList = [{}];
						newProductList = newProductList.concat(products);
						this.setState({productList: newProductList});
					}
				}.bind(this),
				error: function(xhr, status, err) {
					console.error('/api/products/' + category, status, err.toString());
				}.bind(this)
			});
		} else {
			this.setState({productList: []});
		}
	},
	onChangeCategory: function(e) {
		e.preventDefault();

		// check category is exist in categoryList
		var category = e.target.value;
		var catIndex = this.state.categoryList.map(function(cat) {
			return cat.key;
		}).indexOf(category);

		if(catIndex > 0) {
			this.getProductByCat(category);
		}
		
		this.setState({currentCategory: category});
	},
	onChangeProduct: function(e) {
		e.preventDefault();

		// Get product's price 
		var productId = e.target.value;

		var index = this.state.productList.map(function(product) {
			return product._id;
		}).indexOf(productId);

		if(index > -1) {
			$('#inputPrice-' + this.props.index).val(this.state.productList[index].price);
			this.setState({currentProduct: productId});
		}
		
		$('#inputQuantity-' + this.props.index).val(0);

		// and calculate amount
		// var quantity = parseInt($('#inputQuantity-' + this.props.index).val());
		// if (quantity && quantity >= 0) {
		// 	$('#inputAmount-' + this.props.index).val(quantity * product.price);
		// } else {
		// 	$('#inputAmount-' + this.props.index).val(0);
		// }
	},
	onChangePrice: function(e) {
		e.preventDefault();

		var price = $('#inputPrice-' + this.props.index).val();

		// Calculate amount
		var quantity = parseInt($('#inputQuantity-' + this.props.index).val());
		if (quantity >= 0 && price >= 0) {
			$('#inputAmount-' + this.props.index).val(quantity * price);
			var newDataRow = this.props.dataRow.price;
			newDataRow.price = price;
			newDataRow.quantity = quantity;
			newDataRow.amount = quantity * price;
			this.setProps({dataRow: newDataRow});
		}
	},
	deleteRow: function(e) {
		e.preventDefault();

		// invoke to parent's function
		if(typeof this.props.deleteRow === 'function') {
			this.props.deleteRow(this);
		}
	},
	render: function() {
		return (
			<tr>
				<td>{this.props.index + 1}</td>
				<td>
					<select id={'inputCategory-' + this.props.index} className="form-control" onChange={this.onChangeCategory}>
					{
						this.state.categoryList.map(function(category) {
							return (<option value={category.key}>{category.key}</option>)
						})
					}
					</select>
				</td>
				<td>
					<select id={'inputProduct-' + this.props.index} className="form-control" onChange={this.onChangeProduct}>
					{
						this.state.productList.map(function(product) {
							return (<option value={product._id}>{product.productname}</option>)
						})
					}
					</select>
				</td>
				<td><input id={'inputQuantity-' + this.props.index} type='number' placeholder='quatity' onChange={this.onChangePrice}/></td>
				<td><input id={'inputPrice-' + this.props.index} type='number' placeholder='price' onChange={this.onChangePrice}/></td>
				<td><input id={'inputAmount-' + this.props.index} type='text' placeholder='amount' disabled='true'/></td>
				<td><input id={'inputProvider-' + this.props.index} type='text' placeholder='provider'/></td>
				<td><input id={'inputNote-' + this.props.index} type='text' placeholder='note'/></td>
				<td><a href='#' onClick={this.deleteRow}>delete</a></td>
			</tr>
		)
	}
});