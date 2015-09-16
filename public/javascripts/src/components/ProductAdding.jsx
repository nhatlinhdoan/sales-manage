var React = require('react/addons');
var InputElm = require('./../components/InputElement.jsx');
var DropDownList = require('./../components/DropDownList.jsx');

module.exports = React.createClass({
	mixins: [React.addons.LinkedStateMixin],
	getInitialState: function() {
		return {
			category: '',
			productname: '',
			price: 0,
			quatity: 0
		};
	},
	componentWillReceiveProps: function(nextProps) {
		if(nextProps.productInfo !== '' && nextProps.productInfo !== this.props.productInfo) {
			console.log('componentWillReceiveProps');
			// Fill data to input form
			var updateState = {
				category: nextProps.productInfo.category,
				productname: nextProps.productInfo.productname,
				price: nextProps.productInfo.price
			};
			this.setState(updateState);
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
				'category': this.state.category,
				'productname': this.state.productname,
				'price': this.state.price,
				'quatity': this.state.quatity
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
				'category': this.state.category,
				'productname': this.state.productname,
				'price': this.state.price
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
		e.preventDefault();

		// Clear old form data
		$('#addProduct fieldset input').val('');

		this.props.cancel();
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
	onChangeCategory: function(category) {
		// change value
		this.setState({category: category});
	},
	render: function() {
		return (
			<div id='addProduct' className="panel panel-default">
				<div className="panel-heading">
					{ this.props.productInfo === '' ? 'Add Product' : 'Update Product' }
				</div>
				<fieldset>
					<div className='input-group col-xs-6 col-sm-6 pull-left'>
						<span className='input-group-addon w20'>Category</span>
						<DropDownList ref='inputCategory' 
							value={this.state.category}
							dataList={this.getCategoryList()}
							onChangeData={this.onChangeCategory}/>
					</div>
					<InputElm ref='inputProductName' title='Product name' 
							styleClass='pull-right' placeholder='Product name' 
							valueLink={this.linkState('productname')}/>
					<InputElm ref='inputPrice' title='Price' type='number' 
							styleClass='pull-left' placeholder='Price' 
							valueLink={this.linkState('price')}/>
					<InputElm ref='inputQuatity' title='Quatity' type='number' 
							styleClass='pull-right' placeholder='Quatity' 
							valueLink={this.linkState('quatity')}/>
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