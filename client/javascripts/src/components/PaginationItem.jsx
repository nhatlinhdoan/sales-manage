var React = require('react');

module.exports = React.createClass({
  render: function() {
  	var pageIndex = this.props.page[0];
    return (
      <li key={'pagination' + pageIndex} className={this.props.currentPage === pageIndex ? 'active' : ''}>
        <a href='' onClick={this.props.moveToPage.bind(null, pageIndex)}>{pageIndex}</a>
      </li>
    );
  }
});