var React = require('react');

module.exports = React.createClass({
	propTypes: {
		dataList: React.PropTypes.array,
		onChangeData: React.PropTypes.func
	},
	onChangeData: function(e) {
		e.preventDefault();

		var number = e.target.value;
		this.props.onChangeData(number);
	},
	render: function() {
		return (
			<div className='row'>
				<div className='col-sm-3'>
					<select className="form-control" onChange={this.onChangeData}>
					{
						this.props.dataList.map(function(data) {
							return (<option key={'opt-'+data.key} value={data.key}>{data.value}</option>)
						})
					}
					</select>
				</div>
			</div>
		);
	}
});