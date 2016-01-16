injectTapEventPlugin()
var {
  Paper,
  IconButton,
  Slider,
  Toggle,
  FontIcon,
  CircularProgress,
  Styles,
  } = MUI;
var { ThemeManager, LightRawTheme } = Styles;

VideoPlayer = React.createClass({
  childContextTypes: {
      muiTheme: React.PropTypes.object
  },

  getChildContext() {
    return {
        muiTheme: ThemeManager.getMuiTheme(LightRawTheme)
    };
  },
  getInitialState: function(){
    return {
      isPlaying: false,
      hasPlayed: false,
      frame: '',
      speedFactor: this.props.option.millis,
      useLookAt: this.props.option.use_lookat,
      activeButton:'',
      zoomCameraView: this.props.option.fov,
      zoomCameraViewClass:'inactive',
      zoomCameraViewSlider:[1,180],
      rotateCameraView: 0,
      rotateCameraViewClass:'inactive',
      rotateCameraViewSlider:[-Math.PI,Math.PI],
      changeOffsetX:0,
      changeOffsetXClass:'inactive',
      changeOffsetXSlider:[-360,360],
      changeOffsetY:0,
      changeOffsetYClass:'inactive',
      changeOffsetYSlider:[-180,180],
      changeOffsetZ:0,
      changeOffsetZClass:'inactive',
      changeOffsetZSlider:[-360,360],
    }
  },
  //Handle change for video player
  handleUseLookAtPoint: function(e){
    e.target.innerHTML = (this.state.useLookAt ? 'location_off': 'location_on')
    this.setState({useLookAt: !(this.state.useLookAt)});
    this.props.onControl({useLookAt: this.state.useLookAt});
  },

  handlePlayPause: function(e){
    if(this.state.hasPlayed == false){
      this.setState({hasPlayed: true});
    }
    e.target.innerHTML = (this.state.isPlaying ? 'play_arrow': 'pause');
    document.getElementById('fastAndNext').getElementsByClassName('material-icons')[0].innerHTML = (this.state.isPlaying ? 'skip_next': 'fast_forward');
    document.getElementById('slowAndPrev').getElementsByClassName('material-icons')[0].innerHTML = (this.state.isPlaying ? 'skip_previous': 'fast_rewind');

    this.setState({isPlaying: !(this.state.isPlaying)});
    this.props.onControl({isPlaying: this.state.isPlaying});
  },
  handleFastAndNext: function(e){
    if(this.state.isPlaying){
      if(this.state.speedFactor > 0){
        this.setState({speedFactor: this.state.speedFactor-10})
        this.props.onControl({'speedFactor': this.state.speedFactor})
      }
    }
    else{
      this.setState({frame: 'next'});
      this.props.onControl({frame: 'next'});
    }
  },
  handleSlowAndPrev: function(e){
    if(this.state.isPlaying){
      if(this.state.speedFactor < 250){
        this.setState({speedFactor: this.state.speedFactor+10})
        this.props.onControl({'speedFactor': this.state.speedFactor})
      }
    }
    else{
      this.setState({frame: 'prev'});
      this.props.onControl({frame: 'prev'});
    }
  },
  handleButtonTriggered:function(e){
    ReactDOM.unmountComponentAtNode(document.getElementById('slider'));

    var aB = this.state.activeButton
    if(aB != ''){
      this.setState({[aB+'Class']: 'inactive'});
    }

    if(aB != e.currentTarget.id){
      var currentButton = e.currentTarget.id;
      ReactDOM.render(<Slider
        name="sliderValue"
        defaultValue={this.state[currentButton]}
        step={(currentButton == 'rotateCameraView'? 0.01 : 1)}
        min={this.state[currentButton+'Slider'][0]}
        max={this.state[currentButton+'Slider'][1]}
        style={{width:'90%', marginLeft: 'auto', marginRight: 'auto', marginBottom:'24px'}}
        onChange={this.handleChangeValue}/>,
      document.getElementById('slider'));

      this.setState({[currentButton+'Class']: 'active'});
      this.setState({activeButton: currentButton});
    }
    else{
      this.setState({activeButton: ''});
    }
  },
  handleChangeValue:function(e,value){
    var aB = this.state.activeButton
    this.setState({[aB]: value});
    this.props.onControl({[aB]: value})
  },
  render: function(){
    //TODO: Make tooltip to show and hide on mouse click, instead of on mouse enter and leave.
    return <div>
      <div style={{textAlign:'center'}}>
        <IconButton tooltip={"Zoom Camera View: "+this.state.zoomCameraView} tooltipPosition="top-center" className={'circle-icon '+ this.state.zoomCameraViewClass} touch={true} iconClassName="material-icons icon_small" ref="zoomCameraView" id="zoomCameraView" onTouchTap={this.handleButtonTriggered}>
          zoom_out_map
        </IconButton>
        <IconButton tooltip={"Rotate Camera View: "+this.state.rotateCameraView} tooltipPosition="top-center" className={'circle-icon '+ this.state.rotateCameraViewClass} touch={true} iconClassName="material-icons icon_small" ref="rotateCameraView" id="rotateCameraView" onTouchTap={this.handleButtonTriggered}>
          screen_rotation
        </IconButton>
        <IconButton tooltip={"Use Look At Point: "+(this.state.useLookAt ? "On": "Off")} tooltipPosition="top-center" className={'circle-icon'} touch={true} iconClassName="material-icons icon_small" onTouchTap={this.handleUseLookAtPoint} ref="useLookAtPoint">
          location_on
        </IconButton>
        <IconButton className={'circle-icon'} touch={true} iconClassName="material-icons icon_large" onTouchTap={this.handleSlowAndPrev} ref="slowAndPrev" id="slowAndPrev">
          skip_previous
        </IconButton>
        <IconButton className={'circle-icon'} touch={true} iconClassName="material-icons icon_large" onTouchTap={this.handlePlayPause} ref="playPause">
          play_arrow
        </IconButton>
        <IconButton className={'circle-icon'} touch={true} iconClassName="material-icons icon_large" onTouchTap={this.handleFastAndNext} ref="fastAndNext" id="fastAndNext">
          skip_next
        </IconButton>
        <IconButton tooltip={"Change Offset X: "+this.state.changeOffsetX} tooltipPosition="top-center" className={'circle-icon '+ this.state.changeOffsetXClass} touch={true} iconClassName="material-icons icon_small" ref="changeOffsetX" id="changeOffsetX" onTouchTap={this.handleButtonTriggered}>
          swap_horiz
        </IconButton>
        <IconButton tooltip={"Change Offset Y: "+this.state.changeOffsetY} tooltipPosition="top-center" className={'circle-icon '+ this.state.changeOffsetYClass} touch={true} iconClassName="material-icons icon_small" ref="changeOffsetY" id="changeOffsetY" onTouchTap={this.handleButtonTriggered}>
          swap_vert
        </IconButton>
        <IconButton tooltip={"Change Offset Z: "+this.state.changeOffsetZ} tooltipPosition="top-center" className={'circle-icon '+ this.state.changeOffsetZClass} touch={true} iconClassName="material-icons icon_small" ref="changeOffsetZ" id="changeOffsetZ" onTouchTap={this.handleButtonTriggered}>
          3d_rotation
        </IconButton>
      </div>
      <div id="slider">
      </div>
    </div>
  }
});
