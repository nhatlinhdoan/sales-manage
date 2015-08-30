var React = require('react');

var Layout = React.createClass({
	render: function() {
		return (
			<html>
				<head>
					<title>{this.props.title}</title>
					<meta charset='utf-8'/>
					<meta name='description' content=''/>
					<meta name='viewport', content='width=device-width, initial-scale=1.0'/>
					<link rel='stylesheet' href='/stylesheets/style.css'/>
						// <link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css'/>
						// <link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap-theme.min.css'/>
						<link rel='stylesheet' href='/stylesheets/bootstrap.min.css', media='screen'/>
						<link rel='stylesheet' href='/stylesheets/bootstrap-datetimepicker.min.css'/>
						<link rel='stylesheet' href='/stylesheets/style.css'/>
				</head>
				<body>
					{this.props.children}
					// <script src='http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js'/>
					<script src='/javascripts/lib/jquery.js'/>
					<script src='/javascripts/lib/moment.min.js'>
					<script src='/javascripts/lib/bootstrap.min.js'>
					// <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"/>
					<script src="/javascripts/lib/bootstrap-datetimepicker.min.js"/>
					<script src='/javascripts/build/app.js'/>
					<script src='/javascripts/util/global.js'/>
				</body>
			</html>
		);
	}
});

module.exports = Layout;