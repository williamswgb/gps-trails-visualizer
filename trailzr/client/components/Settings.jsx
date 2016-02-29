const {History, Navigation} = ReactRouter;
var {
  Styles,
  RaisedButton,
  FlatButton,
  } = MUI;
var { ThemeManager, LightRawTheme } = Styles;
var colors = Styles.Colors

Profile = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    return {
      user: Meteor.user(),
      userLoading: Meteor.loggingIn()
    }
  },
  getLoginStatus() {
    if (this.data.userLoading || !this.data.user) {return false;}
    if (this.data.user) {return true;}
    return false
  },
  render() {
    let loginStatus = this.getLoginStatus();
    if (this.data.userLoading) {
      return <AppLoading />
    }
    return (
      <div className="profile-wrapper">
        <div className="image-wrapper">
          {loginStatus ? <img src={this.data.user.profile.avatar} /> : <div></div>}
        </div>
        <div className="login-wrapper">
          <div className="login-button">
          {loginStatus ? <LoggedIn ionModal={this.props.ionModal} /> :
          <NotLoggedIn setModalState={this.props.setModalState} ionModal={this.props.ionModal} />}
          </div>
        </div>
      </div>
    )
  }
});

LoginForm = React.createClass({
  getInitialState() {
    return {
      user: "",
      pass: ""
    }
  },
  handleChange(input, e) {
    if (input == "user") {
      this.setState({
        user: e.target.value
      })
    };
    if (input == "pass") {
      this.setState({
       pass: e.target.value
      })
    }
  },
  render() {
    var user = this.state.user;
    var pass = this.state.pass;

    return (
      <div>
        <div className="list">
          <label className="item item-input">
            <span className="input-label">Username</span>
            <input value={user} type="text" onChange={this.handleChange.bind(this, "user")} />
          </label>
          <label className="item item-input">
            <span className="input-label">Password</span>
            <input value={pass} type="password" onChange={this.handleChange.bind(this, "pass")} />
          </label>
        </div>
        <div className="padding">
          <button onClick={this.props.login.bind(null, this.state.user, this.state.pass)} className="button button-block button-positive">
            Log in
          </button>
        </div>
      </div>
    )
  }
});

LoggedIn = React.createClass({
  childContextTypes: {
      muiTheme: React.PropTypes.object
  },
  getChildContext() {
    return {
      muiTheme: ThemeManager.getMuiTheme(LightRawTheme)
    };
  },
  mixins: [ReactMeteorData],
  getMeteorData: function() {
    return {
      isAuthenticated: Meteor.userId() !== null
    };
  },
  logout() {
    var profile = Meteor.user().profile
    profile.status = "Offline";
    Meteor.users.update(Meteor.userId(), {$set: {profile: profile}})
    Meteor.logout(function(){
      Meteor.clearInterval(this.watchId)
      window.alert("Logout")
    });
  },
  render() {
    return <RaisedButton
          onMouseDown={this.logout}
          onTouchEnd={this.logout}
          label={"Logout"}
          primary={true}
          />
  }
})

NotLoggedIn = React.createClass({
  login(user, pass) {
    Meteor.loginWithPassword(user, pass);
    this.props.setModalState(false);
  },
  render() {
    return <RaisedButton
      onMouseDown={this.props.ionModal.bind(null, "Log in", <LoginForm login={this.login}/>)}
      onTouchEnd={this.props.ionModal.bind(null, "Log in", <LoginForm login={this.login}/>)}
      label={"Login"}
      secondary={true}
      />
    //return <a onClick={this.props.ionModal.bind(null, "Log in", <LoginForm login={this.login}/>)}>Login</a>
  }
})

Settings = React.createClass({
  render() {
    return (
        <Profile ionModal={this.props.ionModal} setModalState={this.props.setModalState}/>
    )
  }
});
