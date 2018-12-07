import React, { Component } from 'react'
import PropTypes from 'prop-types'
import formSerializer from 'form-serialize'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { reverseTransaction } from '../actions'
import { getIsWorking } from '../reducers'
import * as auth from '../../../utils/user'
// import config from '../../../config/config.client'
import Loading from '../components/app/loading'

// Images
import logo from '../../../assets/images/logo.png'
import backgroundImage from '../../../assets/images/bg-2.jpg'

class ReverseTransaction extends Component {
  
  static propTypes = {
    reverseTransaction: PropTypes.func.isRequired,
  }
  
  constructor(props) {
    super(props)
    this.handleReversal = ::this.onSubmit
  }
  
  onSubmit(e) {
    e.preventDefault()
    const formData = formSerializer(e.target, { hash: true })
    this.props.reverseTransaction(formData)
  }
  
  render() {
    let user = auth.getUser()
    return (
    <div>
      {this.props.isWorking && <Loading />}
      <div className="accountbg"  style={{background: `url(${backgroundImage})`, backgroundSize: 'cover'}}></div>
      <div className="wrapper-page account-page-full">
        <div className="card">
          <div className="card-block">
            <h3 className="text-center m-0">
              <Link to="/" className="logo logo-admin"><img src={logo} height="30" alt="logo" /></Link>
            </h3>
            <div className="p-3">
              <p className="text-muted text-center">Hello {user.name.split(' ')[0]}, reverse a transaction below</p>
              <form className="form-horizontal m-t-30" onSubmit={this.handleReversal}>
                <div className="form-group">
                  <label htmlFor="transactionId">Transaction ID</label>
                  <input type="text" className="form-control" name="transactionId" id="transactionId" placeholder="Enter transaction ID" />
                </div>
                <div className="form-group">
                  <label htmlFor="rPassword">Reversal Password</label>
                  <input type="password" className="form-control" name="rPassword" id="rPassword" placeholder="Enter reversal password" />
                </div>
                <div className="form-group row m-t-20">
                  <div className="col-12 text-right">
                    <button className="btn btn-primary w-md waves-effect waves-light" type="submit">Reverse Transaction</button>
                  </div>
                </div>
              </form>
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
    isWorking: getIsWorking(state)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    reverseTransaction: (transaction) => dispatch(reverseTransaction(transaction))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReverseTransaction)