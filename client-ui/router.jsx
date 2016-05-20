// handling /trails
// var trailsRoutes = FlowRouter.group({
//   prefix: '/trails',
//   name: 'trails',
// });

// handling /trails/:username
var userRoutes = FlowRouter.group({
    prefix: "/:username",
    name: "user"
});

// handling /trails/:username/:userID
userRoutes.route('/:trailsID', {
  action: function(params) {
    /*
    Find the trails using the username and trailsID
    console.log(params);
    console.log(params.username);
    console.log(params.trailsID);
    */
    //Passing the map options parameter
    var mapOptions = {
      lat: 1.3431824453335746,
      lng: 103.69153617919926,
      zoom: 14,
      points: {
        startPoint:{lat:1.3499800000000002, lng:103.68092999999999},
        endPoint:{lat:1.33755, lng:103.69686000000002},
        lookAtPoint:{lat:1.3431824453335746, lng:103.69153617919926}
      },
      username: params.username,
      trailsID: params.trailsID,
    };

    ReactLayout.render(App, {
      map: <MyTestMap mapOptions={mapOptions}/>
    });
  }
});
