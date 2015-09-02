var React = require('react');
var ProductList = require('./../components/ProductList.jsx');
var ProductAdding = require('./../components/ProductAdding.jsx');
var Pagination = require('./../components/Pagination.jsx');
var DropDownList = require('./../components/DropDownList.jsx');

module.exports = React.createClass({
	getInitialState: function() {
		return ({
			productListData: [],
			pages: [],
			currentPage: 1,
			productsPerPage: 5,
			productInfo: ''
		});
	},
	componentWillMount: function() {
		// preparing query
		var limit = this.state.productsPerPage,
				skip  = limit * (this.state.currentPage - 1);

		// Get data list
		this.getProductList(skip, limit);

		// Create pagination
		this.createPagination();
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
	createPagination: function() {
		// Get data to create pagination
		var pages = this.getTotalPage();

		var current = this.state.currentPage,
				pagesData = [];

		for (var pageIndex = 1; pageIndex <= pages; pageIndex++) {
			if (pageIndex >= 1 && pageIndex <= pages) {
				pagesData.push([pageIndex, pageIndex]);
			}
		}

		// leading arrows
		// if (current > 2) {
		// 	pagesData.push([1, "<<"]);
		// }
		// if (current > 1) {
		// 	pagesData.push([current - 1, "<"]);
		// }

		// for (var pageIndex = current - 2; pageIndex < current + 4; pageIndex++) {
		// 	if (pageIndex >= 1 && pageIndex <= pages) {
		// 		pagesData.push([pageIndex, pageIndex]);
		// 	}
		// }

		// // tailing arrows
		// if (current + 1 <= pages) {
		// 	pagesData.push([current + 1, ">"]);
		// }
		// if (current + 2 <= pages) {
		// 	pagesData.push([pages, ">>"]);
		// }

		this.setState({pages: pagesData});
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
				return pages;
			}.bind(this),
			error: function(xhr, status, err) {
				console.error('/api/products/count', status, err.toString());
			}.bind(this)
		});
	},
	changeProductsPerPage: function(number) {
		// Options default
		var limit = number,
				skip  = 0;

		// Update data list
		this.getProductList(skip, limit);

		this.setState({productsPerPage: number});
		this.setState({currentPage: 1});

		this.createPagination();
	},
	changeProductInfo: function(index) {
		// Get product at index
		var prodInfo = this.state.productListData[index];

		// Change state.productInfo by prodInfo
		this.setState({productInfo: prodInfo});
	},
	cancel: function() {
		// reset productInfo
		this.setState({productInfo: ''});
	},
	addProductToList: function(product) {
		if(!$.isEmptyObject(product)) {
			// Update product to productListData
			var newProductListData = this.state.productListData.concat(product);
			this.setState({productListData: newProductListData});
		}
	},
	updateProductToList: function(product) {
		if(!$.isEmptyObject(product)) {
			// Get product's index in array productListData
			var index = this.state.productListData.map(function(product){
				return product._id;
			}).indexOf(product._id);
			
			// Update data to productListData
			var newProductListData = this.state.productListData;
			newProductListData.splice(index, 1, product);

			this.setState({productListData: newProductListData});
			this.setState({productInfo: ''});
		}
	},
	removeProductFromList: function(id) {
		if(id !== '') {
			// Get product's index in array productListData
			var index = this.state.productListData.map(function(product){
				return product._id;
			}).indexOf(id);

			// Update productListData
			var newProductListData = this.state.productListData;
			newProductListData.splice(index, 1);

			this.setState({productListData: newProductListData});
		}
	},
	moveToPage: function(pageIndex) {
		// Options default
		var limit = this.state.productsPerPage,
				skip  = limit * (pageIndex - 1);

		// Update data list
		this.getProductList(skip, limit);
		this.createPagination();
		this.setState({currentPage: pageIndex});	
	},
	render: function() {
		var pageSizes = [
			{ key: 5, value: 5 },
			{ key: 10, value: 10 },
			{ key: 15, value: 15 },
			{ key: 20, value: 20 },
			{ key: 25, value: 25 }
		];
		var formReturn = (
			<div className="form-group col-xs-12 col-sm-6">

				<ProductList 
					productListData={this.state.productListData}
					showProductInfo={this.changeProductInfo}
					deleteCallback={this.removeProductFromList}/>

				<DropDownList 
					dataList={pageSizes} 
					onChangeData={this.changeProductsPerPage}/>
				
				<Pagination 
					pages={this.state.pages} 
					currentPage={this.state.currentPage} 
					moveToPage={this.moveToPage}/>

				<ProductAdding 
					productInfo={this.state.productInfo} 
					updateCallback={this.updateProductToList}
					addCallback={this.addProductToList}
					cancel={this.cancel}/>

			</div>
		);

		return formReturn;
	}
});