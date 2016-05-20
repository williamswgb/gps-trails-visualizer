Map = React.createClass({
  // This mixin makes the getMeteorData method work
  mixins: [ReactMeteorData],
  getMeteorData() {
    return {
      mapOptions: this._mapOptions(),
      users: Meteor.users.find({_id:{$ne:Meteor.userId()}}).fetch(),
      filter: this.props.filter,
    };
  },
  _mapOptions() {
    var map = this.props.mapOptions
    return {
      center: new google.maps.LatLng(map.lat, map.lng),
      zoom: map.zoom,
      disableDefaultUI: true,
    };
  },
  render() {
    return <GoogleMap
      name="mymap"
      options={this.data.mapOptions}
      users={this.data.users}
      filter={this.data.filter}
      clickMarker={this.props.clickMarker}
      />;
  }
});
