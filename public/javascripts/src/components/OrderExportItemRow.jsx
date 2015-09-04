var React = require('react');

module.exports = React.createClass({
	propTypes: {
		deleteRow: React.PropTypes.func.isRequired
	},
	deleteRow: function(e) {
		e.preventDefault();

		// invoke to parent's function
		this.props.deleteRow(this.props.index);
	},
	render: function() {
		var rowData = this.props.rowData;
		return (
			<tr>
				<td>{this.props.index + 1}</td>
				<td>{rowData.category}</td>
				<td>{rowData.productname}</td>
				<td>{rowData.quantity}</td>
				<td>{rowData.price}</td>
				<td>{rowData.amount}</td>
				<td>{rowData.provider}</td>
				<td>{rowData.note}</td>
				<td><a href='#' onClick={this.deleteRow}>delete</a></td>
			</tr>
		)
	}
});