import React, { Component } from 'react'
import * as api from '../../utils/api'

// import config from '../../../../config/config.client'

import DialogueBody from './DialogueBody'
import logo from '../../../../assets/images/logo.png'

import './payment.scss'

class Payment extends Component {
  constructor(props) {
    super(props)
    this.handleClose = ::this.closeDialogue
    this.state = {
      isLoading: true,
      error: {},
      sentData: {},
      dataFromPie: {},
      headerName: config.appName,/*global config*/
    }
  }
  
  componentDidMount() {
    let eventMethod = window.addEventListener ? 'addEventListener' : 'attachEvent', eventer = window[eventMethod], 
    messageEvent = 'attachEvent' === eventMethod ? 'onmessage' : 'message'
    eventer(messageEvent, (e) => {
      let sentData = e.data || e.message
      console.log('sentData', sentData)
      sentData.currency = sentData.currency || 'NGN'
      sentData.currencySign = sentData.currency === 'USD' ? '$' : '₦'
      api.post('initialize-dialog', {
        apiKey: sentData.publicKey,
        amount: sentData.amount,
        currency: sentData.currency,
        inclusive: sentData.inclusive,
        commission: sentData.commission
      }).then(response => {
        if(response && response.business) {
          this.setState({ isLoading: false, sentData, dataFromPie: response, headerName: response.business.name })
        }
      })
    })
  }
  
  closeDialogue(e) {
    window.parent.postMessage('closeIframe', '*')
    e.preventDefault()
  }
  
  showLoading() {
    this.setState({ isLoading: true })
  }
  
  hideLoading() {
    this.setState({ isLoading: false })
  }
  
  handleAuthentication(e) {
    
  }
  
  render() {
    return (
      <div>
        <div className="pie-testing-env text-center clearfix">
          {(this.state.dataFromPie.business && !this.state.dataFromPie.business.livemode) &&
          <div className="pie-testing-env-tab">
            <div className="pie-testing-env-text">TEST</div>
          </div>}
        </div>
        <div className="container pos-vertical-center">
          <div className="pie-payment-container">
            <div className="cancel" onClick={this.handleClose}>×</div>
            {this.state.isLoading &&
            <div className="pie-loading">
              <div className="hive-spinner">
                <div className="hive-dot1"></div>
                <div className="hive-dot2"></div>
              </div>
            </div>}
            <div className="pie-payment-container-header">
              <div className="row">
                <div className="logo">
                  <img src={logo} />
                </div>
                <div className="title text-center">
                  <h3 className="noMarginBottom">{this.state.headerName}</h3>
                  <p className="lead">{this.state.sentData.customer}</p>
                </div>
              </div>
            </div>
            <DialogueBody dataFromPie={this.state.dataFromPie} sentData={this.state.sentData} api={api} loading={{showLoading: () => this.showLoading(), hideLoading: () => this.hideLoading()}} />
          </div>
        </div>
      </div>
    )
  }
}

export default Payment