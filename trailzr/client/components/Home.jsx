var {
  Styles,
  RaisedButton,
  FlatButton,
  } = MUI;
var { ThemeManager, LightRawTheme } = Styles;
var colors = Styles.Colors


const SocialShareButtons = BlazeToReact('socialShareBasic');

ShareForm = React.createClass({
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
      status: 'Offline',
    }
  },
  closeShareModal() {
    this.props.setModalState(false)
  },
  mixins: [ReactMeteorData],
  getMeteorData() {
    return {
      self: Meteor.user(),
      status: (Meteor.user() ? Meteor.user().profile.status : "Offline")
    }
  },
  render() {
    return <div>
      <h4 style={{textAlign:'center'}}>Share your recorded trails on social media.</h4>
      <SocialShareButtons />
      <div className={'close-modal'}>
        <RaisedButton
          onMouseDown={this.closeShareModal}
          onTouchEnd={this.closeShareModal}
          label={"CLOSE"}
          primary={true}
          />
      </div>
    </div>
  }
})

Home = React.createClass({
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
      status: 'Offline',
    }
  },
  mixins: [ReactMeteorData],
  getMeteorData() {
    return {
      self: Meteor.user(),
      status: (Meteor.user() ? Meteor.user().profile.status : "Offline")
    }
  },
  handleRecord(){
    if(this.data.status == 'Online'){
      var d = new Date();
      var profile = Meteor.user().profile

      if(profile.trails === undefined){
        profile.trails = []
      }
      profile.trails.push({
        id: profile.trails.length +1,
        name: 'Trail '+ (profile.trails.length +1),
        positionList: [],
        startTime: d.toString(),
      })
      profile.status = "Recording";

      Meteor.users.update(Meteor.userId(), {$set: {profile: profile}})
      //Start Recording
    }
    else if(this.data.status == 'Recording'){
      var d = new Date();
      var profile = Meteor.user().profile;
      var lastTrail = profile.trails.length-1;
      var positions = profile.trails[lastTrail].positionList
      profile.trails[lastTrail].endTime = d.toString();
      profile.trails[lastTrail].url = 'http://localhost:3000/'+Meteor.userId()+'/'+(lastTrail+1);
      profile.trails[lastTrail].distances = 0;
      if(positions.length > 1){
        for(var i = 1; i < positions.length; i++){
          var p1 = new google.maps.LatLng(positions[i].lat, positions[i].lng);
          var p2 = new google.maps.LatLng(positions[i-1].lat, positions[i-1].lng);
          var distance = google.maps.geometry.spherical.computeDistanceBetween(p1, p2); //in Meter
          //var distance = (google.maps.geometry.spherical.computeDistanceBetween(p1, p2) / 1000).toFixed(); //in KM
          profile.trails[lastTrail].distances += distance;
        }
      }
      // calories: 300, //Calculate the calories based on the trails recorded
      profile.status = "Online";

      Meteor.users.update(Meteor.userId(), {$set: {profile: profile}})
      this.props.ionModal('Share', <ShareForm setModalState={this.props.setModalState}/>)
    }
  },
  render() {
    let iconColor = (this.data.status == "Online" ? 'directions_walk' : (this.data.status == "Recording" ? 'directions_run': 'person_pin' ))
    return <div className="status-wrapper">
      <div className="icon-wrapper">
        <div className="white-bg"><i className={"material-icons "+ this.data.status.toLowerCase()}>{iconColor}</i></div>
      </div>
      <div className="record-wrapper">
        <h2 style={{textAlign:'center'}}>{this.data.status == "Recording" ? "Now Recording.." : this.data.status}</h2>
        <div className="record-button">
          <RaisedButton
            disabled={this.data.status == "Offline"}
            onMouseDown={this.handleRecord}
            onTouchEnd={this.handleRecord}
            label={this.data.status == "Recording" ? "STOP": "RECORD"}
            primary={this.data.status == "Recording"}
            secondary={this.data.status != "Recording"}
            />
        </div>
      </div>
    </div>
  }
});
