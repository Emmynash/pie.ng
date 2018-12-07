import React, { Component } from 'react'
import PropTypes from 'prop-types'
import formSerializer from 'form-serialize'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import { login, setTitle } from '../actions'
import { getIsWorking, getPageName } from '../reducers'
import LoginForm from '../components/account/login'
// import config from '../../../config/config.client'
import Loading from '../components/app/loading'

// Images
import logo from '../../../assets/images/logo.png'
import backgroundImage from '../../../assets/images/bg-8.jpg'
//http://windows10wall.com/wp-content/uploads/2013/10/twitter-funny-tweets.jpg

class SignUp extends Component {
  
  static propTypes = {
    login: PropTypes.func.isRequired,
  }
  
  static contextTypes = {
    router: PropTypes.object.isRequired
  }
  
  constructor(props, context) {
    super(props, context)
    this.handleLogin = ::this.onSubmit
    this.props.setTitle('Account Login')
  }
  
  onSubmit(e) {
    e.preventDefault()
    const formData = formSerializer(e.target, { hash: true })
    this.props.login(formData, this.context.router.history)
  }
  
  render() {
    return (
    <div>
      {this.props.isWorking && <Loading />}
      <Helmet
        title="Account Login" />
      <div className="accountbg" style={{background: `url(${backgroundImage}) no-repeat center center fixed`, backgroundSize: 'cover'}}></div>
      <div className="wrapper-page">
        <div className="card">
          <div className="card-block">
            <h3 className="text-center m-0">
              <Link to="/" className="logo logo-admin"><img src={logo} height="100" alt="logo" /></Link>
            </h3>
            <div className="p-3">
              <h4 className="text-muted font-18 m-b-5 text-center">Welcome Back !</h4>
              <p className="text-muted text-center">Sign in to continue to {config.appName/*global config*/}.</p>
              <LoginForm handleLogin={this.handleLogin} />
            </div>
          </div>
        </div>
        <div className="m-t-40 text-center">
          <p className="text-white">Don't have an account ? <Link to="/dashboard/account/sign-up" className="font-500 font-14 text-white font-secondary"> Signup Now </Link></p>
          <p className="text-white">© 2017 {config.appName}. LogicalAddress Ltd or its affiliates. All rights reserved</p>
        </div>
      </div>
    </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    data: state,
    isWorking: getIsWorking(state),
    pageName: getPageName(state)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    login: (user, history) => dispatch(login(user, history)),
    setTitle: (title) => dispatch(setTitle(title))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUp)