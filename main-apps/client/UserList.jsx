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
  mixins: [ReactMeteorData],

  getMeteorData() {
    return {
      userList: Users.find().fetch(),
      searchFilter: this.props.searchFilter,
      sorted: this.props.sorted
    }
  },
  childContextTypes: {
      muiTheme: React.PropTypes.object
  },
  getChildContext() {
    return {
        muiTheme: ThemeManager.getMuiTheme(LightRawTheme)
    };
  },
  handleMarkerClicked: function(name){
    this.props.clickMarker(name)
  },
  filterSearchAndSortList: function(){
    var userList = this.data.userList;
    var searchFilter = this.data.searchFilter;
    var sorted = this.data.sorted;

    //Search Filter
    userList = userList.filter(function(user){
      return user.name.toLowerCase().indexOf(searchFilter) == 0 ||
        user.status.toLowerCase().indexOf(searchFilter) == 0;
    })

    //Sort List
    if(sorted[0] == 'Alphabet'){
      userList.sort(function(a,b){
        if(a.name < b.name){
          return (sorted[0] == 'Alphabet' && sorted[1] ? -1: 1)
        }
        else if(a.name > b.name){
          return (sorted[0] == 'Alphabet' && sorted[1] ? 1: -1)
        }
        else{
          return 0
        }
      });
    } else{
      var filter = (sorted[0] == 'Status' ? 'status' : 'loginFrom');
      var sortMethod = {
        'Status': ['Online', 'Recording', 'Offline'],
        'Device': ['Computer', 'Mobile', 'Smartwatch', '']
      }
      var newUserList = [];

      //TODO: Sort items based on available categories in the current userlist only
      var category = []
      for(var j in userList){
        if(category.indexOf(userList[j][filter]) == -1){
          category.push(userList[j][filter]);
        }
      }

      for(var i = 0; i < sortMethod[sorted[0]].length; i++){
        var filteredUserList = userList.filter(function(user){
          return user[filter] == sortMethod[sorted[0]][(sorted[1]+i) % sortMethod[sorted[0]].length];
        })

        filteredUserList.sort(function(a,b){
          if(a.name < b.name){
            return -1
          }
          else if(a.name > b.name){
            return 1
          }
          else{
            return 0
          }
        });
        newUserList = newUserList.concat(filteredUserList);
      }
      userList = newUserList
    }

    return userList
  },
  render(){
    var userList = this.filterSearchAndSortList();
    var userItemList = [];

    for(var i=0; i < userList.length; i++){
      var loginFromIcon = (userList[i].loginFrom == 'Computer'? 'computer' :
        (userList[i].loginFrom == 'Mobile' ? 'smartphone' : (userList[i].loginFrom == 'Smartwatch' ? 'watch' : '')));
      var statusColor = (userList[i].status == 'Online' ? colors.green500 : (userList[i].status == 'Recording' ? colors.blue500 : colors.grey500));

      userItemList.push(
        <div key={i}>
        <ListItem
          onTouchTap={this.handleMarkerClicked.bind(this, userList[i].name)}
          primaryText={userList[i].name}
          secondaryText={userList[i].status}
          leftAvatar={<Avatar backgroundColor={statusColor}>{userList[i].name.charAt(0)}</Avatar>}
          rightIcon={<FontIcon className="material-icons">{loginFromIcon}</FontIcon>}
          />
        <Divider inset={true}/>
      </div>
      )
    }

    return <List subheader="User List" style={{overflowY:'scroll', height:'calc(100% - 117px)'}}>
      {userItemList}
      </List>
  }
});
