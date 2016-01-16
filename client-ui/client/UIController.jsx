injectTapEventPlugin()
var {
    Paper,
    IconButton,
    Slider,
    Toggle,
    CircularProgress,
    Styles,
    } = MUI;
var { ThemeManager, LightRawTheme } = Styles;

UIController = React.createClass({
  getInitialState: function(){
    return {

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
  render: function(){
    return <div>
      <Paper zDepth={3} id="controller">
      </Paper>
    </div>
  }
});
