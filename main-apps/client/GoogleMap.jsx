GoogleMap = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    return {
      self: Meteor.user(),
      users: Meteor.users.find({_id:{$ne:Meteor.userId()}}).fetch()
    }
  },

  getInitialState() {
    return {
      users: this.props.users,
      selfMarker: '',
      markers: [],
      polylines: {},
      infowindow: new google.maps.InfoWindow(),
      map: ''
    }
  },
  updateMarker: function(i, user, markers){
    markers[i].setPosition({
      lat: user[i].profile.lastPosition.lat,
      lng: user[i].profile.lastPosition.lng
    });

    var markerIcon = (user[i].profile.status == 'Online' ? 'directions_walk' :
    (user[i].profile.status == 'Recording' ? 'directions_run': 'person_pin_circle'));

    markers[i].set('labelContent', '<i style="font-size:40px" class="material-icons ' + user[i].profile.status.toLowerCase() + '">' + markerIcon + '</i>');

    return markers
  },
  addNewMarker: function(user, map){
    var self = this
    var markerIcon = (user.profile.status == 'Online' ? 'directions_walk' :
    (user.profile.status == 'Recording' ? 'directions_run': 'person_pin_circle'));
    var colorIcon = (user.profile.status == 'Online' ? 'online' :
    (user.profile.status == 'Recording' ? 'recording': 'offline'));

    var marker = new MarkerWithLabel({
      name: user.profile.name,
      position: {
        lat: user.profile.lastPosition.lat,
        lng: user.profile.lastPosition.lng
      },
      icon: ' ',
      labelAnchor: new google.maps.Point(20,25),
      map: map,
      labelContent: '<i style="font-size:40px" class="material-icons ' + colorIcon + '">' + markerIcon + '</i>'
    });

    marker.addListener('click', function() {
      self.props.clickMarker(user.profile.name)
      var infowindow = self.state.infowindow
      infowindow.close();
      infowindow.setContent(user.profile.name)
      infowindow.open(map, this);
    });

    return marker
  },
  componentDidMount() {
    var users = this.data.users
    var markers = this.state.markers
    var self = Meteor.user()
    var thisObj = this

    var map = new google.maps.Map(document.getElementById('map'), this.props.options)

    var marker = new MarkerWithLabel({
      name: self.profile.name,
      position: map.center,
      icon: ' ',
      map: map,
      labelAnchor: new google.maps.Point(20,25),
      labelContent: '<i style="font-size:40px" class="material-icons self">accessibility</i>'
    });

    marker.addListener('click', function() {
      thisObj.props.clickMarker(self.profile.name)
      map.panTo({lat: self.profile.lastPosition.lat, lng: self.profile.lastPosition.lng})
      map.setZoom(thisObj.props.options.zoom-3)

      var infowindow = thisObj.state.infowindow
      infowindow.close();
      infowindow.setContent(self.profile.name);
      infowindow.open(map, this);
    });

    for(i in users){
      markers.push(this.addNewMarker(users[i], map));
    }
    this.setState({selfMarker: marker, markers: markers, users: users, map: map})
  },
  componentWillUpdate(nextProps, nextState) {
    var oldUsers = this.state.users
    var newUsers = this.data.users;
    var markers = this.state.markers  //[MarkerWithLabel, ..., MarkerWithLabel]
    var map = this.state.map;
    var polylines = this.state.polylines; //{Bay: polylines}
    //Update position and status of icons on map
    for(var i = 0; i < markers.length; i++) {
      markers = this.updateMarker(i, newUsers, markers);
      //Update polyline in maps
      switch(newUsers[i].status) {
        case "Online":
          if(oldUsers[i].status == "Recording") {
            //Remove Polyline from maps
            polylines[newUsers[i].name].setMap(null)
            delete polylines[newUsers[i].name]
            this.setState({polylines: polylines});
          }
          break;
        case "Recording":
          if(oldUsers[i].status == "Online"){
            //Create Polyline
            var lastTrail = newUsers[i].profile.trails.length-1
            var poly = new google.maps.Polyline({
              strokeColor: '#000000',
              strokeOpacity: 1.0,
              strokeWeight: 3,
              path: newUsers[i].profile.trails[lastTrail].positionList
            });
            poly.setMap(GoogleMaps.maps[this.props.name].instance);
            polylines[newUsers[i].name] = poly
            this.setState({polylines: polylines});
          }
          else if(oldUsers[i].status == "Recording"){
            //Update Polyline Length
            var lastTrail = newUsers[i].profile.trails.length-1;
            var path = newUsers[i].profile.trails[lastTrail].positionList;
            polylines[newUsers[i].name].setPath(path);
            this.setState({polylines: polylines});
          }
          break;
        default:
            console.log("No Update")
      }
    }

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
          lat: oldNewUser[i].profile.lastPosition.lat,
          lng: oldNewUser[i].profile.lastPosition.lng
        })
        map.setZoom(nextProps.options.zoom-3);

        //Open short infowindow and close it after a while
        var infowindow = new google.maps.InfoWindow({
          content: oldNewUser[i].profile.name+" has just joined!"
        });
        infowindow.open(map, newMarker);
        setTimeout(function(){
          infowindow.close()
        }, 5000);

        markers.push(newMarker);
      }
      this.setState({users: newUsers, markers: markers})
    }
    else if(oldUsers.length > newUsers.length) {
      //Remove old marker from map
      for(i in oldNewUser){
        var filteredMarkers = markers.filter(function(marker){
          return marker.name == oldNewUser[i].profile.name
        })
        var removedMarker = markers.splice(markers.indexOf(filteredMarkers[0]), 1)
        removedMarker[0].setMap(null);
      }
      this.setState({users: newUsers, markers: markers})
    }

    //Icon or User item menu clicked
    if(nextProps.filter != this.props.filter){
      var infowindow = this.state.infowindow
      var user = this.data.self
      var marker = this.state.selfMarker

      if(nextProps.filter != this.data.self.profile.name) {
        var userResult = newUsers.filter(function(user) {
          return user.profile.name == nextProps.filter;
        });
        user = userResult[0]

        var markerResult = markers.filter(function(marker) {
          return marker.name == nextProps.filter
        });
        marker = markerResult[0]
      }

      map.panTo({lat: user.profile.lastPosition.lat, lng: user.profile.lastPosition.lng})
      map.setZoom(nextProps.options.zoom-3)

      //Open infowindow when the marker is selected
      infowindow.close();
      infowindow.setContent(nextProps.filter);
      infowindow.open(map, marker);
    }
  },
  //   /*

  //     // New       Old
  //     // Online -> Online -> Update Marker Position
  //     //        -> Recording -> Update Marker Position
  //     //                     -> Change To Online Icon
  //     //                     -> Remove Polyline from maps
  //     //        -> Offline -> Update Marker Position
  //     //                   -> Change To Online Icon
  //     //
  //     // Recording -> Online -> Update Marker Position
  //     //                     -> Change To Recording Icon
  //     //                     -> Create Polyline
  //     //           -> Recording -> Update Marker Position
  //     //                        -> Update Polyline length
  //     //           -> Offline -> Update Marker Position
  //     //                      -> Change To Recording Icon
  //     //
  //     // Offline -> Online -> Update Marker Position
  //     //                   -> Change To Offline Icon
  //     //         -> Recording -> Update Marker Position
  //     //                      -> Change To Offline Icon
  //     //         -> Offline -> Do Nothing
  //

  componentWillUnmount() {
    if(this.state.map){
      google.maps.event.clearInstanceListeners(this.state.map)
      this.setState({map:''});
    }
  },
  render() {
    return <div id="map" className="map-container"></div>;
  }
});
