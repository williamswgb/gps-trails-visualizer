Accounts.onCreateUser(function(options, user) {
  // Add trails list
  user.trails = [];
  return user;
})

/*
Trails Object
{
  //Created at the beginning of record
  id: 1, //Based on how many number of trails object stored
  positionList: [{lat: , lng: }, {lat: , lng: },], //Keep changing after getting the lat lng data on the set interval
  startTime: 'Sun Feb 07 2016 22:31:57 GMT+0700 (WIB)',
  //Added after the record has been stopped
  endTime: 'Sun Feb 07 2016 22:31:57 GMT+0700 (WIB)'
  name: 'Trail 1',
  url: 'http://localhost:3000/William/1',
  calories: 300, //Calculate the calories based on the trails recorded
  distances: 22, //Calculate the distance based on the trails recorded

}
*/

if (Meteor.users.find().count() === 0) {
  Accounts.createUser({
    username: "samcorcos",
    password: "password",
    profile: {
      name: "Sam Corcos",
      status: 'Online', //Change when login
      loginFrom: 'Mobile', //Change when login from mobile
      // lastLocation: '', //Keep changing after getting the lat lng data on the set interval
      // lastPosition: {
      //   lat:,
      //   lng:  //Keep changing after getting the lat lng data on the set interval
      // },
      // lastSeen: '', //Keep changing after getting the lat lng data on the set interval
      email: "sam.corcos@gmail.com",
      avatar: "http://i.imgur.com/NqyBZSp.gif",
      trails: [],
    }
  })
  _.each(_.range(25), function(){
    Accounts.createUser({
      username: Random.hexString(10),
      password: Random.hexString(8),
      profile: {
        name: faker.name.findName(),
        email: faker.internet.email(),
        avatar: faker.internet.avatar()
      }
    })
  });
}

Meteor.publish("userData", function () {
  return Meteor.users.find({},
    {fields: {'profile':1}});
});
