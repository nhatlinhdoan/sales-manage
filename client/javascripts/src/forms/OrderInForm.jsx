var React = require('react');

module.exports = React.createClass({
	getInitialState: function() {
		// Define structure orderItem
		var _orderItemDefault = {
			productid: '',
			quantity: 0,
			price: 0,
			coupon: 0,
			amount: 0
		};

		var orderStatus = [
			{
				key: 'opening',
				content: 'Opening'
			},
			{
				key: 'processing',
				content: 'Processing'
			},
			{
				key: 'finish',
				content: 'Finish'
			},
			{
				key: 'depending',
				content: 'Depending'
			},
			{
				key: 'fail',
				content: 'Fail'
			}
		];

		return ({
			orderItemList: [],
			orderItemDefault: _orderItemDefault,
			orderStatusList: orderStatus,
			currentOrder: {}
		});
	},
	componentDidMount: function() {
		$('#inputOrderDate').datetimepicker();
		$('#inputBillingDate').datetimepicker();
		// Get date datetimepicker
		// $('#datetimepicker').data("DateTimePicker").FUNCTION()
	},
	getProductList: function() {
		// Request get orders list
		$.ajax({
			type: 'GET',
			dataType: 'json',
			url: '/api/products',
			cache: false,
			success: function(orders) {
				this.setState({orderItemList: orders});
			}.bind(this),
			error: function(xhr, status, err) {
				console.error('/api/orders', status, err.toString());
			}.bind(this)
		});
	},
	pushOrderItem: function(e) {
		e.preventDefault();

		var newOrderItem = {};

		for(var property in this.state.orderItemDefault) {
			if(this.state.orderItemDefault.hasOwnProperty(property)) {
				newOrderItem[property] = this.state.orderItemDefault[property];
			}
		}

		// Push new orderItem to orderItemList
		var newOrderItemListData = this.state.orderItemList.concat(newOrderItem);
		this.setState({orderItemList: newOrderItemListData});
	},
	pullOrderItem: function(e) {
		e.preventDefault();

		// Check orderItem was remove is exist and not null
		var index = e.target.rel;
		var itemCheck = this.state.orderItemList[index];
		var isEmpty = true;

		if(itemCheck) {
			for(var property in this.state.orderItemDefault) {
				if(this.state.orderItemDefault.hasOwnProperty(property)) {
					if(itemCheck[property] !== '' && itemCheck[property] !== 0) {
						isEmpty = false;
					}
				}
			}
		} else {
			isEmpty = false;
		}

		// If not null then Confirm remove
		var comfirmination = !isEmpty ? confirm('Are you sure?') : true;
		
		// If accept remove
		if(comfirmination) {
			var newOrderItemList = this.state.orderItemList;
			newOrderItemList.splice(index, 1);
			console.log('index: '+index);
			console.log(''+JSON.stringify(newOrderItemList));
			this.setState({orderItemList: newOrderItemList});
		}
	},
	addOrder: function(e) {
		e.preventDefault();

		// Checking data inputs not null
		$('#addOrderInfo fieldset input').each(function(index, val) {
			if($(this).val() === '') { errorCount++; }
		});

		// Check and make sure errorCount's still at zero
		if(errorCount === 0) {
			// If it is, compile all order info into one object
			var newOrder = {
				category: $('#addOrderInfo fieldset input#inputCategory').val(),
				productname: $('#addOrderInfo fieldset input#inputProductName').val(),
				price: $('#addOrderInfo fieldset input#inputPrice').val(),
				quatity: $('#addOrderInfo fieldset input#inputQuatity').val()
			};

			// Adding newOrder to Server
			$.ajax({
				type: 'POST',
				dataType: 'json',
				url: '/api/orders',
				data: newOrder,
				success: function(order) {
					if(!$.isEmptyObject(order)) {
						// Update order to orderItemList
						var newOrderItemListData = this.state.orderItemList.concat(order);
						this.setState({orderItemList: newOrderItemListData});
					}
				}.bind(this),
				error: function(xhr, status, err) {
					console.error('/api/orders', status, err.toString());
				}.bind(this)
			});
			
			// Clear old form data
			$('#addOrder fieldset input').val('');

		} else {
			// If errorCount is more than 0, error out
			console.error('Please fill in all fields');
		}
	},
	render: function() {
		var formReturn = (
			<div className='form-group col-xs-12 col-sm-12'>
				<div id='addOrderInfo' className='panel panel-default'>
					<div className='panel-heading'>Create new Order</div>
					<fieldset>
						<div className='row col-xs-6 col-sm-6'>
			        <div className='input-group col-xs-12 col-sm-12'>
							  <span className='input-group-addon'>Shop Name</span>
							  <input id='inputShopName' className='form-control' type='text' placeholder='shopname'/>
							</div>
			        <div className='input-group col-xs-12 col-sm-12'>
							  <span className='input-group-addon'>Order Status</span>
							  <select id='inputOrderStatus' className="form-control">
								{
									this.state.orderStatusList.map(function(orderStatus) {
										return (<option key={'orderStatus-' + orderStatus.key} value={orderStatus.key}>{orderStatus.content}</option>)
									})
								}
								</select>
							</div>
						</div>

						<div className='row col-xs-6 col-sm-6'>
			        <div className='input-group col-xs-12 col-sm-12'>
							  <span className='input-group-addon'>Customer Name</span>
							  <input id='inputCustomerName' className='form-control' type='text' placeholder='customername'/>
							</div>
			        <div className='input-group col-xs-12 col-sm-12'>
							  <span className='input-group-addon'>Customer Phone</span>
							  <input id='inputCustomerPhone' className='form-control' type='text' placeholder='customerphone'/>
							</div>
						</div>

						<div className='row col-xs-6 col-sm-6'>
			        <div className='input-group col-xs-12 col-sm-12'>
							  <span className='input-group-addon'>Order Date</span>
								<input id='inputOrderDate' className="form-control" type="text" />
							</div>
			        <div className='input-group col-xs-12 col-sm-12'>
							  <span className='input-group-addon'>Billing Date</span>
							  <input id='inputBillingDate' className='form-control' type='text' />
							</div>
						</div>

						<div className='row col-xs-6 col-sm-6'>
			        <div className='input-group col-xs-12 col-sm-12'>
							  <span className='input-group-addon'>Customer Address</span>
							  <input id='inputCustomerAddress' className='form-control' type='text' placeholder='customeraddress'/>
							</div>
			        <div className='input-group col-xs-12 col-sm-12'>
							  <span className='input-group-addon'>Customer Note</span>
							  <input id='inputCustomerNote' className='form-control' type='text' placeholder='customernote'/>
							</div>
						</div>
						
					</fieldset>
				</div>
				<div id='newOrderItemList' className='panel panel-default'>
					<div className='panel-heading'>Add new OrderItem</div>
					<table className='table table-bordered table-striped menu-items'>
						<thead>
							<tr>
								<th>No.</th>
								<th>Category</th>
								<th>Product</th>
								<th>Quatity</th>
								<th>Price in</th>
								<th>Amount</th>
								<th>Provider</th>
								<th>Note</th>
								<th>Delete?</th>
							</tr>
						</thead>
						<tbody>
						{
							this.state.orderItemList.map(function(order, index) {
								return (
									<tr key={'tr' + index}>
										<th>{index + 1}</th>
										<td><a href='#' rel={index}>Get category</a></td>
										<td><a href='#' >Get product from category</a></td>
										<td><input type='text' placeholder='quatity'/></td>
										<td>Get product.price</td>
										<td>Calc amount</td>
										<td><input type='text' placeholder='provider'/></td>
										<td><input type='text' placeholder='note'/></td>
										<td><a href='#' rel={index} onClick={this.pullOrderItem}>delete</a></td>
									</tr>
								)
							}, this)
						}
						</tbody>
					</table>
					<button id='btnPushOrderItem' className='btn btn-primary col-xs-12 col-sm-12' onClick={this.pushOrderItem}>Add Order Item</button>
				</div>
				<div id='addOrder' className='panel panel-default'>
					<button id='btnAddOrder' className='btn btn-primary col-xs-6 col-sm-6' onClick={this.addOrder}>Save</button>
				</div>
			</div>
		);

		return formReturn;
	}
});