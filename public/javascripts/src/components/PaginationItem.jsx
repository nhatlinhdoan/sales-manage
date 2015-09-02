var React = require('react');

module.exports = React.createClass({
	changeValue: function(e) {
		e.preventDefault();
		this.props.moveToPage(this.props.page[0]);
	},
	remainingClassName: function() {
		return this.props.currentPage === this.props.page[0] ? 'active' : '';
	},
  render: function() {
    return (
      <li className={this.remainingClassName()}>
        <a href='' onClick={this.changeValue}>{this.props.page[0]}</a>
      </li>
    );
  }
});