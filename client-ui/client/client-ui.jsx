App = React.createClass({
  render() {
    return <div>
      {this.props.map}
    </div>
  }
});

MyTestMap = React.createClass({
  mixins: [ReactMeteorData],
  getInitialState:function(){
    return {
      mapItem: '',
      controllerItem: '',
      trigger: '',
      progressStatus: ''
    }
  },
  componentDidMount() {
    GoogleMaps.load();
  },
  getMeteorData() {
    return {
      loaded: GoogleMaps.loaded(),
      mapOptions: GoogleMaps.loaded() && this._mapOptions(),
      //user: User.find({}).fetch
    };
  },
  _mapOptions() {
    var map = this.props.mapOptions;
    return {
      center: new google.maps.LatLng(map.lat, map.lng),
      zoom: map.zoom,
      scrollwheel: false,
      draggable: true,
      points: map.points,
      disableDefaultUI: true
    };
  },
  handleUpdate: function(val){
    this.setState({mapItem:val, trigger:"map"});
  },
  handleController: function(val){
    this.setState({controllerItem: val, trigger: "controller"});
  },
  handleLoader: function(val){
    this.setState({loaderItem: val});
  },
  render() {
    if (this.data.loaded){
      return (
        <div>
          <GoogleMap name="myMap" options={this.data.mapOptions} ref="myMap" onUpdate={this.handleUpdate} />
          <Timelapse name="myTimelapseVideo" options={this.data.mapOptions} onLoading={this.handleLoader} mapItem={this.state.mapItem} controllerItem={this.state.controllerItem} trigger={this.state.trigger}/>
          <UIController name="myUIController" onControl={this.handleController} loaderItem={this.state.loaderItem} />
        </div>
      )
    }
    return <div>Loading map...</div>;
  }
});

if (Meteor.isClient) {
  Meteor.startup(function() {
    // Tracker.autorun(function () {
    //  var geo = Geolocation.latLng();
    //  console.log(geo)
    // });
  });
}

if (Meteor.isServer) {

}
