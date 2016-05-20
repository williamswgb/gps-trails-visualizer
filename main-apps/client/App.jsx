App = React.createClass({
  mixins: [ReactMeteorData],

  getInitialState(){
    return {
      filter: Meteor.user().profile.name,
      marker: ''
    }
  },
  getMeteorData() {
    return {
      // self: Meteor.user(),
    }
  },
  handleFilterMarker: function(marker){
    this.setState({filter:marker})
  },
  handleClickMarker: function(name){
    this.setState({marker:name})
  },
  // componentDidMount(){
  //   this.setState({marker: this.data.self.profile.name})
  // },
  render() {
    return <div>
      <UIApp filterMarker={this.handleFilterMarker} marker={this.state.marker} clickMarker={this.handleClickMarker}/>
      <Map mapOptions={this.props.mapOptions} filter={this.state.filter} clickMarker={this.handleClickMarker}/>
    </div>;
  }
});
