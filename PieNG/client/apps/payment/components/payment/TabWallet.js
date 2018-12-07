import React, { Component } from 'react'

export default class Card extends Component {
  constructor(props) {
    super(props)
    this.state = {
      submitDisabled: false,
      phone: ''
    }
  }
  
  _setPhone(e) {
    let phone = e.target.value
    if(phone.length <= 11) {
      phone = phone.replace(/[^0-9]/, '')
      this.setState({ phone })
    }
  }
  
  componentDidMount() {
    let loggedInPhone = this.props.dataFromPie.loggedInPhone || ''
    this.setState({ phone: loggedInPhone })
  }
  
  render() {
    const { sentData, onSubmit, dataFromPie } = this.props
    return(
    <div className="row">
      <div className="col-xs-12">
        <form onSubmit={onSubmit}>
          <input type="hidden" value={sentData.customer} name="email" />
          <input type="hidden" value={sentData.amount} name="amount" />
          <input type="hidden" value={sentData.publicKey} name="publicKey" />
          <input type="hidden" value={sentData.currency} name="currency" />
          <input type="hidden" value={sentData.wallet} name="wallet" />
          <input type="hidden" value={sentData.commission} name="commission" />
          <input type="hidden" value={sentData.commissionWallet} name="commissionWallet" />
          <input type="hidden" value={sentData.inclusive} name="inclusive" />
          <input type="hidden" value={sentData.narration} name="narration" />
          <input type="hidden" value={sentData.reference} name="reference" />
          <input type="hidden" value="wallet" name="chargeWith" />
          <div className="col-xs-12">
            <input
              placeholder="Phone Number"
              type="text" name="phone"
              autoComplete="off"
              value={this.state.phone}
              onChange={e => this._setPhone(e)} />
          </div>
          <div className="col-xs-12">
            <button
              type="submit"
              className="btn btn--primary type--uppercase"
              disabled={this.state.submitDisabled}>Pay {sentData.currencySign}{dataFromPie.totalAmountPresentable}</button>
          </div>
        </form>
      </div>
    </div>
    )
  }
}