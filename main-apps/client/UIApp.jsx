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
  CardActions,
  CardHeader,
  CardMedia,
  CardTitle,
  CardText,
  Divider,
  TextField,
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
  ToolbarTitle,
  Dialog,
  FlatButton
  } = MUI;
var { ThemeManager, LightRawTheme } = Styles;
var colors = Styles.Colors

UIApp = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData() {
    return {
      userList: Users.find().fetch(),
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
      selectedUser: this.props.self,
      searchFilter: ''
    }
  },
  handleSearchMarker: function(name) {
    if(name == this.props.self.name){
      this.setState({selectedUser: this.props.self});
      this.props.filterMarker(name);
    } else {
      var userList = this.data.userList
      var userResult = userList.filter(function(user) {
        return user.name == name;
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
  componentWillReceiveProps(nextProps, nextState) {
    var userList = this.data.userList
    if(nextProps.marker != this.state.selectedUser.name){
      this.handleSearchMarker(nextProps.marker);
    }
  },
  render() {
    var d = new Date();
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
    var user = this.state.selectedUser
    var trails = user.trails

    for(var i in trails){
      trailsItem.push(<ListItem
        key={i+1}
        primaryText={trails[i].name}
        secondaryTextLines={2}
        secondaryText={
          <p>
            <span>
              Distances: {trails[i].distances} km | Calories: {trails[i].calories} kcal
            </span>
            <br/>
            {trails[i].time}
          </p>
        }/>)
    }

    var profileItem = [
      <ListItem
        key={1}
        disabled={true}
        innerDivStyle={{paddingBottom:'0px'}}
        primaryText={(user.status != 'Offline' ?
          "Login From" : "Last Seen")}
        secondaryText={(user.status != 'Offline' ?
          user.loginFrom : d.toString())}
        />,
      <ListItem
        key={2}
        disabled={true}
        primaryText={(user.status != 'Offline' ?
          "Current Location" : "Last Location")}
        secondaryTextLines={2}
        secondaryText={
          <p>
            <span>{user.lastLocation}</span><br/>
            {user.lastPosition.lat}, {user.lastPosition.lng}
          </p>
        }
        />
    ]

    return <div>
      <AppBar
        title="Home"
        zDepth={2}
        onLeftIconButtonTouchTap={this.handleToggle}
      />
      <LeftNav
        docked={false}
        width={200}
        open={this.state.open}
        onRequestChange={open => this.setState({open})}>
        <List valueLink={{value: this.state.selectedIndex, requestChange: this.handleUpdateSelectedIndex}} value={1}>
          <ListItem value={1} primaryText="Home" leftIcon={<FontIcon className="material-icons">home</FontIcon>}/>
          <ListItem value={2} primaryText="Record" leftIcon={<FontIcon className="material-icons">fiber_smart_record</FontIcon>} onTouchTap={this.handleClose} />
        </List>
      </LeftNav>
      <Card style={{position:'fixed', right:0, top:'64px', width:'25%', height:'100%', minHeight:'100%'}} id="card">
        <div style={{height: '40%'}}>
          <List valueLink={{value: this.state.selectedIndex, requestChange: this.handleUpdateSelectedIndex}}>
            <ListItem
              onTouchTap={this.handleSelfClicked.bind(this, this.props.self.name )}
              primaryText={"Hi, "+ this.props.self.name +"!"}
              leftAvatar={<Avatar backgroundColor={colors.red500}>{this.props.self.name.charAt(0)}</Avatar>}
              rightIconButton={<IconMenu iconButtonElement={<IconButton iconClassName="material-icons">more_vert</IconButton>}>
                <MenuItem onTouchTap={this.handleOpenDialog} leftIcon={<FontIcon className="material-icons">person</FontIcon>}>Sign Out</MenuItem>
                <MenuItem leftIcon={<FontIcon className="material-icons">account_circle</FontIcon>}>Remove Account</MenuItem>
              </IconMenu>}/>
          </List>
          <Dialog
            contentStyle={{width:'30%'}}
            title="Sign Out"
            actions={actions}
            modal={false}
            open={this.state.openDialog}
            onRequestClose={this.handleCloseDialog}>
            Are you sure you want to sign out?
          </Dialog>
          <Divider style={{height:'2px'}}/>
          <div style={{overflowY:'scroll', height:'calc(100% - 74px)'}}>
          {/* <CardText style={{overflowY:'scroll', height:'calc(100% - 106px)'}}> */}
            <List>
              <ListItem
                disabled={true}
                innerDivStyle={{paddingBottom:'0px'}}
                primaryText={
                  <span style={{fontSize: '24px'}}>{user.name}</span>
                }
                />
              <ListItem
                disabled={true}
                innerDivStyle={{paddingBottom:'0px'}}
                primaryText="Status"
                secondaryText={user.status}
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
        <div style={{height: '60%'}}>
          <Divider style={{height:'2px'}}/>
          <Toolbar>
            <ToolbarGroup style={{width: 'calc(100% - 144px)', display: 'inline-block'}}>
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
