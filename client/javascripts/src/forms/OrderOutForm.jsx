var React = require('react');
var OrderOutItemRow = require('./../components/OrderOutItemRow.jsx');

module.exports = React.createClass({
	getInitialState: function() {

		// Define Order status
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
			orderStatusList: orderStatus,
			currentOrder: {
				orderstatus: 'opening',
				orderdate: new Date().toISOString(),
				orderbillingdate: new Date().toISOString(),
				amount: 0,
				shopname: '',
				customername: '',
				customerphone: '',
				customeraddress: '',
				customernote: ''
			}
		});
	},
	componentDidMount: function() {
		$('#inputOrderDate').datetimepicker();
		$('#inputBillingDate').datetimepicker();
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

		var newOrderItem = this.createNewOrderItem();

		// Push new orderItem to orderItemList
		var newOrderItemListData = this.state.orderItemList.concat(newOrderItem);
		this.setState({orderItemList: newOrderItemListData});
	},
	pullOrderItem: function(that) {

		var rowData = that.props.dataRow;
		var isEmpty = true;

		var orderItemDefault = this.createNewOrderItem();

		// Check orderItem was remove is exist and not null
		for(var property in orderItemDefault) {
			if(orderItemDefault.hasOwnProperty(property)) {
				if(rowData[property] !== '' && rowData[property] !== 0) {
					isEmpty = false;
				}
			}
		}

		// If not null then Confirm remove
		var comfirmination = !isEmpty ? confirm('Are you sure?') : true;
		
		// If accept remove
		if(comfirmination) {

			var index = this.state.orderItemList.indexOf(rowData);
			var newOrderItemList = this.state.orderItemList;
			
			newOrderItemList.splice(index, 1);
			this.setState({orderItemList: newOrderItemList});
			// var node = that.getDOMNode();
			// React.unmountComponentAtNode(node);
			// $(node).remove();

		}
	},
	addOrder: function(e) {
		e.preventDefault();

		var _shopname = $('#addOrderInfo fieldset input#inputShopName').val(),
			_orderstatus = $('#addOrderInfo fieldset input#inputOrderStatus').val(),
			_orderdate = $('#addOrderInfo fieldset input#inputOrderDate').data("DateTimePicker").date(),
			_orderbillingdate = $('#addOrderInfo fieldset input#inputBillingDate').data("DateTimePicker").date(),
			_customername = $('#addOrderInfo fieldset input#inputCustomerName').val(),
			_customerphone = $('#addOrderInfo fieldset input#inputCustomerPhone').val(),
			_customeraddress = $('#addOrderInfo fieldset input#inputCustomerAddress').val(),
			_customernote = $('#addOrderInfo fieldset input#inputCustomerNote').val();

			_orderdate = _orderdate === null ? new Date() : _orderdate;
			_orderbillingdate = _orderbillingdate === null ? new Date() : _orderbillingdate;

		// Checking data inputs not null
		var errorCount = 0;
		if(_shopname === '') { errorCount++; }
		if(_customername === '') { errorCount++; }
		if(_customerphone === '') { errorCount++; }
		
		var _orderItem = {
			productid: '55d2bff6729e098a568b624e',
			quantity: 5,
			price: 550000,
			coupon: 0,
			amount: 2750000
		};

		// Check and make sure errorCount's still at zero
		if(errorCount === 0) {
			// If it is, compile all order info into one object
			var newOrder = {
				shopname: _shopname,
				orderstatus: _orderstatus,
				orderdate: _orderdate.toISOString(),
				orderbillingdate: _orderbillingdate.toISOString(),
				customername: _customername,
				customerphone: _customerphone,
				customeraddress: _customeraddress,
				customernote: _customernote,
				orderItems: [_orderItem]
			};

			console.log('addOrder() ' + JSON.stringify(newOrder));
			
			// Adding newOrder to Server
			$.ajax({
				type: 'POST',
				dataType: 'json',
				url: '/api/orders',
				data: newOrder,
				success: function(order) {
					if(!$.isEmptyObject(order)) {
						// Update order to orderItemList
						// var newOrderItemListData = this.state.orderItemList.concat(order);
						// this.setState({orderItemList: newOrderItemListData});
						console.log('Yeahhhh create success');
					}
				}.bind(this),
				error: function(xhr, status, err) {
					console.error('/api/orders', status, err.toString());
				}.bind(this)
			});
			
			// Clear old form data
			// $('#addOrder fieldset input').val('');

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
								<th>Price out</th>
								<th>Amount</th>
								<th>Provider</th>
								<th>Note</th>
								<th>Delete?</th>
							</tr>
						</thead>
						<tbody>
						{
							this.state.orderItemList.map(function(orderItem, index) {
								return (<OrderOutItemRow key={'row-' + index} index={index} dataRowList={this.state.orderItemList} dataRow={orderItem} deleteRow={this.pullOrderItem}/>)
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