var homeRoutes = FlowRouter.group({
  prefix: '/home',
  name: 'home',
});

homeRoutes.route('/:username', {
  action: function(){
    // var handle = Tracker.autorun(function () {
    //   var latLng = Geolocation.latLng();
    //   if(latLng != null){
    //     alert('Lat: '+latLng.lat+'\nLng: '+latLng.lng);
    //     console.log('Lat: '+latLng.lat+'\nLng: '+latLng.lng);
    //   }
    // });
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

      ReactLayout.render(App, {
        map: <MyTestMap mapOptions={mapOptions}/>
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

var recordRoutes = FlowRouter.group({
  prefix: '/record',
  name: 'record',
});

recordRoutes.route('/:username',{
  action: function(){
    // if(!session.name){
    //   redirect to login page
    // }
  }
});
