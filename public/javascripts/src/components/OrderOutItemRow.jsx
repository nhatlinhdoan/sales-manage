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
			currentCategory: ''
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
				url: '/app/products/cat/' + category,
				cache: false,
				success: function(products) {
					if(!$.isEmptyObject(products)) {
						this.setState({productList: products});
					}
				}.bind(this),
				error: function(xhr, status, err) {
					console.error('/app/products/' + category, status, err.toString());
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
console.log('category '+category);
		if(catIndex > 0) {
			this.getProductByCat(category);
		}
		
		this.setState({currentCategory: category});
	},
	onChangeProduct: function(e) {
		e.preventDefault();

		// Get product's price 
		var product = e.target.value;
		if(typeof product === 'object' && product.price) {
			$('#inputPrice').val(product.price);
		}
		
		// and calculate amount
		var quantity = parseInt($('#inputQuantity').val());
		if (quantity && quantity >= 0) {
			$('#inputAmount').val(quantity * product.price);
		}
	},
	onChangePrice: function(e) {
		e.preventDefault();

		var price = $('#inputPrice').val();

		// Calculate amount
		var quantity = parseInt($('#inputQuantity').val());
		if (quantity && price >= 0) {
			$('#inputAmount').val(quantity * price);
		}

	},
	deleteRow: function(e) {
		e.preventDefault();

		// invoke to callback function
		if(typeof this.props.deleteRow === 'function') {
			this.props.deleteRow(this.props.index);
		}
	},
	render: function() {
		return (
			<tr key={'tr' + this.props.index}>
				<th>{this.props.index + 1}</th>
				<td>
					<select className="form-control" onChange={this.onChangeCategory}>
					{
						this.state.categoryList.map(function(category) {
							return (<option value={category.key}>{category.key}</option>)
						})
					}
					</select>
				</td>
				<td>
					<select className="form-control" onChange={this.onChangeProduct}>
					{
						this.state.productList.map(function(product) {
							return (<option value={product}>{product.productname}</option>)
						})
					}
					</select>
				</td>
				<td><input id='inputQuantity' type='text' placeholder='quatity' onkeypress='return event.charCode >= 48 && event.charCode <= 57'/></td>
				<td><input id='inputPrice' type='text' placeholder='price' onChange={this.onChangePrice} onkeypress='return event.charCode >= 48 && event.charCode <= 57'/></td>
				<td><input id='inputAmount' type='text' placeholder='amount' disabled='true'/></td>
				<td><input id='inputProvider' type='text' placeholder='provider'/></td>
				<td><input id='inputNote' type='text' placeholder='note'/></td>
				<td><a href='#' rel={this.props.index} onClick={this.pullOrderItem}>delete</a></td>
			</tr>
		)
	}
});
