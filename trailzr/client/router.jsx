const {Router, Route, IndexRoute, Redirect, history} = ReactRouter;

const browserHistory = history.createHistory();
//const history = ReactRouter.history.useQueries(ReactRouter.history.createHistory)()


// var requireAuth = function(nextState, replace) {
//   if (!Meteor.user()) {
//     console.log(nextState)
//     console.log(replace)
//     replace({
//       pathname: '/users',
//       state: { nextPathname: nextState.location.pathname },
//       query: { nextQuery: nextState.location.query}
//     })
//   }
// }

Meteor.startup(function() {
  ReactDOM.render((
    <Router history={browserHistory}>
      <Route path="/" component={AppBody}>
        <IndexRoute name="Home" component={Home}/>
        <Route name="other" path="/users" component={UserList} />
        <Route name="settings" path="/settings" component={Settings} />
        <Route name="notFound" path="*" component={AppNotFound} />
      </Route>
    </Router>
  ), document.getElementById('app'));
});
