var React = require('react');

module.exports = React.createClass({
  getInitialState: function() {
    return ({
      productListData: [],
      productInfo: ''
    });
  },
  componentDidMount: function() {
    $.ajax({
      type: 'GET',
      dataType: 'json',
      url: '/app/products',
      cache: false,
      success: function(data) {
        console.log('Get ProductList success: ' + JSON.stringify(data));
        this.setState({productListData: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('/app/products', status, err.toString());
      }.bind(this)
    });
  },
  addProduct: function(e) {
    e.preventDefault();
    var errorCount = 0;
    $('#addProduct fieldset input').each(function(index, val) {
      if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {
      // If it is, compile all user info into one object
      var newProduct = {
        'category': $('#addProduct fieldset input#inputCategory').val(),
        'productname': $('#addProduct fieldset input#inputProductName').val(),
        'price': $('#addProduct fieldset input#inputPrice').val(),
        'quatity': $('#addProduct fieldset input#inputQuatity').val()
      };

      // Adding newProduct to Server
      $.ajax({
        type: 'POST',
        dataType: 'json',
        url: '/app/products',
        data: newProduct,
        success: function(product) {
          if(!$.isEmptyObject(product)) {
            console.log('Insert to \'/app/products\' success');
            var newProductListData = this.state.productListData.concat(product);
            this.setState({productListData: newProductListData});
          }
        }.bind(this),
        error: function(xhr, status, err) {
          console.error('/app/products', status, err.toString());
        }.bind(this)
      });
      
      // Clear old form data
      $('#addProduct fieldset input').val('');
      return;

    } else {
      // If errorCount is more than 0, error out
      console.error('Please fill in all fields');
      return;
    }
  },
  deleteProduct: function(id, e) {
    e.preventDefault();
    var comfirmination = confirm('Are you sure?');
    if(comfirmination) {
      $.ajax({
        type: 'DELETE',
        dataType: 'json',
        url: '/app/products/' + id,
        success: function(product) {
          if(!$.isEmptyObject(product)) {
            console.log('Delete successfully!');
            this.removeItemData(product);
          } else {
            return;
          }
        }.bind(this)
      });
    }
  },
  removeItemData: function(product) {
    var index = this.state.productListData.map(function(product){
      return product._id;
    }).indexOf(product._id);
    var newProductListData = this.state.productListData;
    newProductListData.splice(index, 1);
    this.setState({productListData: newProductListData});
  },
  showProductInfo: function(index, e) {
    e.preventDefault();
    var prodInfo = this.state.productListData[index];
    this.setState({productInfo: prodInfo});
    console.log(JSON.stringify(prodInfo));
    $('#addProduct fieldset input#inputCategory').val(prodInfo.category);
    $('#addProduct fieldset input#inputProductName').val(prodInfo.productname);
    $('#addProduct fieldset input#inputPrice').val(prodInfo.price);
  },
  updateProduct: function(e) {
    var errorCount = 0;
    $('#addProduct fieldset input').each(function(index, val) {
      if($(this).val() === '') { errorCount++; }
    });
    
    // Check and make sure errorCount's still at <=1
    if(errorCount <= 1) {
      // If it is, compile all user info into one object
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
        url: '/app/products',
        data: updateObj,
        success: function(product) {

          if(!$.isEmptyObject(product)) {
            console.log('Update to \'/app/products\' success');
            
            var index = this.state.productListData.map(function(product){
              return product._id;
            }).indexOf(product._id);
            
            var newProductListData = this.state.productListData;
            newProductListData.splice(index, 1, product);
            this.setState({productListData: newProductListData});
            
            // Clear old form data
            $('#addProduct fieldset input').val('');
            this.setState({productInfo: ''});
          }
        }.bind(this),
        error: function(xhr, status, err) {
          console.error('/app/products', status, err.toString());
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
    console.log(JSON.stringify(this.state.productInfo));
    
    // Clear old form data
    $('#addProduct fieldset input').val('');
    this.setState({productInfo: ''});
  },
  render: function() {
    var formReturn = (
      <div className="form-group col-xs-5 col-sm-5">
        <div id='productList' className="panel panel-default">
          <div className="panel-heading">Product List</div>
          <table className="table menu-items">
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
            {this.state.productListData.map(function(product, index) {
              return (
                <tr rel={index}>
                  <td><a href='#' className='linkShowCategory' rel={product.category}>{product.category}</a></td>
                  <td><a href='#' className='linkShowProduct' onClick={this.showProductInfo.bind(null, index)}>{product.productname}</a></td>
                  <td>{product.price}</td>
                  <td>{product.stock}</td>
                  <td><a href='#' className='linkDeleteProduct' onClick={this.deleteProduct.bind(null, product._id)}>delete</a></td>
                </tr>
              )
            }.bind(this))}
            </tbody>
          </table>
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
            <input id='inputPrice' className="col-xs-6 col-sm-6" type='text' placeholder='price'/>
            <input id='inputQuatity' className="col-xs-6 col-sm-6" type='text' placeholder='quatity'/>
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