import React, { Component } from 'react'
import PropTypes from 'prop-types'
import formSerializer from 'form-serialize'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import { verify } from '../actions/account'
import { getIsWorking } from '../reducers'
import VerifyForm from '../components/account/verify'
// import config from '../../../config/config.client'
import Loading from '../components/app/loading'

// Images
import logo from '../../../assets/images/logo.png'


class Verify extends Component {
  
  static propTypes = {
    verify: PropTypes.func.isRequired,
  }
  
  static contextTypes = {
    router: PropTypes.object.isRequired
  }
  
  constructor(props, context) {
    super(props, context)
    this.handleVerification = ::this.onSubmit
  }
  
  onSubmit(e) {
    e.preventDefault()
    const formData = formSerializer(e.target, { hash: true })
    this.props.verify(formData, this.context.router.history)
  }
  
  render() {
    return (
      <div>
      <Helmet title="Account Verification" />
        {this.props.isWorking && <Loading />}
        <div className="accountbg"></div>
        <div className="wrapper-page">
          <div className="card">
            <div className="card-block text-center">
              <h3 className="text-center m-0">
                <Link to="/" className="logo logo-admin"><img src={logo} height="100" alt="logo" /></Link>
              </h3>
              <div className="p-3">
                <h4 className="text-muted font-18 m-b-5 text-center">Verify {this.props.data.user.phone}</h4>
                <p className="text-muted text-center">Enter the verification code sent to </p>
                <VerifyForm handleVerification={this.handleVerification} phoneToVerify={this.props.data.user.phone} />
              </div>
            </div>
          </div>
          <div className="m-t-40 text-center">
            {/*
            <p className="text-white">Remember It ? <a href="pages-login.html" className="font-500 font-14 text-white font-secondary"> Sign In Here </a> </p>
            */}
            <p className="text-white">© 2017 {config.appName/*global config*/}. Made with <i className="mdi mdi-heart text-danger"></i> at nHub</p>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    data: state.suReducer,
    isWorking: getIsWorking(state)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    verify: (tokenObj, history) => dispatch(verify(tokenObj, history))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Verify)




