import React, { Component } from 'react'

export default class Card extends Component {
  
  constructor(props) {
    super(props)
    this.handleCheckAccount = ::this.checkAccount
    this.state = {
      isVerve: false,
      submitDisabled: true,
      accountName: ''
    }
  }
  
  checkAccount(e) {
    const accNumber = e.target.value
    const bankCode = this.bankCode.value
    console.log(accNumber, bankCode)
    if(accNumber.length === 10) {
      this.props.loading.showLoading()
      this.props.api.post('accountEnquiry', { accNumber, bankCode }).then(response => {
        this.props.loading.hideLoading()
        if(response  && response.accName) {
          this.setState({ submitDisabled: false, accountName: response.accName })
        } else {
          this.setState({ submitDisabled: true, accountName: '' })
        }
      })
    } else {
      this.setState({ submitDisabled: true })
    }
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
          <input type="hidden" name="accName" value={this.state.accountName} />
          <input type="hidden" value="account" name="chargeWith" />
          <div className="col-xs-12">
            <div className="input-select">
            	<select defaultValue="Default" name="bankCode" ref={e => this.bankCode = e}>
            	  <option>Select your bank</option>
            		{dataFromPie.banks.map(bank => (
            		  <option value={bank.bankCode} key={bank.bankCode}>{bank.name}</option>
            		))}
            	</select>
            </div>
          </div>
          <div className="col-xs-12">
            <input placeholder="Account Number" type="text" name="accNumber" autoComplete="off" onChange={this.handleCheckAccount} />
          </div>
          <div className="col-xs-12">
            <input placeholder="Account Name" type="text" autoComplete="off" disabled="disabled" value={this.state.accountName} />
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