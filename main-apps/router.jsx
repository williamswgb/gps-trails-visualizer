var homeRoutes = FlowRouter.group({
  prefix: '/home',
  name: 'home',
});

homeRoutes.route('/:username', {
  triggersEnter: [function(context, redirect) {
    var path = context.path
    if(Meteor.userId() != null){
      FlowRouter.go(path);
    } else{
      FlowRouter.go('/login')
    }
  }],
  action: function(){
    var geoOptions = {
      //  timeout: 60,
       enableHighAccuracy: true,
       maximumAge: 900
     }

    var geoSuccess = function(position) {
      // alert('Lat: '+position.coords.latitude+'\nLng: '+position.coords.longitude);

      var mapOptions = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        zoom: 17,
      };

      var geocoder = new google.maps.Geocoder;

      geocoder.geocode({'location': {lat: mapOptions.lat, lng: mapOptions.lng}},
       function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          if (results[1]) {
            var lengthAddress = results[1].address_components.length
            var location = results[1].address_components[0].short_name
              + ', ' + results[1].address_components[lengthAddress-1].long_name

            ReactLayout.render(App, {
              mapOptions: mapOptions,
              location: location
            });
          } else {
            window.alert('No results found');
          }
        } else {
          window.alert('Geocoder failed due to: ' + status);
        }
      });
    };

    var geoError = function(error) {
      alert('Error occurred. Error code: ' + error.code);
      // error.code can be:
      //   0: unknown error
      //   1: permission denied
      //   2: position unavailable (error response from location provider)
      //   3: timed out
    };

    navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);

    // var watchID = navigator.geolocation.watchPosition(geoSuccess, geoError, geoOptions);
    // console.log(watchID)
  }
});

var loginRoutes = FlowRouter.route('/login',{
  action: function(){
    ReactLayout.render(Login, {});
    // if(!session.name){
    //   redirect to login page
    // }
  }
});
