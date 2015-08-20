var React = require('react');
var Layout = require('./Layout');

module.exports = React.createClass({
  render: function() {
    return (
      <Layout title={this.props.title}>
      	<h1>{this.props.message}</h1>
      	<h2>{this.props.error.status}</h2>
      	<pre>#{this.props.error.stack}</pre>
      </Layout>
    );
  }
})