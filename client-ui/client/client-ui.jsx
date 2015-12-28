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
      mapItem: ''
    }
  },
  componentDidMount() {
    GoogleMaps.load();
  },
  getMeteorData() {
    return {
      loaded: GoogleMaps.loaded(),
      mapOptions: GoogleMaps.loaded() && this._mapOptions()
    };
  },
  _mapOptions() {
    var map = this.props.mapOptions;
    return {
      center: new google.maps.LatLng(map.lat, map.lng),
      zoom: map.zoom,
      points: map.points
    };
  },
  onUpdate: function(val){
    this.setState({mapItem:val})
  },
  render() {
    if (this.data.loaded){
      return (
        <div>
          <GoogleMap name="mymap" options={this.data.mapOptions} ref="mymap" onUpdate={this.onUpdate}/>
          <Timelapse options={this.data.mapOptions} mapItem={this.state.mapItem}/>
        </div>
      )
    }
    return <div>Loading map...</div>;
  }
});

GoogleMap = React.createClass({
  propTypes: {
    name: React.PropTypes.string.isRequired,
    options: React.PropTypes.object.isRequired,
  },
  getInitialState: function() {
      return {
        markers: {},
        directionsRenderer: "",
        route: ""
      }
  },
  componentDidMount() {
    GoogleMaps.create({
      name: this.props.name,
      element: ReactDOM.findDOMNode(this),
      options: this.props.options
    });

    GoogleMaps.ready(this.props.name, function(map) {
      var point = map.options.points;
      var startPoint = new google.maps.LatLng(point.startPoint.lat, point.startPoint.lng);
      var endPoint = new google.maps.LatLng(point.endPoint.lat, point.endPoint.lng);
      var lookAtPoint = new google.maps.LatLng(point.lookAtPoint.lat, point.lookAtPoint.lng);

      var startPointMarker = new google.maps.Marker({
        position: startPoint,
        map: map.instance
      });
      this.state.markers.startPoint = startPointMarker

      var endPointMarker = new google.maps.Marker({
        position: endPoint,
        map: map.instance
      });
      this.state.markers.endPoint = endPointMarker

      var lookAtPointMarker = new google.maps.Marker({
        position: lookAtPoint,
        map: map.instance,
        draggable: true
      });
      this.state.markers.lookAtPoint = lookAtPointMarker

      var cameraPinMarker = new google.maps.Marker({
				position: startPoint,
				map: map.instance,
			});
      this.state.markers.cameraPinPoint = cameraPinMarker

      var ds = new google.maps.DirectionsService();

      var dr = new google.maps.DirectionsRenderer({
          draggable: false,
          markerOptions:{visible: false}
      });

      dr.setMap(map.instance);
      dr.setOptions({preserveViewport: true});

      var request = {
        origin: startPoint,
        destination: endPoint,
        travelMode: google.maps.DirectionsTravelMode.WALKING
      };

      ds.route(request, function(result, status) {
				if (status == google.maps.DirectionsStatus.OK) {
          dr.setDirections(result);
          this.setState({
            directionsRenderer: dr,
            markers:this.state.markers,
            route:result
          });
          console.log("Setting state: ",this.state)
          this.props.onUpdate(this.state);

				} else {
					console.log(status);
				}
      }.bind(this));
    }.bind(this));
  },
  render() {
    return <div className="map-container"></div>
  }
});

Timelapse = React.createClass({
    createHyperlapse: function(mapItem) {
      var panorama = document.getElementById('panorama');
      var option = {
        lookat: mapItem.markers.lookAtPoint.getPosition(),
        fov: 80,
        millis: 50,
        width: window.innerWidth,
        height: 500,//window.innerHeight,
        zoom: 2,
        use_lookat: true,
        distance_between_points: 5,
        max_points: 100,
        elevation: 0
      }

      $.getScript("https://cdnjs.cloudflare.com/ajax/libs/three.js/r73/three.js").done(function(a,b){
          var hyperlapse = new Hyperlapse(panorama, option);

          hyperlapse.onError = function(e) {
    				console.log( "ERROR: "+ e.message );
    			};

          hyperlapse.onRouteProgress = function(e) {
            console.log("Next")
    			};

    			hyperlapse.onRouteComplete = function(e) {
    				console.log( "Number of Points: "+ hyperlapse.length() );
    				hyperlapse.load();
    			};

          hyperlapse.onLoadProgress = function(e) {
    				console.log( "Loading: "+ (e.position+1) +" of "+ hyperlapse.length() );
    			};

          hyperlapse.onLoadComplete = function(e) {
            console.log("Hyperlapse Ready")
    				hyperlapse.play(); //Play the video once the trails has been completely generated
    			};

    			hyperlapse.onFrame = function(e) {
            console.log( "" +
    					"Start: " + mapItem.markers.startPoint.getPosition().toString() +
    					"<br>End: " + mapItem.markers.endPoint.getPosition().toString() +
    					"<br>Lookat: " + mapItem.markers.lookAtPoint.getPosition().toString() +
    					"<br>Position: "+ (e.position+1) +" of "+ hyperlapse.length());
            mapItem.markers.cameraPinPoint.setPosition(e.point.location);
    			};

          hyperlapse.generate({route:mapItem.route});
      });
    },
    componentWillReceiveProps: function(nextProps){
      this.createHyperlapse(nextProps.mapItem);
    },
    render() {
      return <div id="panorama" refs="panorama"></div>
    }
});

if (Meteor.isClient) {
  Meteor.startup(function() {

  });
}
