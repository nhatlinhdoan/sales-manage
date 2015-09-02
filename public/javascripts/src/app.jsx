var React 			  = require('react'),
		NavigationTop = require('./components/NavigationTop.jsx'),
		AboutForm 	  = require('./forms/AboutForm.jsx'),
		ProductForm   = require('./forms/ProductForm.jsx'),
		OrderForm 	  = require('./forms/OrderForm.jsx'),
		OrderInForm   = require('./forms/OrderInForm.jsx'),
		OrderOutForm  = require('./forms/OrderOutForm.jsx');

var MyApp = React.createClass({
	getInitialState: function() {
		var _tabListData = [
      {
        key: 'Home',
        content: '<ProductForm />'
      },
      {
        key: 'Products',
        content: '<ProductForm />'
      },
      {
        key: 'Orders',
        content: '<OrderForm />'
      },
      {
        key: 'About',
        content: '<AboutForm />'
      },
    ];
		return ({
			currentTab: 'Orders',
			tabListData: _tabListData
		});
	},
	changeTab: function(tabKey) {
		var checkTabKey = this.state.tabListData.map(function (tab) {
		   return tab.key === tabKey;
		});
		if(checkTabKey) {
			this.setState({currentTab: tabKey});
		}
	},
	getTab: function() {
		switch(this.state.currentTab) {
			case 'Products': 
			case 'Home': 
				return (<ProductForm />);
				break;
			case 'Orders': 
				return (<OrderOutForm />);
				break;
			case 'About': 
				return (<AboutForm />);
				break;
			default: 
				return (<ProductForm />);
				break;
		}
	},
	render: function() {
		var currentForm = (
			<div>
				<NavigationTop 
					currentTab={this.state.currentTab} 
					tabListData={this.state.tabListData}
					onChangeTab={this.changeTab}/>
				{this.getTab()}
			</div>
		);
		return currentForm;
	}
});

React.render(
	<MyApp />,
	document.getElementById('wrapper')
);