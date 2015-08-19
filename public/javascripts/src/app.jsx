var React = require('react');
var ProductList = require('./ProductList.jsx');

var MyApp = React.createClass({
  render: function() {
    return (
      <div>
        <ProductList />
      </div>
    );
  }
});

React.render(
  <MyApp />,
  document.getElementById('wrapper')
);