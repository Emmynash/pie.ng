import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import formSerializer from 'form-serialize'

import { getPageName } from '../reducers'
import { walletTransfer, setTitle } from '../actions'

class Transfer extends Component {
  
  static propTypes = {
    walletTransfer: PropTypes.func.isRequired,
    setTitle: PropTypes.func.isRequired,
    store: PropTypes.object.isRequired,
    pageName: PropTypes.string.isRequired
  }
  
  static contextTypes = {
    router: PropTypes.object.isRequired
  }
  
  constructor(props, context) {
    super(props, context)
    this.props.setTitle('Transfer Funds')
    this.state = {
      amount: '', targetWalletPhone: ''
    }
  }
  
  transfer(e) {
    e.preventDefault()
    const formData = formSerializer(e.target, { hash: true })
    this.props.walletTransfer(formData)
  }
  
  updateAmount(e) {
    let amount = e.target.value.replace(/[^\d.]/g, '')
    this.setState({ amount })
  }
  
  updatePhone(e) {
    let targetWalletPhone = e.target.value.replace(/[^\d]/g, '')
    this.setState({ targetWalletPhone })
  }
  
  render() {
    return (
    <div className="container">
      <Helmet title={this.props.pageName} />
      <div className="row">
        <Helmet title="Fund Transfer" />
        <div className="col-md-12 col-lg-4 col-xl-4">
          <div className="card m-b-20">
            <div className="card-block">
              <h4 className="mt-0 header-title">Transfer Funds Between Wallets</h4>
              <p className="text-muted m-b-30 font-14">Transfer between two wallets by simply entering the phone number of the wallet you wish to transfer to below</p>
              <form onSubmit={(e) => this.transfer(e)}>
                <div className="form-group">
                  <label htmlFor="targetWalletPhone">Target Phone</label>
                  <input type="text" className="form-control" id="targetWalletPhone" name="targetWalletPhone" value={this.state.targetWalletPhone} onChange={(value) => this.updatePhone(value)} />
                </div>
                <div className="form-group">
                  <label htmlFor="amount">Amount (Naira)</label>
                  <input type="text" className="form-control" id="amount" name="amount" value={this.state.amount} onChange={(value) => this.updateAmount(value)} />
                </div>
                <div className="form-group row m-t-20">
                  <div className="col-sm-12 text-right">
                    <button type="submit" className="btn btn-primary waves-effect waves-light">Transfer</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    )
  }
}

const mapStateToProps = (store) => {
  return {
    store,
    pageName: getPageName(store)
  }
}

const mapDispatchToProps = (dispatch) => ({
  walletTransfer: (transferData) => dispatch(walletTransfer(transferData)),
  setTitle: title => dispatch(setTitle(title))
})

export default connect(mapStateToProps, mapDispatchToProps)(Transfer)