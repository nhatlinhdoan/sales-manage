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
			currentTab: 'Products',
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
	render: function() {
		var currentForm = (
			<div>
				<NavigationTop callbackFn={this.changeTab}/>
				{
					(this.state.currentTab == 'Products' || this.state.currentTab == 'Home') ? 
							<ProductForm /> : 
							(this.state.currentTab == 'Orders') ? 
								<OrderOutForm /> : 
							(this.state.currentTab == 'About') ? 
								<AboutForm /> : 'Oh lalaaa'
				}
			</div>
		);

		return currentForm;
	}
});

React.render(
	<MyApp />,
	document.getElementById('wrapper')
);