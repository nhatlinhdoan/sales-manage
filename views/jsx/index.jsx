var React = require('react');
var Layout = require('./Layout');

module.exports = React.createClass({
  render: function() {
    return (
      <Layout title={this.props.title}>
        <div id="wrapper">
        </div>
      </Layout>
    );
  }
})