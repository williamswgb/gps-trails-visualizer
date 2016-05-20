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
      users: Meteor.users.find({_id:{$ne:Meteor.userId()}}).fetch(),
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
    var users = this.data.users;
    var searchFilter = this.data.searchFilter;
    var sorted = this.data.sorted;

    //Search Filter
    users = users.filter(function(user){
      return user.profile.name.toLowerCase().indexOf(searchFilter) == 0 ||
        user.profile.status.toLowerCase().indexOf(searchFilter) == 0;
    })

    //Sort List
    if(sorted[0] == 'Alphabet'){
      users.sort(function(a,b){
        if(a.profile.name < b.profile.name){
          return (sorted[0] == 'Alphabet' && sorted[1] ? -1: 1)
        }
        else if(a.profile.name > b.profile.name){
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
      var newUsers = [];

      //TODO: Sort items based on available categories in the current userlist only
      var category = []
      for(var j in users){
        if(category.indexOf(users[j]['profile'][filter]) == -1){
          category.push(users[j]['profile'][filter]);
        }
      }

      for(var i = 0; i < sortMethod[sorted[0]].length; i++){
        var filteredUsers = users.filter(function(user){
          return user['profile'][filter] == sortMethod[sorted[0]][(sorted[1]+i) % sortMethod[sorted[0]].length];
        })

        filteredUsers.sort(function(a,b){
          if(a.profile.name < b.profile.name){
            return -1
          }
          else if(a.profile.name > b.profile.name){
            return 1
          }
          else{
            return 0
          }
        });
        newUsers = newUsers.concat(filteredUsers);
      }
      users = newUsers
    }

    return users
  },
  render(){
    var users = this.filterSearchAndSortList();
    var userItemList = [];

    for(var i=0; i < users.length; i++){
      var loginFromIcon = (users[i].profile.loginFrom == 'Computer'? 'computer' :
        (users[i].profile.loginFrom == 'Mobile' ? 'smartphone' : (users[i].profile.loginFrom == 'Smartwatch' ? 'watch' : '')));
      var statusColor = (users[i].profile.status == 'Online' ? colors.green500 : (users[i].profile.status == 'Recording' ? colors.blue500 : colors.grey500));
      var avatar = (users[i].profile.avatar ? <Avatar src={users[i].profile.avatar}/> :
        <Avatar backgroundColor={statusColor}>{users[i].profile.name.charAt(0)}</Avatar>)
      userItemList.push(
        <div key={i}>
        <ListItem
          onTouchTap={this.handleMarkerClicked.bind(this, users[i].profile.name)}
          primaryText={users[i].profile.name}
          secondaryText={<p className={"status-"+users[i].profile.status.toLowerCase()}>{users[i].profile.status}</p>}
          leftAvatar={avatar}
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
