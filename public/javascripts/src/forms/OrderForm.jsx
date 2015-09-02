var React = require('react');

module.exports = React.createClass({
  getInitialState: function() {
    return ({
      orderListData: [],
      orderInfo: '',
      currentPage: 1,
      ordersPerPage: 5,
      pages: 0,
      links: [],
      pageSizes: [5,10,15,20,25]
    });
  },
  componentDidMount: function() {
    // Get data to create pagination
    this.getTotalPage();

    var limit = this.state.ordersPerPage,
        skip  = limit * (this.state.currentPage - 1);

    // Get data list
    this.getOrderList(skip, limit);
  },
  getTotalPage: function() {
    // Request get count
    $.ajax({
      type: 'GET',
      dataType: 'json',
      url: '/api/orders/count',
      cache: false,
      success: function(total) {
        // Get pages
        var pages = Math.floor(total / this.state.ordersPerPage);
        pages += (total % this.state.ordersPerPage > 0) ? 1 : 0;

        this.setState({pages: pages});

        // Create pagination
        this.createPagination();

      }.bind(this),
      error: function(xhr, status, err) {
        console.error('/api/orders/count', status, err.toString());
      }.bind(this)
    });
  },
  getOrderList: function(skip, limit) {
    // Request get orders list
    $.ajax({
      type: 'GET',
      dataType: 'json',
      url: '/api/orders/' + skip + '/' + limit,
      cache: false,
      success: function(orders) {
        this.setState({orderListData: orders});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('/api/orders', status, err.toString());
      }.bind(this)
    });
  },
  addOrder: function(e) {
    e.preventDefault();
    var errorCount = 0;

    // Checking data inputs not null
    $('#addOrder fieldset input').each(function(index, val) {
      if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {
      // If it is, compile all order info into one object
      var newOrder = {
        category: $('#addOrder fieldset input#inputCategory').val(),
        productname: $('#addOrder fieldset input#inputProductName').val(),
        price: $('#addOrder fieldset input#inputPrice').val(),
        quatity: $('#addOrder fieldset input#inputQuatity').val()
      };

      // Adding newProduct to Server
      $.ajax({
        type: 'POST',
        dataType: 'json',
        url: '/api/orders',
        data: newOrder,
        success: function(order) {
          if(!$.isEmptyObject(order)) {
            // Update order to orderListData
            var newOrderListData = this.state.orderListData.concat(order);
            this.setState({orderListData: newOrderListData});
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
  deleteProduct: function(id, e) {
    e.preventDefault();

    var comfirmination = confirm('Are you sure?');
    
    if(comfirmination) {
      $.ajax({
        type: 'DELETE',
        dataType: 'json',
        url: '/api/orders/' + id,
        success: function(order) {
          if(!$.isEmptyObject(order)) {

            // Get order's index in array orderListData
            var index = this.state.orderListData.map(function(order){
              return order._id;
            }).indexOf(order._id);

            // Update orderListData
            var newOrderListData = this.state.orderListData;
            newOrderListData.splice(index, 1);

            this.setState({orderListData: newOrderListData});
          
          } else {
            return;
          }
        }.bind(this)
      });
    }
  },
  showorderInfo: function(index, e) {
    e.preventDefault();

    // Get product at index
    var orderInfo = this.state.orderListData[index];

    // Adding product to state.orderInfo (to show)
    this.setState({orderInfo: orderInfo});
    
    // Fill data to input form
    $('#addOrder fieldset input#inputCategory').val(orderInfo.category);
    $('#addOrder fieldset input#inputProductName').val(orderInfo.productname);
    $('#addOrder fieldset input#inputPrice').val(orderInfo.price);
  },
  updateProduct: function(e) {

    var errorCount = 0;

    // Checking data inputs not null
    $('#addOrder fieldset input').each(function(index, val) {
      if($(this).val() === '') { errorCount++; }
    });
    
    // Check and make sure errorCount's still at <=1
    if(errorCount <= 1) {
      // If it is, compile all order info into one object
      var updateObj = {
        '_id': this.state.orderInfo._id,
        'category': $('#addOrder fieldset input#inputCategory').val(),
        'productname': $('#addOrder fieldset input#inputProductName').val(),
        'price': $('#addOrder fieldset input#inputPrice').val()
      };

      // Adding updateObj to Server
      $.ajax({
        type: 'PUT',
        dataType: 'json',
        url: '/api/orders',
        data: updateObj,
        success: function(order) {

          if(!$.isEmptyObject(order)) {
            console.log('Update to \'/api/orders\' success');
            
            // Get order's index in array orderListData
            var index = this.state.orderListData.map(function(order){
              return order._id;
            }).indexOf(order._id);
            
            // Update data to orderListData
            var newOrderListData = this.state.orderListData;
            newOrderListData.splice(index, 1, order);
            this.setState({orderListData: newOrderListData});
            
            // Clear old form data
            $('#addOrder fieldset input').val('');
            this.setState({orderInfo: ''});
          }
        }.bind(this),
        error: function(xhr, status, err) {
          console.error('/api/orders', status, err.toString());
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
    $('#addOrder fieldset input').val('');
    this.setState({orderInfo: ''});
  },
  moveToPage: function(e) {
    e.preventDefault();
    var pageIndex = e.target.rel;

    // Options default
    var limit = this.state.ordersPerPage,
        skip  = limit * (pageIndex - 1);

    // Update data list
    this.getOrderList(skip, limit);

    this.getTotalPage();

    this.setState({currentPage: pageIndex});  
  },
  changeOrdersPerPage: function(e) {
    e.preventDefault();

    var newordersPerPage = e.target.value;

    // Options default
    var limit = newordersPerPage,
        skip  = 0;

    // Update data list
    this.getOrderList(skip, limit);

    this.setState({ordersPerPage: newordersPerPage});
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
                <th>No.</th>
                <th>OrderDate</th>
                <th>ProductName</th>
                <th>Quatity</th>
                <th>Stock</th>
                <th>Price in</th>
                <th>Amount</th>
                <th>Provider</th>
                <th>Note</th>
                <th>Delete?</th>
              </tr>
            </thead>
            <tbody>
            {
              this.state.orderListData.map(function(order, index) {
                return (
                  <tr key={'tr' + index}>
                    <td><a href='#' rel={order.category}>{order.category}</a></td>
                    <td><a href='#' onClick={this.showorderInfo.bind(null, index)}>{order.ordername}</a></td>
                    <td>{order.price}</td>
                    <td>{order.stock}</td>
                    <td>{order.stock}</td>
                    <td>{order.stock}</td>
                    <td>{order.stock}</td>
                    <td>{order.stock}</td>
                    <td>{order.stock}</td>
                    <td><a href='#' onClick={this.deleteOrder.bind(null, order._id)}>delete</a></td>
                  </tr>
                )
              }, this)
            }
            </tbody>
          </table>
        </div>
        <div className='row'>
          <div className='col-sm-3'>
            <select className="form-control" onChange={this.changeOrdersPerPage}>
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
        <div id='addOrder' className="panel panel-default">
          <div className="panel-heading">
            {
              this.state.orderInfo ? 'Update Product' : 'Add Product'
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
              this.state.orderInfo ?  
                <button id='btnUpdateProduct' className="btn btn-primary col-xs-6 col-sm-6" onClick={this.updateProduct}>Update</button> 
                :
                <button id='btnAddOrder' className="btn btn-primary col-xs-6 col-sm-6" onClick={this.addOrder}>Add Product</button>
            }
            <button id='btnCancel' className="btn btn-primary col-xs-6 col-sm-6" onClick={this.cancel}>Cancel</button>
          </fieldset>
        </div>
      </div>
    );

    return formReturn;
  }
});