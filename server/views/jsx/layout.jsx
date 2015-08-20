var React = require('react');

var Layout = React.createClass({
	render: function() {
		return (
			<html>
				<head>
					<title>{this.props.title}</title>
					<link rel='stylesheet' href='/stylesheets/style.css'/>
    				<link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css'/>
    				<link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap-theme.min.css'/>
				</head>
				<body>
					{this.props.children}
					<script src='http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js'/>
				</body>
			</html>
		);
	}
});

module.exports = Layout;