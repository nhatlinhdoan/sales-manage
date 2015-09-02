var React = require('react');
var PaginationItem = require('./../components/PaginationItem.jsx');

module.exports = React.createClass({
	render: function() {
		return (
			<div>
				<ul className="pagination pagination-centered">
				{
					this.props.pages.map(function(page, index) {
						return (
							<PaginationItem 
								key={'page-'+index} 
								page={page} 
								currentPage={this.props.currentPage} 
								moveToPage={this.props.moveToPage}/>
						)
					}, this)
				}
				</ul>
			</div>
		);
	}
});