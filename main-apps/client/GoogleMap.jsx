GoogleMap = React.createClass({
  propTypes: {
    name: React.PropTypes.string.isRequired,
    options: React.PropTypes.object.isRequired
  },
  getInitialState() {
    return {
      users: this.props.userList,
      selfMarker: '',
      markers: [],
      polylines: {},
      filter: this.props.filter,
      infowindow: new google.maps.InfoWindow()
    }
  },
  updateMarker: function(i, user, markers){
    markers[i].setPosition({
      lat: user.lastPosition.lat,
      lng: user.lastPosition.lng
    });

    var markerIcon = (user.status == 'Online' ? 'directions_walk' :
    (user.status == 'Recording' ? 'directions_run': 'person_pin_circle'));
    var colorIcon = (user.status == 'Online' ? 'online' :
    (user.status == 'Recording' ? 'recording': 'offline'));

    markers[i].labelContent = '<i style="font-size:40px" class="material-icons ' + colorIcon + '">' + markerIcon + '</i>'

    return markers
  },
  addNewMarker: function(user){
    var self = this;
    var map = GoogleMaps.maps[this.props.name].instance;
    var markerIcon = (user.status == 'Online' ? 'directions_walk' :
    (user.status == 'Recording' ? 'directions_run': 'person_pin_circle'));
    var colorIcon = (user.status == 'Online' ? 'online' :
    (user.status == 'Recording' ? 'recording': 'offline'));

    var marker = new MarkerWithLabel({
      name: user.name,
      position: {
        lat: user.lastPosition.lat,
        lng: user.lastPosition.lng
      },
      icon: ' ',
      labelAnchor: new google.maps.Point(20,25),
      map: GoogleMaps.maps[this.props.name].instance,
      labelContent: '<i style="font-size:40px" class="material-icons ' + colorIcon + '">' + markerIcon + '</i>'
    });

    marker.addListener('click', function() {
      self.props.clickMarker(user.name)
      var infowindow = self.state.infowindow
      infowindow.close();
      infowindow.setContent(user.name)
      infowindow.open(map, this);
    });

    return marker
  },
  componentDidMount() {
    var self = this
    var users = this.props.userList
    var markers = this.state.markers

    $.getScript("http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerwithlabel/src/markerwithlabel.js").done(function(a,b){
      GoogleMaps.create({
        name: self.props.name,
        element: ReactDOM.findDOMNode(self),
        options: self.props.options
      });

      GoogleMaps.ready(self.props.name, function(map) {
        var marker = new MarkerWithLabel({
          name: self.props.self.name,
          position: map.options.center,
          icon: ' ',
          map: map.instance,
          labelAnchor: new google.maps.Point(20,25),
          labelContent: '<i style="font-size:40px" class="material-icons self">accessibility</i>'
        });

        marker.addListener('click', function() {
          var selfObj = self.props.self
          self.props.clickMarker(selfObj.name)
          map.instance.panTo({lat: selfObj.lastPosition.lat, lng: selfObj.lastPosition.lng})
          map.instance.setZoom(self.props.options.zoom-3)

          var infowindow = self.state.infowindow
          infowindow.close();
          infowindow.setContent(self.props.self.name);
          infowindow.open(map.instance, this);
        });

        for(i in users){
          markers.push(self.addNewMarker(users[i]));
        }
        self.setState({selfMarker: marker, markers: markers, users: users})
      });
    });
  },
  shouldComponentUpdate(nextProps, nextState) {
    return (nextState.filter != this.state.filter);
  },
  componentWillUpdate(nextProps, nextState) {
    var map = GoogleMaps.maps[this.props.name].instance
    var infowindow = this.state.infowindow
    var user
    var marker

    if(nextProps.filter == this.props.self.name){
      user = this.props.self
      marker = this.state.selfMarker
    } else {
      var userList = this.props.userList
      var userResult = userList.filter(function(user) {
        return user.name == nextProps.filter;
      });
      user = userResult[0]

      var markers = this.state.markers
      var markerResult = markers.filter(function(marker) {
        return marker.name == nextProps.filter
      });
      marker = markerResult[0]
    }

    map.panTo({lat: user.lastPosition.lat, lng: user.lastPosition.lng})
    map.setZoom(nextProps.options.zoom-3)

    //Open infowindow when the marker is selected
    infowindow.close();
    infowindow.setContent(nextProps.filter);
    infowindow.open(map, marker);
  },
  componentWillReceiveProps(nextProps, nextState) {
    if (nextProps.filter != '' && this.state.filter != nextProps.filter) {
      this.setState({filter: nextProps.filter});
    };

    var oldUsers = this.state.users
    var newUsers = nextProps.userList
    var markers = this.state.markers  //[MarkerWithLabel, ..., MarkerWithLabel]
    var map = GoogleMaps.maps[this.props.name].instance

    //Update the number of marker in maps
    //Find user object differences between oldUsers and newUsers
    var userOld = oldUsers.filter(function(current){
      return newUsers.filter(function(current_n){
        return current_n.name == current.name
      }).length == 0
    });

    var userNew = newUsers.filter(function(current){
      return oldUsers.filter(function(current_o){
        return current_o.name == current.name
      }).length == 0
    });

    var oldNewUser = userOld.concat(userNew);

    if(oldUsers.length < newUsers.length) {
      //Add new marker to map
      for(i in oldNewUser){
        var newMarker = this.addNewMarker(oldNewUser[i])

        //Move mapview position to the new marker
        map.panTo({
          lat: oldNewUser[i].lastPosition.lat,
          lng: oldNewUser[i].lastPosition.lng
        })
        map.setZoom(nextProps.options.zoom-3);

        //Open short infowindow and close it after a while
        var infowindow = new google.maps.InfoWindow({
          content: oldNewUser[i].name+" has just joined!"
        });
        infowindow.open(map, newMarker);
        setTimeout(function(){
          infowindow.close()
        }, 5000);

        markers.push(newMarker);
      }
    }
    else if(oldUsers.length > newUsers.length) {
      //Remove old marker from map
      for(i in oldNewUser){
        var filteredMarkers = markers.filter(function(marker){
          return marker.name == oldNewUser[i].name
        })
        var removedMarker = markers.splice(markers.indexOf(filteredMarkers[0]), 1)
        removedMarker[0].setMap(null);
      }
    }
    /*
    var polylines = this.state.polylines //{Bay: polylines}
      // New       Old
      // Online -> Online -> Update Marker Position
      //        -> Recording -> Update Marker Position
      //                     -> Change To Online Icon
      //                     -> Remove Polyline from maps
      //        -> Offline -> Update Marker Position
      //                   -> Change To Online Icon
      //
      // Recording -> Online -> Update Marker Position
      //                     -> Change To Recording Icon
      //                     -> Create Polyline
      //           -> Recording -> Update Marker Position
      //                        -> Update Polyline length
      //           -> Offline -> Update Marker Position
      //                      -> Change To Recording Icon
      //
      // Offline -> Online -> Update Marker Position
      //                   -> Change To Offline Icon
      //         -> Recording -> Update Marker Position
      //                      -> Change To Offline Icon
      //         -> Offline -> Do Nothing

    for(var i in newUsers){
      if(i >= oldUsers.length){
        //Create new marker
        markers.push(this.addNewMarker(newUsers[i]));
      }
      else{
        //Update Marker Position & Change Icon
        markers = this.updateMarker(i, newUsers[i], markers)

        switch(newUsers[i].status) {
          case "Online":
            if(oldUsers[i].status == "Recording") {
              //Remove Polyline from maps
              polylines[newUsers[i].name].setMap(null)
              delete polylines[newUsers[i].name]
            }
            break;
          case "Recording":
            if(oldUsers[i].status == "Online"){
              //Create Polyline
              var poly = new google.maps.Polyline({
                strokeColor: '#000000',
                strokeOpacity: 1.0,
                strokeWeight: 3
              });
              poly.setMap(GoogleMaps.maps[this.props.name].instance);
              polylines[newUsers[i].name] = poly
            }
            else if(oldUsers[i].status == "Recording"){
              //Update Polyline Length
              var path = polylines[newUsers[i].name].getPath();
              path.push({
                lat: newUsers[i].lastPosition.lat,
                lng: newUsers[i].lastPosition.lng
              })
            }
            break;
          default:
              console.log("No Update")
        }
      }
    }
    */
    this.setState({users: newUsers, markers: markers})
  },
  componentWillUnmount() {
    if (GoogleMaps.maps[this.props.name]) {
      google.maps.event.clearInstanceListeners(GoogleMaps.maps[this.props.name].instance);
      delete GoogleMaps.maps[this.props.name];
    }
  },
  render() {
    return <div className="map-container"></div>;
  }
});
