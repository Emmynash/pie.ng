import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import $ from 'jquery'
import Helmet from 'react-helmet'
import Home from '../components/home'
import SignUp from './SignUp'
import Verify from './Verify'
import Login from './Login'//08061568434
import ChangePassword from './ChangePassword'
import Reversal from './Reversal'
import Dashboard from './Dashboard'
import NoMatch from '../components/nomatch'
import * as user from '../../../utils/user'
// import config from '../../../config/config.client'

import '../App.scss'

const PrivateRoute = ({ component: Component, authenticated, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => authenticated === true
        ? <Component {...props} />
        : <Redirect to={{pathname: '/dashboard/account/login', state: {from: props.location}}} />}
    />
  )
}

class App extends Component {
  
  render() {
    return (
      <div>
        <Helmet titleTemplate={`${config.appName/*global config*/} - %s`} />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/dashboard/account/login" component={Login} />
          <Route path="/dashboard/account/sign-up" component={SignUp} />
          <Route path="/dashboard/account/verify" component={Verify} />
          <PrivateRoute path="/dashboard/reverse/trnx/7f9299b0b20ebf85b79745f369affb947d73a8e7" authenticated={user.isLoggedIn()} component={Reversal} />
          <PrivateRoute path="/dashboard/account/change-password" authenticated={user.isLoggedIn()} component={ChangePassword} />
          <PrivateRoute path="/dashboard" authenticated={user.isLoggedIn()} component={Dashboard} />
          <Route component={NoMatch} />
        </Switch>
      </div>
    )
  }
}

export default App