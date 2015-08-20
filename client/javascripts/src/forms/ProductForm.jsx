var React = require('react');

module.exports = React.createClass({
	getInitialState: function() {
		return ({
			productListData: [],
			productInfo: '',
			currentPage: 1,
			productsPerPage: 5,
			pages: 0,
			links: [],
			pageSizes: [5,10,15,20,25]
		});
	},
	componentDidMount: function() {
		// Get data to create pagination
		this.getTotalPage();

		var limit = this.state.productsPerPage,
				skip  = limit * (this.state.currentPage - 1);

		// Get data list
		this.getProductList(skip, limit);
	},
	getTotalPage: function() {
		// Request get count
		$.ajax({
			type: 'GET',
			dataType: 'json',
			url: '/api/products/count',
			cache: false,
			success: function(total) {
				// Get pages
				var pages = Math.floor(total / this.state.productsPerPage);
				pages += (total % this.state.productsPerPage > 0) ? 1 : 0;

				this.setState({pages: pages});

				// Create pagination
				this.createPagination();

			}.bind(this),
			error: function(xhr, status, err) {
				console.error('/api/products/count', status, err.toString());
			}.bind(this)
		});
	},
	getProductList: function(skip, limit) {
		// Request get products list
		$.ajax({
			type: 'GET',
			dataType: 'json',
			url: '/api/products/' + skip + '/' + limit,
			cache: false,
			success: function(products) {
				this.setState({productListData: products});
			}.bind(this),
			error: function(xhr, status, err) {
				console.error('/api/products', status, err.toString());
			}.bind(this)
		});
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
						// Update product to productListData
						var newProductListData = this.state.productListData.concat(product);
						this.setState({productListData: newProductListData});
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
	deleteProduct: function(id, e) {
		e.preventDefault();

		var comfirmination = confirm('Are you sure?');
		
		if(comfirmination) {
			$.ajax({
				type: 'DELETE',
				dataType: 'json',
				url: '/api/products/' + id,
				success: function(product) {
					if(!$.isEmptyObject(product)) {

						// Get product's index in array productListData
						var index = this.state.productListData.map(function(product){
							return product._id;
						}).indexOf(product._id);

						// Update productListData
						var newProductListData = this.state.productListData;
						newProductListData.splice(index, 1);

						this.setState({productListData: newProductListData});
					
					} else {
						return;
					}
				}.bind(this)
			});
		}
	},
	showProductInfo: function(index, e) {
		e.preventDefault();

		// Get product at index
		var prodInfo = this.state.productListData[index];

		// Adding product to state.productInfo (to show)
		this.setState({productInfo: prodInfo});
		
		// Fill data to input form
		$('#addProduct fieldset input#inputCategory').val(prodInfo.category);
		$('#addProduct fieldset input#inputProductName').val(prodInfo.productname);
		$('#addProduct fieldset input#inputPrice').val(prodInfo.price);
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
				'_id': this.state.productInfo._id,
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
						console.log('Update to \'/api/products\' success');
						
						// Get product's index in array productListData
						var index = this.state.productListData.map(function(product){
							return product._id;
						}).indexOf(product._id);
						
						// Update data to productListData
						var newProductListData = this.state.productListData;
						newProductListData.splice(index, 1, product);
						this.setState({productListData: newProductListData});
						
						// Clear old form data
						$('#addProduct fieldset input').val('');
						this.setState({productInfo: ''});
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
	cancel: function(e) {
		e.preventDefault();

		// Clear old form data
		$('#addProduct fieldset input').val('');
		this.setState({productInfo: ''});
	},
	moveToPage: function(e) {
		e.preventDefault();
		var pageIndex = e.target.rel;

		// Options default
		var limit = this.state.productsPerPage,
				skip  = limit * (pageIndex - 1);

		// Update data list
		this.getProductList(skip, limit);

		this.getTotalPage();

		this.setState({currentPage: pageIndex});	
	},
	changeProductsPerPage: function(e) {
		e.preventDefault();

		var newProductsPerPage = e.target.value;

		// Options default
		var limit = newProductsPerPage,
				skip  = 0;

		// Update data list
		this.getProductList(skip, limit);

		this.setState({productsPerPage: newProductsPerPage});
		this.setState({currentPage: 1});

		this.getTotalPage();
	},
	createPagination: function() {

		var pages = this.state.pages,
				current = this.state.currentPage,
				linksData = [];

		for (var pageIndex = 1; pageIndex <= pages; pageIndex++) {
			if (pageIndex >= 1 && pageIndex <= pages) {
				linksData.push([pageIndex, pageIndex]);
			}
		}

		// leading arrows
		// if (current > 2) {
		// 	linksData.push([1, "<<"]);
		// }
		// if (current > 1) {
		// 	linksData.push([current - 1, "<"]);
		// }

		// for (var pageIndex = current - 2; pageIndex < current + 4; pageIndex++) {
		// 	if (pageIndex >= 1 && pageIndex <= pages) {
		// 		linksData.push([pageIndex, pageIndex]);
		// 	}
		// }

		// // tailing arrows
		// if (current + 1 <= pages) {
		// 	linksData.push([current + 1, ">"]);
		// }
		// if (current + 2 <= pages) {
		// 	linksData.push([pages, ">>"]);
		// }

		this.setState({links: linksData});
	},
	render: function() {
		var formReturn = (
			<div className="form-group col-xs-12 col-sm-6">
				<div id='productList' className="panel panel-default">
					<div className="panel-heading">Product List</div>
					<table className="table table-bordered table-striped menu-items">
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
							this.state.productListData.map(function(product, index) {
								return (
									<tr key={'tr' + index}>
										<td><a href='#' rel={product.category}>{product.category}</a></td>
										<td><a href='#' onClick={this.showProductInfo.bind(null, index)}>{product.productname}</a></td>
										<td>{product.price}</td>
										<td>{product.stock}</td>
										<td><a href='#' onClick={this.deleteProduct.bind(null, product._id)}>delete</a></td>
									</tr>
								)
							}, this)
						}
						</tbody>
					</table>
				</div>
				<div className='row'>
					<div className='col-sm-3'>
						<select className="form-control" onChange={this.changeProductsPerPage}>
						{
							this.state.pageSizes.map(function(size) {
								return (<option key={'size' + size} value={size}>{size}</option>)
							})
						}
						</select>
					</div>
				</div>
				<div>
					<ul className="pagination pagination-centered">
					{
						this.state.links.map(function(link) {
							return (
								<li key={'pagination' + link[0]} className={this.state.currentPage === link[0] ? 'active' : ''}>
									<a href='#' rel={link[0]} onClick={this.moveToPage}>{link[1]}</a>
								</li>
							)
						}, this)
					}
					</ul>
				</div>
				<div id='addProduct' className="panel panel-default">
					<div className="panel-heading">
						{
							this.state.productInfo ? 'Update Product' : 'Add Product'
						}
					</div>
					<fieldset>
						<input id='inputCategory' className="col-xs-6 col-sm-6" type='text' placeholder='category'/>
						<input id='inputProductName' className="col-xs-6 col-sm-6" type='text' placeholder='productname'/>
						<br/>
						<input id='inputPrice' className="col-xs-6 col-sm-6" type='number' placeholder='price'/>
						<input id='inputQuatity' className="col-xs-6 col-sm-6" type='number' placeholder='quatity'/>
						<br/>
						{
							this.state.productInfo ?  
								<button id='btnUpdateProduct' className="btn btn-primary col-xs-6 col-sm-6" onClick={this.updateProduct}>Update</button> 
								:
								<button id='btnAddProduct' className="btn btn-primary col-xs-6 col-sm-6" onClick={this.addProduct}>Add Product</button>
						}
						<button id='btnCancel' className="btn btn-primary col-xs-6 col-sm-6" onClick={this.cancel}>Cancel</button>
					</fieldset>
				</div>
			</div>
		);

		return formReturn;
	}
});