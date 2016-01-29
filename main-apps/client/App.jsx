App = React.createClass({
  mixins: [ReactMeteorData],

  getInitialState(){
    return {
      filter: ''
    }
  },
  getMeteorData() {
    return {
      userList: this._userList(),
      self: {
        lat: this.props.mapOptions.lat,
        lng: this.props.mapOptions.lng
      }
    }
  },
  _userList() {
    return [
      {
        name: 'Bay',
        status: 'Online',
        loginFrom: 'Mobile',
        lastLocation: 'NTU',
        lastPosition: {lat: 1.31295, lng: 103.79855},
        lastSeen: '',
        trails: [{
          url: '',
          lengthOfDistance: 22,
          recordedTime: ''
        }]
      },
      {
        name: 'Cay',
        status: 'Online',
        loginFrom: 'Computer',
        lastLocation: 'NTU',
        lastPosition: {lat: 1.28687, lng: 103.82670},
        lastSeen: '',
        trails: [{
          url: '',
          lengthOfDistance: 22,
          recordedTime: ''
        }]
      },
      {
        name: 'Day',
        status: 'Recording',
        loginFrom: 'Smartwatch',
        lastLocation: 'NTU',
        lastPosition: {lat: 1.34179, lng: 103.81091},
        lastSeen: '',
        trails: [{
          url: '',
          lengthOfDistance: 22,
          recordedTime: ''
        }]
      },
      {
        name: 'Fay',
        status: 'Offline',
        loginFrom: '',
        lastLocation: 'NTU',
        lastPosition: {lat: 1.32668, lng: 103.72851},
        lastSeen: '',
        trails: [{
          url: '',
          lengthOfDistance: 22,
          recordedTime: ''
        }]
      },
      {
        name: 'Hay',
        status: 'Online',
        loginFrom: 'Computer',
        lastLocation: 'NTU',
        lastPosition: {lat: 1.33012, lng: 103.93382},
        lastSeen: '',
        trails: [{
          url: '',
          lengthOfDistance: 22,
          recordedTime: ''
        }]
      },
      {
        name: 'Jay',
        status: 'Recording',
        loginFrom: 'Mobile',
        lastLocation: 'NTU',
        lastPosition: {lat: 1.30884, lng: 103.91047},
        lastSeen: '',
        trails: [{
          url: '',
          lengthOfDistance: 22,
          recordedTime: ''
        }]
      },
      {
        name: 'Kay',
        status: 'Offline',
        loginFrom: '',
        lastLocation: 'NTU',
        lastPosition: {lat: 1.31639, lng: 103.77383},
        lastSeen: '',
        trails: [{
          url: '',
          lengthOfDistance: 22,
          recordedTime: ''
        }]
      },
    ]
  },
  handleFilterMarker: function(marker){
    this.setState({filter:marker})
  },
  render() {
    return <div>
      <UIApp userList={this.data.userList} filterMarker={this.handleFilterMarker} self={this.data.self}/>
      <MyTestMap mapOptions={this.props.mapOptions} filter={this.state.filter}/>
    </div>;
  }
});

MyTestMap = React.createClass({
  // This mixin makes the getMeteorData method work
  mixins: [ReactMeteorData],


  componentDidMount() {
    GoogleMaps.load();
  },

  _userList() {
    return [
      {
        name: 'Bay',
        status: 'Online',
        loginFrom: 'Mobile',
        lastLocation: 'NTU',
        lastPosition: {lat: 1.31295, lng: 103.79855},
        lastSeen: '',
        trails: [{
          url: '',
          lengthOfDistance: 22,
          recordedTime: ''
        }]
      },
      {
        name: 'Cay',
        status: 'Online',
        loginFrom: 'Computer',
        lastLocation: 'NTU',
        lastPosition: {lat: 1.28687, lng: 103.82670},
        lastSeen: '',
        trails: [{
          url: '',
          lengthOfDistance: 22,
          recordedTime: ''
        }]
      },
      {
        name: 'Day',
        status: 'Recording',
        loginFrom: 'Smartwatch',
        lastLocation: 'NTU',
        lastPosition: {lat: 1.34179, lng: 103.81091},
        lastSeen: '',
        trails: [{
          url: '',
          lengthOfDistance: 22,
          recordedTime: ''
        }]
      },
      {
        name: 'Fay',
        status: 'Offline',
        loginFrom: '',
        lastLocation: 'NTU',
        lastPosition: {lat: 1.32668, lng: 103.72851},
        lastSeen: '',
        trails: [{
          url: '',
          lengthOfDistance: 22,
          recordedTime: ''
        }]
      },
      {
        name: 'Hay',
        status: 'Online',
        loginFrom: 'Computer',
        lastLocation: 'NTU',
        lastPosition: {lat: 1.33012, lng: 103.93382},
        lastSeen: '',
        trails: [{
          url: '',
          lengthOfDistance: 22,
          recordedTime: ''
        }]
      },
      {
        name: 'Jay',
        status: 'Recording',
        loginFrom: 'Mobile',
        lastLocation: 'NTU',
        lastPosition: {lat: 1.30884, lng: 103.91047},
        lastSeen: '',
        trails: [{
          url: '',
          lengthOfDistance: 22,
          recordedTime: ''
        }]
      },
      {
        name: 'Kay',
        status: 'Offline',
        loginFrom: '',
        lastLocation: 'NTU',
        lastPosition: {lat: 1.31639, lng: 103.77383},
        lastSeen: '',
        trails: [{
          url: '',
          lengthOfDistance: 22,
          recordedTime: ''
        }]
      },
    ]
  },
  // Loads items from the Collection and puts them on this.data.tasks
  getMeteorData() {
    /*
    Get all active user from DB and get their location
    (Real time update lat lng)
    Display to the user

    */
    return {
      loaded: GoogleMaps.loaded(),
      mapOptions: GoogleMaps.loaded() && this._mapOptions(),
      userList: this._userList(),
      filter: this.props.filter
    };
    // let query = {};
    //
    // if (this.state.hideCompleted) {
    //   // If hide completed is checked, filter tasks
    //   query = {
    //     checked: {
    //       $ne: true
    //     }
    //   };
    // }
    //
    // return {
    //   tasks: Tasks.find(query, {sort: {createdAt: -1}}).fetch(),
    //   incompleteCount: Tasks.find({checked: {$ne: true}}).count(),
    //   currentUser: Meteor.user()
    // };
  },
  _mapOptions() {
    var map = this.props.mapOptions
    return {
      center: new google.maps.LatLng(map.lat, map.lng),
      zoom: map.zoom,
      disableDefaultUI: true,
      // scrollwheel: false,
      // draggable: false
    };
  },
  render() {
    if (this.data.loaded)
      return <GoogleMap name="mymap" options={this.data.mapOptions} userList={this.data.userList} filter={this.data.filter}/>;

    return <div>Loading map...</div>;
  }
});

GoogleMap = React.createClass({
  propTypes: {
    name: React.PropTypes.string.isRequired,
    options: React.PropTypes.object.isRequired
  },

  getInitialState() {
    return {
      markers: []
    }
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
           position: map.options.center,
           icon: ' ',
           map: map.instance,
           labelContent: '<i style="font-size:40px" class="material-icons self">accessibility</i>'
        });
        markers.push(marker);

        for(i in users){
          var markerIcon = (users[i].status == 'Online' ? 'directions_walk' :
          (users[i].status == 'Recording' ? 'directions_run': 'person_pin_circle'));
          var colorIcon = (users[i].status == 'Online' ? 'online' :
          (users[i].status == 'Recording' ? 'recording': 'offline'));

          var marker = new MarkerWithLabel({
             position: {
               lat: users[i].lastPosition.lat,
               lng: users[i].lastPosition.lng
             },
             icon: ' ',
             map: map.instance,
             labelContent: '<i style="font-size:40px" class="material-icons ' + colorIcon + '">' + markerIcon + '</i>'
             //labelContent: '<i class="material-icons online">directions_walk</i>'
             //labelContent: '<i class="material-icons recording">directions_run</i>'
            //  labelContent: '<i class="material-icons offline">person_pin_circle</i>'
          });
          markers.push(marker)
        }
        self.setState({markers: markers})
      });
    });
  },
  componentWillReceiveProps(nextProps, nextState) {
    //console.log(nextProps.filter)
    //console.log(GoogleMaps.maps[this.props.name])
    console.log(nextProps.options.zoom)
    var map = GoogleMaps.maps[this.props.name].instance
    map.panTo({lat: nextProps.filter.lat, lng: nextProps.filter.lng})
    map.setZoom(nextProps.options.zoom-3)
    //this.state.markers[0].setAnimation(google.maps.Animation.BOUNCE);
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

if (Meteor.isClient) {
  Meteor.startup(function() {
  });
}

if (Meteor.isServer) {

}
