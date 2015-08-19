var React = require('react');

module.exports = React.createClass({
  getInitialState: function() {
    var tabNameListData = [
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
        url: '/app/orders'
      },
      {
        key: 'About',
        url: '/about'
      },
    ];
    return ({
      tabNameList: tabNameListData,
      currentTab: 'Home'
    });
  },
  changeTab: function(tabName, e) {
    // e.preventDefault();

    if(tabName) {
      this.setState({currentTab: tabName});
    }
  },
  render: function() {
    return (
      <div className='col-xs-12 col-sm-12'>
        <ul className='nav nav-tabs'>
        {
          this.state.tabNameList.map(function(tabName) {
            return (
              <li className={this.state.currentTab === tabName.key ? 'active' : ''} onClick={this.changeTab.bind(null, tabName.key)}>
                <a href={tabName.url}>{tabName.key}</a>
              </li>
            )
          }.bind(this))
        }
        </ul>
      </div>
    )
  }
});
