Meteor.subscribe("userData");

UserList = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    let userList
    if(Meteor.user()){
      userList = Meteor.users.find({_id:{$ne:Meteor.user()._id}})
    }
    else{
      userList = Meteor.users.find()
    }
    return {
      self: Meteor.user(),
      users: userList.fetch()
    }
  },
  render() {
    let list = this.data.users.map(function(user) {
      return (
        <div className="item item-avatar" key={user._id}>
          <img src={user.profile.avatar}></img>
          <h2>{user.profile.name}</h2>
          <p>{user.profile.email}</p>
        </div>
      )
    })
    return (
      <div className="list">
        {list}
      </div>
    )
  }
});
