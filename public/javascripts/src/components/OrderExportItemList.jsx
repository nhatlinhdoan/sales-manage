var React = require('react');
var DropDownList = require('./../components/DropDownList.jsx');
var OrderExportItemRow = require('./../components/OrderExportItemRow.jsx');

module.exports = React.createClass({
	getInitialState: function() {
		return ({
			productList: [],
			orderItem: {
				productid: '',
				quantity: 0,
				price: 0,
				coupon: 0,
				amount: 0
			}
		})
	},
	createNewOrderItem: function() {
		// Define structure orderItem
		var _orderItemDefault = {
			productid: '',
			quantity: 0,
			price: 0,
			coupon: 0,
			amount: 0
		};
		return _orderItemDefault;
	},
	getCategoryList: function() {
		// hard code
		var _categoryList = [
			{ key: '', value: '--- Choose ---' },
			{ key: 'Ram', value: 'Ram' },
			{ key: 'CPU', value: 'CPU' },
			{ key: 'Pan', value: 'Pan' },
			{ key: 'Mouse', value: 'Mouse' },
			{ key: 'Keyboard', value: 'Keyboard' }
		];
		return _categoryList;
	},
	getProductsByCat: function(category) {
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
			return [{}];
		}
	},
	onChangeCategory: function(category) {
		// update productList
		this.getProductsByCat(category);
	},
	onChangeProduct: function(productId) {
		var index = this.state.productList.map(function(product) {
			return product._id;
		}).indexOf(productId);

		if(index > -1) {
			React.findDOMNode(this.refs.inputPrice).value = this.state.productList[index].price;
		}
		
		// React.findDOMNode(this.refs['inputQuantity']).value = 0;

		// and calculate amount
		var quantity = parseInt(React.findDOMNode(this.refs.inputQuantity).value);
		if (quantity && quantity >= 0) {
			React.findDOMNode(this.refs.inputAmount).value = quantity * product.price;
		} else {
			React.findDOMNode(this.refs.inputAmount).value = 0;
		}
	},
	onChangePrice: function(e) {
		e.preventDefault();

		var price = React.findDOMNode(this.refs.inputPrice).value;

		// Calculate amount
		var quantity = parseInt(React.findDOMNode(this.refs.inputQuantity).value);
		if (quantity >= 0 && price >= 0) {
			React.findDOMNode(this.refs.inputAmount).value = quantity * price;
		}
	},
	pushOrderItem: function(e) {
		e.preventDefault();

		// Push new orderItem to orderItemList
		var newOrderItem = this.createNewOrderItem();
		this.props.pushOrderItem(newOrderItem);
	},
	render: function() {
		return (
			<div id='newOrderItemList' className='panel panel-default'>
				<div className='panel-heading'>Add new OrderItem</div>
				<table className='table table-bordered table-striped menu-items'>
					<thead>
						<tr>
							<th>No.</th>
							<th>Category</th>
							<th>Product</th>
							<th>Quatity</th>
							<th>Price out</th>
							<th>Amount</th>
							<th>Provider</th>
							<th>Note</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{this.props.orderItemList.map(function(orderItem, index) {
							return (
								<OrderExportItemRow 
									key={'orderItemRow-' + index} 
									index={index} 
									rowData={orderItem}
									deleteRow={this.props.pullOrderItem}/>
						)}, this)}
						<tr>
							<td></td>
							<td>
								<DropDownList
									dataList={this.getCategoryList()}
									onChangeData={this.onChangeCategory}/>
							</td>
							<td>
								<DropDownList
									dataList={this.state.productList}
									onChangeData={this.onChangeProduct}
									_key='_id' _value='productname'/>
							</td>
							<td><input type='number' className='form-control' ref='inputQuantity' placeholder='quatity' onChange={this.onChangePrice}/></td>
							<td><input type='number' className='form-control' ref='inputPrice' placeholder='price' onChange={this.onChangePrice}/></td>
							<td><span className='form-control' ref='inputAmount'>0</span></td>
							<td><input type='text' className='form-control' ref='inputProvider' placeholder='provider'/></td>
							<td><input type='text' className='form-control' ref='inputNote' placeholder='note'/></td>
							<td><button ref='btnPushOrderItem' className='btn btn-primary col-xs-12 col-sm-12' onClick={this.pushOrderItem}>Add</button></td>
						</tr>
					</tbody>
				</table>
			</div>
		)
	}
});