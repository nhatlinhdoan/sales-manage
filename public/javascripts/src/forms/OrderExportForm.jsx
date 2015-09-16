var React = require('react');
var InputElm = require('./../components/InputElement.jsx');
var DropDownList = require('./../components/DropDownList.jsx');
var OrderExportItemList = require('./../components/OrderExportItemList.jsx');

module.exports = React.createClass({
	getInitialState: function() {
		return ({
			orderItemList: [],
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
	getOrderStatusList: function() {
		// Define Order status
		var orderStatus = [
			{
				key: 'opening',
				value: 'Opening'
			},
			{
				key: 'processing',
				value: 'Processing'
			},
			{
				key: 'finish',
				value: 'Finish'
			},
			{
				key: 'depending',
				value: 'Depending'
			},
			{
				key: 'fail',
				value: 'Fail'
			}
		];
		return orderStatus;
	},
	componentDidMount: function() {
		$('#inputOrderDate').datetimepicker();
		$('#inputBillingDate').datetimepicker();
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
	pushOrderItem: function(newOrderItem) {
		// Push new orderItem to orderItemList
		var newOrderItemListData = this.state.orderItemList.concat(newOrderItem);
		this.setState({orderItemList: newOrderItemListData});
	},
	pullOrderItem: function(index) {

		// var rowData = that.props.dataRow;
		// var isEmpty = true;

		// var orderItemDefault = this.createNewOrderItem();

		// Check orderItem was remove is exist and not null
		// for(var property in orderItemDefault) {
		// 	if(orderItemDefault.hasOwnProperty(property)) {
		// 		if(rowData[property] !== '' && rowData[property] !== 0) {
		// 			isEmpty = false;
		// 		}
		// 	}
		// }

		// If not null then Confirm remove
		// var comfirmination = !isEmpty ? confirm('Are you sure?') : true;
		
		// If accept remove
		// if(comfirmination) {
			// var index = this.state.orderItemList.indexOf(rowData);
			var newOrderItemList = this.state.orderItemList;
			
			newOrderItemList.splice(index, 1);
			this.setState({orderItemList: newOrderItemList});
			// var node = that.getDOMNode();
			// React.unmountComponentAtNode(node);
			// $(node).remove();
		// }
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
	onChangeStatus: function(status) {
		console.log('onChangeStatus()');
	},
	render: function() {
		var formReturn = (
			<div className='form-group col-xs-12 col-sm-12'>
				<div className='panel panel-default'>
					<div className='panel-heading heading-button'>
						<span>Create new Order</span>
						<button ref='btnAddOrder' className='btn btn-primary col-xs-2 col-sm-2 pull-right' onClick={this.addOrder}>Save</button>
					</div>
					<fieldset>
							<InputElm ref='inputShopName' styleClass='pull-left' title='Shop Name' placeholder='shopname'/>
							<InputElm ref='inputCustomerName' styleClass='pull-right' title='Customer Name' placeholder='customername'/>
							
							<div className='input-group col-xs-6 col-sm-6 pull-left'>
								<span className='input-group-addon w20'>Order Status</span>
								<DropDownList
									dataList={this.getOrderStatusList()}
									onChangeData={this.onChangeStatus}/>
							</div>
							<InputElm ref='inputCustomerPhone' styleClass='pull-right' title='Customer Phone' placeholder='customerphone'/>

							<InputElm ref='inputOrderDate' styleClass='pull-left' title='Order Date' placeholder=''/>
							<InputElm ref='inputCustomerAddress' styleClass='pull-right' title='Customer Address' placeholder='customeraddress'/>

							<InputElm ref='inputBillingDate' styleClass='pull-left' title='Billing Date' placeholder=''/>
							<InputElm ref='inputCustomerNote' styleClass='pull-right' title='Customer Note' placeholder='customernote'/>
					</fieldset>
				</div>

				<OrderExportItemList
					orderItemList={this.state.orderItemList}
					pushOrderItem={this.pushOrderItem}
					pullOrderItem={this.pullOrderItem}/>
				
			</div>
		);

		return formReturn;
	}
});
