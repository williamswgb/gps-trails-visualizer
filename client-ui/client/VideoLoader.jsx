injectTapEventPlugin()
var {
    Paper,
    IconButton,
    Slider,
    Toggle,
    CircularProgress,
    LinearProgress,
    Styles,
    FontIcon
    } = MUI;
var { ThemeManager, LightRawTheme } = Styles;

VideoLoader = React.createClass({
  childContextTypes: {
      muiTheme: React.PropTypes.object
  },

  getChildContext() {
      return {
          muiTheme: ThemeManager.getMuiTheme(LightRawTheme)
      };
  },
  render: function(){
    var progress
    var percentage = ' ';

    if (this.props.length == null || this.props.value == null) {
      progress = <div className='loader'>
        <FontIcon className="material-icons" >map</FontIcon>
        <LinearProgress mode="indeterminate" />
      </div>;
    }
    else {
      percentage = Math.round((this.props.value / this.props.length) * 100);
      progress = <div className='loader'>
          <p>{percentage}%</p>
          <LinearProgress  mode="determinate" min={0} max={this.props.length} value={this.props.value}/>
        </div>;
    }

    return <div>
      {progress}
      <p style={{textAlign:'center'}}>{this.props.progress}</p>
    </div>
  }
});
