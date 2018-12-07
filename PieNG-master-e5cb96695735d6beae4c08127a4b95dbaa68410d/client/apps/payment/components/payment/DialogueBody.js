import React, { Component } from 'react'
import formSerializer from 'form-serialize'

import CardTab from './TabCard'
import BankTab from './TabBank'
import WalletTab from './TabWallet'

import Verification from './PsVerification'
import Final from './PsFinal'

import { isEmpty } from '../../../../utils/_'

const ErrorOccurred = ({ errors }) => {
  const errorMessage = errors.message.split('|')
  return (
  <div className="alert bg--error">
    { errorMessage.length > 1 ? <h4 className="alert-heading text-center">{errorMessage[0].toUpperCase()}</h4> : '' }
    <div className="alert__body text-center">
      <span>{ errorMessage.length > 1 ? errorMessage[1] : errorMessage[0] }</span>
    </div>
  </div>
  )
}

class DialogueBody extends Component {
  constructor(props) {
    super(props)
    this.handleSubmit = ::this.chargeCustomer
    this.handleAuthentication = ::this.authenticateCustomer
    this.state = {
      currentChannel: 'wallet',
      currentTab: WalletTab,
      unswitchable: false,
      paymentStep: 1,
      errors: {},
      transactionData: {},
      timeToClose: 5,
      amountPaid: 0
    }
  }
  
  getClassName(channel) {
    if(this.state.currentChannel === channel) {
      return 'active'
    }
    return ''
  }
  
  changeChannel(channel, tab) {
    if(!this.state.unswitchable) this.setState({ currentChannel: channel, currentTab: tab })
  }
  
  chargeCustomer(e) {
    e.preventDefault()
    const formData = formSerializer(e.target, { hash: true })
    const { loading } = this.props
    formData.chargeWith = this.state.currentChannel
    this.setState({ unswitchable: true })
    const formErors = {}
    if(this.state.currentChannel === 'card') {
      // Validate form
      if(!formData.CCname) {
        formErors['CCname'] = 'Cardholder\'s name is required'
      }
      if(!formData.CCnumber) {
        formErors['CCnumber'] = 'Card number is required for billing'
      }
      if(!formData.CCcvc) {
        formErors['CCcvc'] = 'Your card\'s CCV is required. CCV is the 3 digit number at the back of your card'
      }
      if(!formData.CCexpiry) {
        formErors['CCexpiry'] = 'Enter a valid expiry data for your CCV'
      }
    }
    if(this.state.currentChannel === 'account') {
      if(!formData.accName) {
        formErors['accName'] = 'Enter a valid account name'
      }
      if(!formData.accNumber) {
        formErors['accNumber'] = 'Enter a valid account name'
      }
      if(!formData.bankCode) {
        formErors['accNumber'] = 'Enter a valid account name'
      }
    }
    if(this.state.currentChannel === 'wallet') {
      if(!formData.phone) {
        formErors['phone'] = 'Enter your phone number'
      }
    }
    if(!formData.amount || !formData.email || !formData.publicKey) {
      formErors['submit'] = 'Invalid session. Please, close the dialog box and retry'
    }
    if(isEmpty(formErors)) {
      loading.showLoading()
      this.props.api.post('charge', formData).then(response => {
        if(response && response.status && response.status === 'success') {
          this.setState({ paymentStep: 2, transactionData: response.transaction })
        } else {
          this.setState({ unswitchable: false, errors: response })
        }
        loading.hideLoading()
      }).catch(e => {
        this.setState({ unswitchable: false, errors: e })
        loading.hideLoading()
      })
    }
  }
  
  authenticateCustomer(e) {
    e.preventDefault()
    const formData = formSerializer(e.target, { hash: true })
    const { loading } = this.props
    formData.chargeWith = this.state.currentChannel
    this.setState({ unswitchable: true })
    const formErors = {}
    if(!formData.authValue || !formData.authValue.length) {
      formErors['authValue'] = 'Please enter the OTP sent to you'
    }
    if(!formData.transactionId || !formData.publicKey) {
      formErors['submit'] = 'Invalid session. Please, close the dialog box and retry again'
    }
    console.log(formErors)
    if(isEmpty(formErors)) {
      loading.showLoading()
      let context = this
      this.props.api.post('charge/verify', formData).then(response => {
        if(response && response.status && response.status === 'success') {
          loading.hideLoading()
          let win = window.parent
          let timerId = setInterval(() => {
            let timeToClose = this.state.timeToClose
            if(timeToClose < 1) {
              clearInterval(timerId)
              let res = {
                trxref: response.transaction.id,
                raw: response,
              }
              win.postMessage(res, '*')
            } else {
              timeToClose -= 1
              context.setState({ timeToClose: timeToClose })
            }
          }, 1000)
          this.setState({ paymentStep: 3, amountPaid: response.transaction.amountToPay })
        } else {
          loading.hideLoading()
          this.setState({ unswitchable: false, errors: response })
        }
      })
    }
  }
  
  render() {
    const { currentTab: CurrentTab } = this.state
    const { dataFromPie, sentData } = this.props
    const setToRender = !isEmpty(dataFromPie)
    return (
      <div className="pie-payment-container-body">
        {setToRender &&
        <div>
          <div className="tabs-container" data-content-align="left">
            <ul className="tabs">
              <li className={this.getClassName('card')} onClick={e => this.changeChannel('card', CardTab)}>
                <div className="tab__title">
                  <span className="h5">Debit Card</span>
                </div>
              </li>
              <li className={this.getClassName('account')} onClick={e => this.changeChannel('account', BankTab)}>
                <div className="tab__title">
                  <span className="h5">Bank Account</span>
                </div>
              </li>
              <li className={this.getClassName('wallet')} onClick={e => this.changeChannel('wallet', WalletTab)}>
                <div className="tab__title">
                  <span className="h5">Wallet</span>
                </div>
              </li>
            </ul>
          </div>
          {!isEmpty(this.state.errors) && <ErrorOccurred errors={this.state.errors} />}
          {(isEmpty(this.state.errors) && this.state.paymentStep === 1) && <CurrentTab sentData={sentData} onSubmit={this.handleSubmit} dataFromPie={dataFromPie} api={this.props.api} loading={this.props.loading} />}
          {(isEmpty(this.state.errors) && this.state.paymentStep === 2) && <Verification sentData={sentData} dataFromPie={dataFromPie} transactionData={this.state.transactionData} onSubmit={this.handleAuthentication} />}
          {(isEmpty(this.state.errors) && this.state.paymentStep === 3) && <Final timeToClose={this.state.timeToClose} amountPaid={this.state.amountPaid} currencySign={sentData.currencySign} />}
        </div>}
      </div>
    )
  }
}

export default DialogueBody