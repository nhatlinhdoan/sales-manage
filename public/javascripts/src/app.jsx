var React = require('react');
var NavTop = require('./NavTop.jsx');
var ProductForm = require('./ProductForm.jsx');

var MyApp = React.createClass({
  render: function() {
	return (
	  <div>
	  	<NavTop />
		<ProductForm />
	  </div>
	);
  }
});

React.render(
  <MyApp />,
  document.getElementById('wrapper')
);