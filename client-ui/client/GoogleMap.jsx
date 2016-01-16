GoogleMap = React.createClass({
  propTypes: {
    name: React.PropTypes.string.isRequired,
    options: React.PropTypes.object.isRequired,
  },
  getInitialState: function() {
      return {
        markers: {},
        directionsRenderer: "",
        route: "",
        map: ""
      }
  },
  addInitialMarkers: function(map){
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

    this.setState({markers:this.state.markers});
  },
  generateRoute: function(){
    var ds = new google.maps.DirectionsService();

    var dr = new google.maps.DirectionsRenderer({
        draggable: false,
        markerOptions:{visible: false}
    });

    dr.setMap(this.state.map);
    dr.setOptions({preserveViewport: true});

    var request = {
      origin: this.state.markers.startPoint.getPosition(),
      destination: this.state.markers.endPoint.getPosition(),
      travelMode: google.maps.DirectionsTravelMode.WALKING
    };

    ds.route(request, function(result, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        dr.setDirections(result);
        this.setState({
          directionsRenderer: dr,
          route:result
        });
        this.props.onUpdate(this.state);
      } else {
        console.log(status);
      }
    }.bind(this));
  },
  componentDidMount() {
    GoogleMaps.create({
      name: this.props.name,
      element: ReactDOM.findDOMNode(this),
      options: this.props.options
    });

    GoogleMaps.ready(this.props.name, function(map) {
      this.setState({map:map.instance});
      this.addInitialMarkers(map);
      this.generateRoute();
    }.bind(this));
  },
  render() {
    return <div className="map-container"></div>
  }
});
