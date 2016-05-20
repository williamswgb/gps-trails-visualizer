injectTapEventPlugin()
var {
  Paper,
  Styles,
  Divider,
  TextField,
  RaisedButton,
  FlatButton
  } = MUI;
var { ThemeManager, LightRawTheme } = Styles;
var colors = Styles.Colors

Login = React.createClass({
  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  getChildContext() {
    return {
      muiTheme: ThemeManager.getMuiTheme(LightRawTheme)
    };
  },

  mixins: [ReactMeteorData],
  getInitialState() {
    return {
      user: "",
      pass: ""
    }
  },
  getMeteorData() {
    return {
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
  login() {
    var user = this.state.user;
    var pass = this.state.pass;
    Meteor.loginWithPassword(user, pass);
  },
  render() {
    var user = this.state.user;
    var pass = this.state.pass;
    var styles = {
      background: {
        backgroundColor: colors.cyan500,
        backgroundSize: '100%',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        backgroundImage: 'url(/images/world7.png)',
      },
      paper: {
        width: '90%',
        maxWidth: '800px',
        margin: '0',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        padding: '64px 0',
        boxSizing: 'border-box'
      },
      title: {
        margin: '0 0 24px 0',
        color: colors.cyan500,
        fontSize: '2em'
      },
      appLogo: {
        width: '192px',
        height: '192px',
        borderRadius: '50%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '62.5% 50%',
        backgroundColor: colors.cyan500,
        backgroundImage: 'url(/images/logo2.png)',
        margin: '0 auto',
        boxShadow: '0 19px 60px rgba(0, 0, 0, 0.30), 0 15px 20px rgba(0, 0, 0, 0.22)'
      },
      username: {
        display: 'block',
        margin: '16px auto 0 auto'
      },
      password: {
        display: 'block',
        margin: '0 auto'
      },
      submitButton: {
        margin: '24px 0 0 0'
      },
      signUpContainer: {
        marginTop: '16px'
      },
      signUpButton: {
        color: colors.cyan500
      },
    }

    return <div className="admin-login-page" style={styles.background}>
      <Paper zDepth={5} style={styles.paper}>
        <div style={styles.title}>Trailzr</div>
        <div style={styles.appLogo}></div>
        <TextField hintText="Username" style={styles.username} value={user} onChange={this.handleChange.bind(this, "user")}/>
        <TextField hintText="Password" style={styles.password} type="password" onChange={this.handleChange.bind(this, "pass")}/>
        <RaisedButton
          label="Login"
          primary={true}
          backgroundColor={colors.cyan500}
          style={styles.submitButton}
          linkButton={true}
          onMouseDown={this.login}/>
        {/*<div style={styles.signUpContainer}>
          <FlatButton
            label="Sign Up"
            primary={true}
            style={styles.signUpButton}
            linkButton={true}
            href={'/home/william'}/>
        </div>*/}
      </Paper>
    </div>
  }
});
