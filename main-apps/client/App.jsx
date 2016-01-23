App = React.createClass({
  mixins: [ReactMeteorData],
  
  getMeteorData() {
    return {
      userList: this._userList()
    }
  },
  _userList() {
    return [
      {
        name: 'Bay',
        status: 'Online',
        loginFrom: 'Mobile',
        lastLocation: 'NTU',
        lastPosition: {lat: '', lng: ''},
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
        lastPosition: {lat: '', lng: ''},
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
        lastPosition: {lat: '', lng: ''},
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
        lastPosition: {lat: '', lng: ''},
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
        lastPosition: {lat: '', lng: ''},
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
        lastPosition: {lat: '', lng: ''},
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
        lastPosition: {lat: '', lng: ''},
        lastSeen: '',
        trails: [{
          url: '',
          lengthOfDistance: 22,
          recordedTime: ''
        }]
      },
    ]
  },
  render() {
    return <div>
      <UIApp userList={this.data.userList} />
      {this.props.map}
    </div>;
  }
});

MyTestMap = React.createClass({
  // This mixin makes the getMeteorData method work
  mixins: [ReactMeteorData],


  componentDidMount() {
    GoogleMaps.load();
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
      mapOptions: GoogleMaps.loaded() && this._mapOptions()
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
      return <GoogleMap name="mymap" options={this.data.mapOptions} />;

    return <div>Loading map...</div>;
  }
});

GoogleMap = React.createClass({
  propTypes: {
    name: React.PropTypes.string.isRequired,
    options: React.PropTypes.object.isRequired
  },
  componentDidMount() {
    GoogleMaps.create({
      name: this.props.name,
      element: ReactDOM.findDOMNode(this),
      options: this.props.options
    });

    GoogleMaps.ready(this.props.name, function(map) {
      var marker = new google.maps.Marker({
        position: map.options.center,
        map: map.instance
      });
    });
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
