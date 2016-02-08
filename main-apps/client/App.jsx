App = React.createClass({
  mixins: [ReactMeteorData],

  getInitialState(){
    return {
      filter: '',
      marker: ''
    }
  },
  getMeteorData() {
    return {
      self:{
        name: 'William',
        status: 'Online',
        loginFrom: 'Mobile',
        lastLocation: 'Jakarta',
        lastPosition: {
          lat: this.props.mapOptions.lat,
          lng: this.props.mapOptions.lng
        },
        lastSeen: 'Sun Feb 07 2016 23:46:08 GMT+0700 (WIB)',
        trails: [{
          name: 'Trail 1',
          url: '',
          calories: 300,
          distances: 22,
          time: 'Sun Feb 07 2016 22:31:57 GMT+0700 (WIB)'
        },
        {
          name: 'Trail 2',
          url: '',
          calories: 240,
          distances: 18,
          time: 'Sun Feb 07 2016 22:31:57 GMT+0700 (WIB)'
        }
        ]
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
        trails: []
      },
      {
        name: 'Cay',
        status: 'Online',
        loginFrom: 'Computer',
        lastLocation: 'NTU',
        lastPosition: {lat: 1.28687, lng: 103.82670},
        lastSeen: '',
        trails: []
      },
      {
        name: 'Day',
        status: 'Recording',
        loginFrom: 'Smartwatch',
        lastLocation: 'NTU',
        lastPosition: {lat: 1.34179, lng: 103.81091},
        lastSeen: '',
        trails: []
      },
      {
        name: 'Fay',
        status: 'Offline',
        loginFrom: '',
        lastLocation: 'NTU',
        lastPosition: {lat: 1.32668, lng: 103.72851},
        lastSeen: '',
        trails: []
      },
      {
        name: 'Hay',
        status: 'Online',
        loginFrom: 'Computer',
        lastLocation: 'NTU',
        lastPosition: {lat: 1.33012, lng: 103.93382},
        lastSeen: '',
        trails: []
      },
      {
        name: 'Jay',
        status: 'Recording',
        loginFrom: 'Mobile',
        lastLocation: 'NTU',
        lastPosition: {lat: 1.30884, lng: 103.91047},
        lastSeen: '',
        trails: []
      },
      {
        name: 'Kay',
        status: 'Offline',
        loginFrom: '',
        lastLocation: 'NTU',
        lastPosition: {lat: 1.31639, lng: 103.77383},
        lastSeen: '',
        trails: []
      },
      {
        name: 'Lay',
        status: 'Offline',
        loginFrom: '',
        lastLocation: 'Central Water Catchment, Singapore',
        lastPosition: {lat: 1.399480, lng: 103.796082},
        lastSeen: 'Sun Feb 07 2016 23:52:35 GMT+0700 (WIB)',
        trails: [{
          name: 'Trail 1',
          url: '',
          calories: 300,
          distances: 22,
          time: 'Sun Feb 07 2016 22:31:57 GMT+0700 (WIB)'
        },
        {
          name: 'Trail 2',
          url: '',
          calories: 240,
          distances: 18,
          time: 'Sun Feb 07 2016 22:31:57 GMT+0700 (WIB)'
        }]
      },
    ]
  },
  handleFilterMarker: function(marker){
    this.setState({filter:marker})
  },
  handleClickMarker: function(name){
    this.setState({marker:name})
  },
  componentDidMount(){
    this.setState({marker: this.data.self.name})
  },
  render() {
    return <div>
      <UIApp filterMarker={this.handleFilterMarker} self={this.data.self} marker={this.state.marker} clickMarker={this.handleClickMarker}/>
      <Map mapOptions={this.props.mapOptions} filter={this.state.filter} clickMarker={this.handleClickMarker} self={this.data.self}/>
    </div>;
  }
});
