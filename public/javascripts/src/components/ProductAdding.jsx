var React = require('react');

module.exports = React.createClass({
	shouldComponentUpdate: function(nextProps, nextState) {
	  return nextProps.productInfo !== this.props.productInfo;
	},
	componentDidUpdate: function() {
		if(this.props.productInfo !== '') {
			// Fill data to input form
			$('#addProduct fieldset input#inputCategory').val(this.props.productInfo.category);
			$('#addProduct fieldset input#inputProductName').val(this.props.productInfo.productname);
			$('#addProduct fieldset input#inputPrice').val(this.props.productInfo.price);
		}
	},
	addProduct: function(e) {
		e.preventDefault();
		var errorCount = 0;

		// Checking data inputs not null
		$('#addProduct fieldset input').each(function(index, val) {
			if($(this).val() === '') { errorCount++; }
		});

		// Check and make sure errorCount's still at zero
		if(errorCount === 0) {
			// If it is, compile all product info into one object
			var newProduct = {
				category: $('#addProduct fieldset input#inputCategory').val(),
				productname: $('#addProduct fieldset input#inputProductName').val(),
				price: $('#addProduct fieldset input#inputPrice').val(),
				quatity: $('#addProduct fieldset input#inputQuatity').val()
			};

			// Adding newProduct to Server
			$.ajax({
				type: 'POST',
				dataType: 'json',
				url: '/api/products',
				data: newProduct,
				success: function(product) {
					if(!$.isEmptyObject(product)) {
						console.log('Add new product successfully!');
						this.props.addCallback(product);
					}
				}.bind(this),
				error: function(xhr, status, err) {
					console.error('/api/products', status, err.toString());
				}.bind(this)
			});
			
			// Clear old form data
			$('#addProduct fieldset input').val('');

		} else {
			// If errorCount is more than 0, error out
			console.error('Please fill in all fields');
		}
	},
	updateProduct: function(e) {

		var errorCount = 0;

		// Checking data inputs not null
		$('#addProduct fieldset input').each(function(index, val) {
			if($(this).val() === '') { errorCount++; }
		});
		
		// Check and make sure errorCount's still at <=1
		if(errorCount <= 1) {
			// If it is, compile all product info into one object
			var updateObj = {
				'_id': this.props.productInfo._id,
				'category': $('#addProduct fieldset input#inputCategory').val(),
				'productname': $('#addProduct fieldset input#inputProductName').val(),
				'price': $('#addProduct fieldset input#inputPrice').val()
			};

			// Adding updateObj to Server
			$.ajax({
				type: 'PUT',
				dataType: 'json',
				url: '/api/products',
				data: updateObj,
				success: function(product) {
					if(!$.isEmptyObject(product)) {
						console.log('Update product successfully!');

						// Clear old form data
						$('#addProduct fieldset input').val('');
						
						this.props.updateCallback(product);
					}
				}.bind(this),
				error: function(xhr, status, err) {
					console.error('/api/products', status, err.toString());
				}
			});
			
		} else {
			// If errorCount is more than 1, error out
			console.error('Please fill in all fields');
			return;
		}
	},
	onCancel: function(e) {
		// Clear old form data
		$('#addProduct fieldset input').val('');

		this.props.cancel(e);
	},
	render: function() {
		console.log('ADDING -> render');
		return (
			<div id='addProduct' className="panel panel-default">
				<div className="panel-heading">
					{ this.props.productInfo === '' ? 'Add Product' : 'Update Product' }
				</div>
				<fieldset>
					<input id='inputCategory' className="col-xs-6 col-sm-6" type='text' placeholder='category'/>
					<input id='inputProductName' className="col-xs-6 col-sm-6" type='text' placeholder='productname'/>
					<br/>
					<input id='inputPrice' className="col-xs-6 col-sm-6" type='number' placeholder='price'/>
					<input id='inputQuatity' className="col-xs-6 col-sm-6" type='number' placeholder='quatity'/>
					<br/>
					{
						this.props.productInfo ?  
							<button id='btnUpdateProduct' className="btn btn-primary col-xs-6 col-sm-6" onClick={this.updateProduct}>Update</button> 
							:
							<button id='btnAddProduct' className="btn btn-primary col-xs-6 col-sm-6" onClick={this.addProduct}>Add Product</button>
					}
					<button id='btnCancel' className="btn btn-primary col-xs-6 col-sm-6" onClick={this.onCancel}>Cancel</button>
				</fieldset>
			</div>
		);
	}
});