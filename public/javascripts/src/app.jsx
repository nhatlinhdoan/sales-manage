var React = require('react');
var NavTop = require('./NavTop.jsx');
var ProductList = require('./ProductList.jsx');

var MyApp = React.createClass({
  render: function() {
	return (
	  <div>
	  	<NavTop />
		<ProductList />
	  </div>
	);
  }
});

React.render(
  <MyApp />,
  document.getElementById('wrapper')
);