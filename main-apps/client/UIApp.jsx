injectTapEventPlugin()
var {
  AppBar,
  FontIcon,
  IconButton,
  IconMenu,
  MenuItem,
  List,
  ListItem,
  Styles,
  LeftNav,
  Avatar,
  Card,
  Divider,
  TextField,
  Toolbar,
  ToolbarGroup,
  Dialog,
  FlatButton
  } = MUI;
var { ThemeManager, LightRawTheme } = Styles;
var colors = Styles.Colors

UIApp = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData() {
    return {
      userList: Meteor.users.find({_id:{$ne:Meteor.userId()}}).fetch(),
      self: Meteor.user()
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

  getInitialState() {
    return{
      openDialog: false,
      open: false,
      openRightNav: true,
      selectedIndex: 1,
      sorted: ['Alphabet',1],
      selectedUser: '',
      searchFilter: ''
    }
  },
  handleSearchMarker: function(name) {
    if(name == this.data.self.profile.name){
      this.setState({selectedUser: this.data.self});
    } else {
      var userList = this.data.userList
      var userResult = userList.filter(function(user) {
        return user.profile.name == name;
      });
      this.setState({selectedUser: userResult[0]});
    }
    this.props.filterMarker(name);
  },
  handleSelfClicked: function(name){
    this.props.clickMarker(name)
  },
  handleToggle: function(){
    this.setState({open: !this.state.open});
  },
  handleCloseDialog: function(){
    this.setState({openDialog: false})
  },
  handleOpenDialog: function() {
    this.setState({openDialog: true})
  },
  handleClose: function(){
    this.setState({open: false})
  },
  handleUpdateSelectedIndex: function(e,index) {
    this.setState({selectedIndex: index})
  },
  handleChangeFilter: function() {
    var keyword = this.refs.searchUser.getValue().toLowerCase();
    this.setState({searchFilter: keyword});
  },
  handleSortList: function(sortBy){
    var currentSort = this.state.sorted
    var sortMethod = {
      'Status': ['Online', 'Recording', 'Offline'],
      'Device': ['Computer', 'Mobile', 'Smartwatch', '']
    }
    var newSort = [sortBy];

    if(sortBy == 'Alphabet'){
      newSort.push((currentSort[0] == 'Alphabet' ? !currentSort[1] : 1));
    }
    else{
      newSort.push((currentSort[0] == sortBy ? ((currentSort[1]+1) % sortMethod[sortBy].length) : 0));
    }
    this.setState({sorted: newSort});
  },
  logout(){
    var profile = Meteor.user().profile
    profile.status = "Offline";
    profile.loginFrom = '';
    Meteor.users.update(Meteor.userId(), {$set: {profile: profile}})
    Meteor.logout(function(){
      Meteor.clearInterval(this.watchId)
      return FlowRouter.go('/login');
      // window.alert("Logout")
    });
  },
  componentWillReceiveProps(nextProps, nextState) {
    if(this.state.selectedUser == '' || nextProps.marker != this.state.selectedUser.profile.name){
      this.handleSearchMarker(nextProps.marker);
    }
  },
  render() {
    var monthsName = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"]
    var actions = [
      <FlatButton
        label="Cancel"
        secondary={true}
        onTouchTap={this.handleCloseDialog}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleCloseDialog}
      />,
    ]

    var trailsItem = []
    var user = (this.state.selectedUser != '' ? this.state.selectedUser : this.data.self)
    var trails = user.profile.trails

    for(var i in trails){
      let startTime = new Date(trails[i].startTime);
      let endTime = new Date(trails[i].endTime);
      let durations = (endTime - startTime) / 1000;
      let sec = parseInt(durations % 60);
      let min = parseInt(durations / 60);
      let hour = parseInt(durations / 3600);
      let hourText = (hour > 0 ? hour+'h ' : '');
      let minText = (min > 0 ? min+'m ' : '');
      let secText = (sec > 0 ? sec+'s' : '');
      let durationContent = hourText + minText + secText;
      let recordTime = startTime.getDate() + ' ' + monthsName[startTime.getMonth()] + ' ' + startTime.getFullYear()
      trailsItem.push(<ListItem
        linkButton={true}
        target='_blank'
        href={trails[i].url}
        key={trails[i].id}
        primaryText={trails[i].name}
        secondaryTextLines={2}
        secondaryText={
          <p>
            <span>
              Distances: {parseInt(trails[i].distances) || 0} m | Durations: {durationContent}
            </span>
            <br/>
            Recorded on: {(trails[i].startTime ? recordTime : '')}
          </p>
        }/>)
    }

    var lastSeen = new Date(user.profile.lastSeen)
    var secondaryText = (user.profile.status != 'Offline' ?
      <p>{user.profile.loginFrom}</p> : lastSeen.toString())
    var loginFromIcon = (user.profile.loginFrom == 'Computer'? 'computer' :
      (user.profile.loginFrom == 'Mobile' ? 'smartphone' : (user.profile.loginFrom == 'Smartwatch' ? 'watch' : '')));
    var rightIcon = (user.profile.status != 'Offline' ?
      <FontIcon className="material-icons">{loginFromIcon}</FontIcon> : '')
    var profileItem = [
      <ListItem
        key={1}
        disabled={true}
        innerDivStyle={{paddingBottom:'0px'}}
        primaryText={(user.profile.status != 'Offline' ?
          "Login From" : "Last Seen")}
        secondaryText={secondaryText}
        rightIcon={rightIcon}
        />,
      <ListItem
        key={2}
        disabled={true}
        primaryText={(user.profile.status != 'Offline' ?
          "Current Location" : "Last Location")}
        secondaryTextLines={2}
        secondaryText={
          <p>
            <span>{user.profile.lastLocation}</span><br/>
            Lat: {user.profile.lastPosition.lat}, Lng: {user.profile.lastPosition.lng}
          </p>
        }
        />
    ]
    var avatar = (this.data.self.profile.avatar ? <Avatar src={this.data.self.profile.avatar}/> :
      <Avatar backgroundColor={colors.red500}>{this.data.self.profile.name.charAt(0)}</Avatar>)

    return <div>
      <AppBar
        title="Home"
        zDepth={2}
      />
      <Card style={{position:'fixed', right:0, top:'64px', width:'25%', height:'100%', minHeight:'100%'}} id="card">
        <div style={{height: '46.5%'}}> {/*{{height: '40%'}}*/}
          <List valueLink={{value: this.state.selectedIndex, requestChange: this.handleUpdateSelectedIndex}}>
            <ListItem
              onTouchTap={this.handleSelfClicked.bind(this, this.data.self.profile.name )}
              primaryText={"Hi, "+ this.data.self.profile.name +"!"}
              leftAvatar={avatar}
              rightIconButton={<IconMenu iconButtonElement={<IconButton iconClassName="material-icons">more_vert</IconButton>}>
                <MenuItem linkButton={true} onMouseDown={this.logout} leftIcon={<FontIcon className="material-icons">person</FontIcon>}>Sign Out</MenuItem>
                <MenuItem onTouchTap={this.handleOpenDialog} leftIcon={<FontIcon className="material-icons">account_circle</FontIcon>}>Remove Account</MenuItem>
              </IconMenu>}/>
          </List>
          <Dialog
            contentStyle={{width:'30%'}}
            title="Remove Account"
            actions={actions}
            modal={false}
            open={this.state.openDialog}
            onRequestClose={this.handleCloseDialog}>
            Are you sure you want to remove your account?
          </Dialog>
          <Divider style={{height:'2px'}}/>
          <div style={{overflowY:'scroll', height:'calc(100% - 74px)'}}>
          {/* <CardText style={{overflowY:'scroll', height:'calc(100% - 106px)'}}> */}
            <List>
              <ListItem
                disabled={true}
                innerDivStyle={{paddingBottom:'0px'}}
                primaryText={
                  <span style={{fontSize: '24px'}}>{user.profile.name}</span>
                }
                />
              <ListItem
                disabled={true}
                innerDivStyle={{paddingBottom:'0px'}}
                primaryText="Status"
                secondaryText={<p className={"status-"+user.profile.status.toLowerCase()}>{user.profile.status}</p>}
                />
              {profileItem}
              <Divider inset={true} />
              <ListItem
                disabled={true}
                primaryText="Trails"
                initiallyOpen={false}
                nestedItems={trailsItem}
              />
            </List>
          </div>
        </div>
        <div style={{height: '53.5%'}}> {/*{{height: '60%'}}*/}
          <Divider style={{height:'2px'}}/>
          <Toolbar>
            <ToolbarGroup style={{width: 'calc(100% - 150px)', display: 'inline-block'}}> {/*{{width: 'calc(100% - 144px)'}}*/}
              <TextField
                hintText={'Search User'}
                style={{minWidth: '168px', width: '100%'}}
                onChange={this.handleChangeFilter}
                ref='searchUser'
              />
            </ToolbarGroup>
            <ToolbarGroup float={'right'} style={{display: 'inline-block'}}>
              <IconButton tooltip={"Sort by Alphabet"} tooltipPosition="bottom-right" touch={true} iconClassName="material-icons" onTouchTap={this.handleSortList.bind(this, 'Alphabet')}>
                sort_by_alpha
              </IconButton>
              <IconButton tooltip={"Sort by Status"} tooltipPosition="bottom-center" touch={true} iconClassName="material-icons" onTouchTap={this.handleSortList.bind(this, 'Status')}>
                directions_run
              </IconButton>
              <IconButton tooltip={"Sort by Device"} tooltipPosition="bottom-left" touch={true} iconClassName="material-icons" onTouchTap={this.handleSortList.bind(this, 'Device')}>
                devices_other
              </IconButton>
            </ToolbarGroup>
          </Toolbar>
          <UserList clickMarker={this.props.clickMarker} searchFilter={this.state.searchFilter} sorted={this.state.sorted}/>
        </div>
      </Card>
    </div>;
  }
});
