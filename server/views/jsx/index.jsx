var React = require('react');
var Layout = require('./layout');

module.exports = React.createClass({
  render: function() {
    return (
      <Layout title={this.props.title}>
        <div id="wrapper">
          <UserInfo />
          <UserList userListData={this.props.userListData} />
          <AddUser userListData={this.props.userListData} />
        </div>
      </Layout>
    );
  }
})