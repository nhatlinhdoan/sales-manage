var React = require('react');

module.exports = React.createClass({
	render: function() {
		return (
			<div className='row'>
				<div className='col-sm-3'>
					<select className="form-control" onChange={this.props.onChangeData}>
					{
						this.props.dataList.map(function(data) {
							return (<option key={'opt-' + data} value={data}>{data}</option>)
						})
					}
					</select>
				</div>
			</div>
		);
	}
});