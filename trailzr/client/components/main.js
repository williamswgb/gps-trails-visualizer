Meteor.startup(function(){
  if (Meteor.isCordova) {
    Template.socialShareBasic.helpers({
      opts: function() {
        var userId = Meteor.user()._id
        var trailId = Meteor.user().profile.trails.length
        var opts ={
          email: true,
          facebook: true,
          gmail: true,
          googlePlus: true,
          twitter: true,
          shareData: {
            defaultShareText: "I've just finished running along this trail. Check this out to see the view around it!",
            url: 'http://192.168.0.101:3000/'+userId+'/'+trailId,
            facebookAppId: '260760164254977',
            subject: 'GPS Trail Visualizer',
            body: "I've just finished running along this trail. Check this out to see the view around it!",
            redirectUrl: 'http://192.168.0.101:3000'
          }

        };
        return opts;
      }
    });

    Accounts.onLogin(function(){
      //  window.alert("Login");
       var profile = Meteor.user().profile
       if(profile.status == "Offline"){
         profile.loginFrom = "Mobile";
         profile.status = "Online";
         Meteor.users.update(Meteor.userId(), {$set: {profile: profile}})
       }

      //here we are starting the service each 1 minute
      // GeolocationBG.start()
      //  Meteor.setInterval(function(){
      //   GeolocationBG.start();
      //   Session.set('geoStart',true); //Trigger a Session when the service start
      //  }, 60000);

       // callback function which has a location object argument
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

              Session.set('lat', position.coords.latitude);
              Session.set('lng', position.coords.longitude);
              Session.set('address', location);
              window.alert('Done');
            } else {
              window.alert('No results found');
            }
          } else {
            console.log('Geocoder failed due to: ' + status);
          }
        });
      };

      var geoOptions = {
         enableHighAccuracy: true,
         maximumAge: 20000
      }

      // one time call to get the location
      // GeolocationFG.get(GeolocationCallback);

      // auto-re-run by Cordova every ~30000 ms (30 sec)
      this.watchId = Meteor.setInterval(function(){
         GeolocationFG.get(GeolocationCallback, geoOptions)
      }, 10000);

      // GeolocationFG.get(function(location) {
      //   GeoLog.insert({
      //     location: location,
      //     uuid: GeolocationBG.uuid(),
      //     device: GeolocationBG.device(),
      //     userId: Meteor.userId(),
      //     created: new Date()
      //   });
      // });

      //  var geoSuccess = function(position) {
      //    window.alert(position.coords.latitude, position.coords.longitude);
      // //    var geocoder = new google.maps.Geocoder;
      //  //
      // //    geocoder.geocode({'location': {lat: position.coords.latitude, lng: position.coords.longitude}},
      // //     function(results, status) {
      // //      if (status === google.maps.GeocoderStatus.OK) {
      // //        if (results[1]) {
      // //          var lengthAddress = results[1].address_components.length
      // //          var location = results[1].address_components[0].short_name
      // //            + ', ' + results[1].address_components[lengthAddress-1].long_name
      //  //
      // //          Session.set('lat', position.coords.latitude);
      // //          Session.set('lng', position.coords.longitude);
      // //          Session.set('address', location);
      // //          window.alert(Session.keys.address);
      // //        } else {
      // //          window.alert('No results found');
      // //        }
      // //      } else {
      // //        window.alert('Geocoder failed due to: ' + status);
      // //      }
      // //    });
      //  };
      //  //
      //  var geoError = function(error) {
      //    alert('Error occurred. Error code: ' + error.code);
      //    // error.code can be:
      //    //   0: unknown error
      //    //   1: permission denied
      //    //   2: position unavailable (error response from location provider)
      //    //   3: timed out
      //  };
      //
      //  this.intervalId = Meteor.setInterval(function(){
      //     navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);
      //  }, 15000);
    });
  }

  if(Meteor.isClient){
    Template.socialShareBasic.helpers({
      opts: function() {
        var userId = Meteor.user()._id
        var trailId = Meteor.user().profile.trails.length
        var opts ={
          email: true,
          facebook: true,
          gmail: true,
          googlePlus: true,
          twitter: true,
          shareData: {
            defaultShareText: "I've just finished running along this trail. Check this out to see the view around it!",
            url: 'http://192.168.0.101:3000/'+userId+'/'+trailId,
            facebookAppId: '260760164254977',
            subject: 'Trail 1',
            body: "I've just finished with my trails. Take a look on the view around it here.",
            redirectUrl: 'http://192.168.0.101:3000'
          }

        };
        return opts;
      }
    });

    Accounts.onLogin(function(){
      var profile = Meteor.user().profile
      if(profile.status == "Offline"){
        profile.loginFrom = "Mobile";
        profile.status = "Online";
        Meteor.users.update(Meteor.userId(), {$set: {profile: profile}})
      }

      var geoOptions = {
         enableHighAccuracy: true,
         maximumAge: 20000
      }

      var geoSuccess = function(position) {
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

              Session.set('lat', position.coords.latitude);
              Session.set('lng', position.coords.longitude);
              Session.set('address', location);
              console.log("Done")
            } else {
              window.alert('No results found');
            }
          } else {
            console.log('Geocoder failed due to: ' + status);
          }
        });
      };

      var geoError = function(error) {
        //alert('Error occurred. Error code: ' + error.code);
        // error.code can be:
        //   0: unknown error
        //   1: permission denied
        //   2: position unavailable (error response from location provider)
        //   3: timed out
      };

      this.watchId = Meteor.setInterval(function(){
         navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);
      }, 10000);
    });
  }
});
