import React, { Component } from 'react'

import CardReactFormContainer from '../../../common/card-form'

export default class Card extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      isVerve: false,
      submitDisabled: false,
    }
  }
  
  render() {
    const { sentData, onSubmit, dataFromPie } = this.props
    return(
    <div className="row">
      <div className="col-xs-12">
        <CardReactFormContainer
          container="card-wrapper"
          formInputsNames={
            {
              number: 'CCnumber',
              expiry: 'CCexpiry',
              cvc: 'CCcvc',
              name: 'CCname',
            }
          }
          formatting={true}>
          <form onSubmit={onSubmit}>
            <div className="col-xs-12">
              <div id="card-wrapper"></div>
            </div>
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
            <input type="hidden" value="card" name="chargeWith" />
            <div className="pieAnimatedInputContainer col-xs-12">
              <div className="col-xs-8">
                <input placeholder="NUMBER ON CARD" type="text" name="CCnumber" autoComplete="off" style={{width: '100%'}} />
              </div>
              <div className="col-xs-4">
                <input className="text-center" placeholder="PIN" type="password" name="CCpin" autoComplete="off" maxLength={4} />
              </div>
            </div>
            <div className="col-xs-12">
              <input placeholder="NAME ON CARD" type="text" name="CCname" autoComplete="off" />
            </div>
            <div className="col-xs-12">
              <div className="col-xs-6">
                <input placeholder="MM/YY" type="text" name="CCexpiry" autoComplete="off" />
              </div>
              <div className="col-xs-6">
                <input placeholder="CVC/CVV" type="text" name="CCcvc" autoComplete="off" />
              </div>
            </div>
            <div className="col-xs-12">
              <button
                type="submit"
                className="btn btn--primary type--uppercase"
                disabled={this.state.submitDisabled}>Pay {sentData.currencySign}{dataFromPie.totalAmountPresentable}</button>
            </div>
          </form>
        </CardReactFormContainer>
      </div>
    </div>
    )
  }
}