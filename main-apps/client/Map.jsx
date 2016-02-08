Map = React.createClass({
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
      mapOptions: GoogleMaps.loaded() && this._mapOptions(),
      userList: Users.find().fetch(),
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
      return <GoogleMap
        name="mymap"
        options={this.data.mapOptions}
        userList={this.data.userList}
        filter={this.data.filter}
        clickMarker={this.props.clickMarker}
        />;

    return <div>Loading map...</div>;
  }
});
