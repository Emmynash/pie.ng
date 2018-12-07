import React, { Component } from 'react'
import PropTypes from 'prop-types'
import formSerializer from 'form-serialize'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import { signup, setTitle } from '../actions'
import { getIsWorking, getPageName } from '../reducers'
import SignUpForm from '../components/account/signup'
// import config from '../../../config/config.client'
import Loading from '../components/app/loading'

// Images
import logo from '../../../assets/images/logo.png'
import backgroundImage from '../../../assets/images/bg-6.jpg'


class SignUp extends Component {
  
  static propTypes = {
    signup: PropTypes.func.isRequired,
    setTitle: PropTypes.func.isRequired,
    pageName: PropTypes.string.isRequired
  }
  
  static contextTypes = {
    router: PropTypes.object.isRequired
  }
  
  constructor(props, context) {
    super(props, context)
    this.handleRegistration = ::this.onSubmit
    this.props.setTitle('User Registration')
  }
  
  onSubmit(e) {
    e.preventDefault()
    const formData = formSerializer(e.target, { hash: true })
    this.props.signup(formData, this.context.router.history)
  }
  
  render() {
    return (
    <div>
      {this.props.isWorking && <Loading />}
      <Helmet
        title={this.props.pageName} />
      <div className="accountbg" style={{background: `url(${backgroundImage}) center center fixed`, backgroundSize: 'cover'}}></div>
      <div className="wrapper-page account-page-full">
        <div className="card">
          <div className="card-block">
            <h3 className="text-center m-0">
              <Link to="/landing" className="logo logo-admin"><img src={logo} height="100" alt="logo" /></Link>
            </h3>
            <div className="p-3">
              <h4 className="text-muted font-18 m-b-5 text-center">Free Register</h4>
              <p className="text-muted text-center">Get your free {config.appName/*global config*/} account now.</p>
              <SignUpForm
                handleRegistration={this.handleRegistration} />
            </div>
          </div>
        </div>
        <div className="m-t-20 text-center">
          <p className="">
            Already have an account ? <Link to="/dashboard/account/signin" className="font-500 font-14 font-secondary"> Login </Link>
          </p>
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
    signup: (user, history) => dispatch(signup(user, history)),
    setTitle: title => dispatch(setTitle(title))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUp)