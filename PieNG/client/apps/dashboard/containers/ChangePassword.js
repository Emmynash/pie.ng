import React, { Component } from 'react'
import PropTypes from 'prop-types'
import formSerializer from 'form-serialize'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import { resetPassword, setTitle } from '../actions'
import { getIsWorking, getPageName } from '../reducers'
import * as auth from '../../../utils/user'
import ResetPassForm from '../components/account/reset'
// import config from '../../../config/config.client'
import Loading from '../components/app/loading'

// Images
import logo from '../../../assets/images/logo.png'
import backgroundImage from '../../../assets/images/bg-2.jpg'

class ChangePassword extends Component {
  
  static propTypes = {
    resetPassword: PropTypes.func.isRequired,
    setTitle: PropTypes.func.isRequired,
    pageName: PropTypes.string.isRequired,
    isWorking: PropTypes.bool.isRequired
  }
  
  constructor(props) {
    super(props)
    this.handleResetPass = ::this.onSubmit
    this.props.setTitle('Change Account Password')
  }
  
  onSubmit(e) {
    e.preventDefault()
    const formData = formSerializer(e.target, { hash: true })
    this.props.resetPassword(formData)
  }
  
  render() {
    let user = auth.getUser()
    return (
    <div>
      <Helmet title={this.props.pageName} />
      {this.props.isWorking && <Loading />}
      <div className="accountbg"  style={{background: `url(${backgroundImage})`, backgroundSize: 'cover'}}></div>
      <div className="wrapper-page account-page-full">
        <div className="card">
          <div className="card-block">
            <h3 className="text-center m-0">
              <Link to="/" className="logo logo-admin"><img src={logo} height="30" alt="logo" /></Link>
            </h3>
            <div className="p-3">
              <p className="text-muted text-center">Hello {user.name.split(' ')[0]}, change your password below</p>
              <ResetPassForm handleResetPass={this.handleResetPass} user={user} />
            </div>
          </div>
        </div>
        <div className="m-t-40 text-center">
          <p className="">Not sure? return <Link to="/dashboard/summary" className="font-500 font-14 font-secondary"> Home </Link> </p>
          <p className="">&copy; 2017 {config.appName/*global config*/}. A Logical Address Ltd Product</p>
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
    resetPassword: (password) => dispatch(resetPassword(password)),
    setTitle: (title) => dispatch(setTitle(title))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword)