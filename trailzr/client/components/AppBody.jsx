injectTapEventPlugin()
var {
  Styles,
  RaisedButton,
  FlatButton,
  Dialog,
  } = MUI;
var { ThemeManager, LightRawTheme } = Styles;
var colors = Styles.Colors

const {Link} = ReactRouter;
var Transition = React.addons.CSSTransitionGroup;

AppBody = React.createClass({
  childContextTypes: {
      muiTheme: React.PropTypes.object
  },
  getChildContext() {
    return {
      muiTheme: ThemeManager.getMuiTheme(LightRawTheme)
    };
  },
  getInitialState() {
    return {
      open: false
    }
  },
  ionModal(tab, content) {
    this.setState({
      modal: (
        <IonModal modalContent={content}>
          <div className="h1 title">{tab}</div>
          <button onClick={ () => this.setState({modal:false}) } className="button button-icon active">
            <i className="icon ion-ios-close-empty"></i>
          </button>
        </IonModal>
      )
    })
  },
  setModalState(status) {
    this.setState({
      modal: status
    })
  },
  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        secondary={true}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleClose}
      />,
    ];
    return (
      <div className="ionic-body">
        <div className="bar bar-header bar-light cyan-bg">
          <Link className="button button-icon icon ion-gear-a white-font" to={"/settings"}></Link>
          <Link className="h1 title white-font" to={"/"}>Trailzr</Link>
          <Link className="button button-icon icon ion-person-stalker white-font" to={"/users"}></Link>
        </div>
        <div className="view">
          <div className="scroll-content ionic-scroll">
            <div className="content overflow-scroll has-header light-cyan-bg">
              {React.cloneElement(this.props.children, {ionModal: this.ionModal, setModalState:this.setModalState})}
            </div>
          </div>
        </div>
        {this.state.modal ? <Backdrop /> : false}
        <Transition transitionName="modal" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
          {this.state.modal}
        </Transition>
      </div>
    )
  }
});
