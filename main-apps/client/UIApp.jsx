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
  ToolbarTitle
  } = MUI;
var { ThemeManager, LightRawTheme } = Styles;
var colors = Styles.Colors

UIApp = React.createClass({
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
      open: false,
      openRightNav: true,
      selectedIndex: 1,
      sorted: ['Alphabet',1],
      userList: this.props.userList
    }
  },
  handleToggle: function(){
    this.setState({open: !this.state.open});
  },
  handleClose: function(){
    this.setState({open: false})
  },
  handleUpdateSelectedIndex: function(e,index) {
    this.setState({selectedIndex: index})
  },
  filterUserList: function(e) {
    var keyword = this.refs.searchUser.getValue().toLowerCase();
    var userItems = this.props.userList;

    var filteredUserList = userItems.filter(function(el){
      return el.name.toLowerCase().indexOf(keyword) == 0 ||
        el.status.toLowerCase().indexOf(keyword) == 0;
    })
    this.setState({userList: filteredUserList});
  },
  sortUserList: function(sortBy){
    var userItems = this.state.userList
    var currentSort = this.state.sorted
    var sortMethod = {
      'Status': ['Online', 'Recording', 'Offline'],
      'Device': ['Computer', 'Mobile', 'Smartwatch', '']
    }
    var newSort = [sortBy];
    var newUserItems = [];

    if(sortBy == 'Alphabet'){
      newSort.push((currentSort[0] == 'Alphabet' ? !currentSort[1] : 1));
      userItems.sort(function(a,b){
        if(a.name < b.name){
          return (currentSort[0] == 'Alphabet' && currentSort[1] ? 1: -1)
        }
        else if(a.name > b.name){
          return (currentSort[0] == 'Alphabet' && currentSort[1] ? -1: 1)
        }
        else{
          return 0
        }
      });
      newUserItems = newUserItems.concat(userItems);
    }
    else{
      newSort.push((currentSort[0] == sortBy ? ((currentSort[1]+1) % sortMethod[sortBy].length) : 0));

      for(var i = 0; i < sortMethod[sortBy].length; i++){
        var filteredUserList = userItems.filter(function(el){
          var filter = (sortBy == 'Status' ? el.status : el.loginFrom);
          return filter == sortMethod[sortBy][(newSort[1]+i) % sortMethod[sortBy].length];
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
        newUserItems = newUserItems.concat(filteredUserList);
      }
    }
    this.setState({userList: newUserItems, sorted: newSort});
  },
  render() {
    var d = new Date();
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
              primaryText="Hi, William!"
              leftAvatar={<Avatar backgroundColor={colors.red500}>W</Avatar>}
              rightIconButton={<IconMenu iconButtonElement={<IconButton iconClassName="material-icons">more_vert</IconButton>}>
                <MenuItem leftIcon={<FontIcon className="material-icons">person</FontIcon>}>Logout</MenuItem>
                <MenuItem leftIcon={<FontIcon className="material-icons">account_circle</FontIcon>}>Remove Account</MenuItem>
              </IconMenu>}/>
          </List>
          <Divider style={{height:'2px'}}/>
          <CardText style={{overflowY:'scroll', height:'calc(100% - 106px)'}}>
            Status: Online<br/>
            Login From: Mobile<br/>
            Current Location: NTU (Lat, Lng)<br/>
            Last Seen: {d.toString()}<br/> {/*{d.toString().substring(0,21)+' '+d.toString().substring(35,38)}<br/>*/}
            Last Position: (Lat, Lng)<br/>
            Trails: <br/>
            <ul>
              <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
              <li>Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.</li>
              <li>Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.</li>
              <li>Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.</li>
              <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
              <li>Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.</li>
              <li>Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.</li>
              <li>Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.</li>
            </ul>
          </CardText>
        </div>
        <div style={{height: '60%'}}>
          <Divider style={{height:'2px'}}/>
          <Toolbar>
            <ToolbarGroup style={{width: 'calc(100% - 144px)', display: 'inline-block'}}>
              <TextField
                hintText={'Search User'}
                style={{minWidth: '168px', width: '100%'}}
                onChange={this.filterUserList}
                ref='searchUser'
              />
            </ToolbarGroup>
            <ToolbarGroup float={'right'} style={{display: 'inline-block'}}>
              <IconButton tooltip={"Sort by Alphabet"} tooltipPosition="bottom-right" touch={true} iconClassName="material-icons" onTouchTap={this.sortUserList.bind(this, 'Alphabet')}>
                sort_by_alpha
              </IconButton>
              <IconButton tooltip={"Sort by Status"} tooltipPosition="bottom-center" touch={true} iconClassName="material-icons" onTouchTap={this.sortUserList.bind(this, 'Status')}>
                directions_run
              </IconButton>
              <IconButton tooltip={"Sort by Device"} tooltipPosition="bottom-left" touch={true} iconClassName="material-icons" onTouchTap={this.sortUserList.bind(this, 'Device')}>
                devices_other
              </IconButton>
            </ToolbarGroup>
          </Toolbar>
          <UserList userListItems={this.state.userList}/>
        </div>
      </Card>
    </div>;
  }
});
