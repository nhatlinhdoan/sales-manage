var React = require('react');

module.exports = React.createClass({
  getInitialState: function() {
    var tabListData = [
      {
        key: 'Home',
        url: '/'
      },
      {
        key: 'Products',
        url: '/app'
      },
      {
        key: 'Orders',
        url: '/app/orders',
        subKey: [
          {
            key: 'Add Order in',
            url: '/app/orders',
          },
          {
            key: 'Add Order out',
            url: '/app/orders',
          },
          {
            key: 'Orders',
            url: '/app/orders',
          }
        ]
      },
      {
        key: 'About',
        url: '/about'
      },
    ];
    return ({
      tabList: tabListData,
      currentTab: 'Home'
    });
  },
  changeTab: function(tabKey, e) {
    e.preventDefault();

    if(tabKey) {
      this.setState({currentTab: tabKey});
    }

    this.props.callbackFn(tabKey);
  },
  render: function() {
    return (
      <div className='col-xs-12 col-sm-12'>
        <ul className='nav nav-tabs'>
        {
          this.state.tabList.map(function(tab) {
            return (
              <li className={this.state.currentTab === tab.key ? 'active' : ''}>
                <a href='#' onClick={this.changeTab.bind(null, tab.key)}>{tab.key}</a>
              </li>
            )
          }.bind(this))
        }
        </ul>
      </div>
    )
  }
});
