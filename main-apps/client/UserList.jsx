injectTapEventPlugin()
var {
  FontIcon,
  IconMenu,
  List,
  ListItem,
  Styles,
  Avatar,
  Divider,
  } = MUI;
var { ThemeManager, LightRawTheme } = Styles;
var colors = Styles.Colors

UserList = React.createClass({
  childContextTypes: {
      muiTheme: React.PropTypes.object
  },

  getChildContext() {
    return {
        muiTheme: ThemeManager.getMuiTheme(LightRawTheme)
    };
  },
  getInitialState() {
    return{

    }
  },
  handleMarkerClicked: function(lat, lng) {
    this.props.clickMarker({lat:lat, lng:lng})
  },
  render(){
    //var userList = this.state.userList;
    var userList = this.props.userListItems;
    var userItemList = [];

    for(var i=0; i < userList.length; i++){
      var loginFromIcon = (userList[i].loginFrom == 'Computer'? 'computer' :
        (userList[i].loginFrom == 'Mobile' ? 'smartphone' : (userList[i].loginFrom == 'Smartwatch' ? 'watch' : '')));
      var statusColor = (userList[i].status == 'Online' ? colors.green500 : (userList[i].status == 'Recording' ? colors.blue500 : colors.grey500));

      userItemList.push(
        <div>
        <ListItem
          onTouchTap={this.handleMarkerClicked.bind(this,userList[i].lastPosition.lat, userList[i].lastPosition.lng)}
          primaryText={userList[i].name}
          secondaryText={userList[i].status}
          leftAvatar={<Avatar backgroundColor={statusColor}>{userList[i].name.charAt(0)}</Avatar>}
          rightIcon={<FontIcon className="material-icons">{loginFromIcon}</FontIcon>}
          />
        <Divider inset={true}/>
      </div>
      )
    }

    return <List subheader="User List" valueLink={{value: this.state.selectedIndex, requestChange: this.handleUpdateSelectedIndex}} style={{overflowY:'scroll', height:'calc(100% - 117px)'}}>
      {userItemList}
      </List>
  }
});
