Users = new Mongo.Collection("userlist");

if (Meteor.isClient) {
  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });

  // This code is executed on the client only
  // Accounts.ui.config({passwordSignupFields: "USERNAME_ONLY"});

  // Meteor.startup(function() {
  //   // Use Meteor.startup to render the component after the page is ready
  //   React.render(<App/>, document.getElementById("render-target"));
  // });
}

Accounts.onLogin( () => {
  if (Meteor.isClient) {
    var profile = Meteor.user().profile
    profile.loginFrom = "Computer";
    profile.status = "Online";
    Meteor.users.update(Meteor.userId(), {$set: {profile: profile}})
    // if(profile.status == "Offline"){
    //   profile.loginFrom = "Computer";
    //   profile.status = "Online";
    //   Meteor.users.update(Meteor.userId(), {$set: {profile: profile}})
    // }

    var GeolocationCallback = function(position) {
      var geocoder = new google.maps.Geocoder;
      geocoder.geocode({'location': {lat: position.coords.latitude, lng: position.coords.longitude}},
       function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          if (results[1]) {
            var lengthAddress = results[1].address_components.length
            var location = results[1].address_components[0].short_name
              + ', ' + results[1].address_components[lengthAddress-1].long_name

            var profile = Meteor.user().profile;
            var d = new Date();
            profile.lastLocation = location;
            profile.lastPosition = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
            profile.lastSeen =  d.toString();

            if(profile.status == "Recording"){
              var lastTrail = profile.trails.length-1
              profile.trails[lastTrail].positionList.push({
                lat: position.coords.latitude,
                lng: position.coords.longitude
              });
            }
            Meteor.users.update(Meteor.userId(), {$set: {profile: profile}});

            console.log("Done")
            Session.set('lat', position.coords.latitude);
            Session.set('lng', position.coords.longitude);
            Session.set('address', location);
          } else {
            window.alert('No results found');
          }
        } else {
          console.log('Geocoder failed due to: ' + status);
        }
      });
    };

    var error = function (err) {
      console.warn('ERROR(' + err.code + '): ' + err.message);
    };

    var geoOptions = {
       enableHighAccuracy: true,
       maximumAge: 20000
    }

    // one time call to get the location
    // GeolocationFG.get(GeolocationCallback);

    // auto-re-run by Cordova every ~30000 ms (30 sec)
    this.watchId = Meteor.setInterval(function(){
      navigator.geolocation.getCurrentPosition(GeolocationCallback, error, geoOptions);
    }, 10000);

    let path = FlowRouter.current().path
    return FlowRouter.go('/home/'+Meteor.userId());
    //return (path !== '/login' ? FlowRouter.go( '/home' ) : FlowRouter.go( '/home' ));
  }
});
