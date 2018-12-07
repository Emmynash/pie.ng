import React from 'react'
import formSerializer from 'form-serialize'
import { connect } from 'react-redux'
import { getIsWorking } from '../reducers'
import { chargeUser, authCharge } from '../actions'
import { isEmpty } from '../../../utils/_'

import CardReactFormContainer from '../../common/card-form'
import '../../../assets/css/card.css'

class FundWalletCard extends React.Component {
  constructor(props) {
    super(props)
    this.handleCharge = ::this.chargeUser
    this.handleAuth = ::this.authenticateUser
  }
  
  chargeUser(e) {
    e.preventDefault()
    // const formData = formSerializer(e.target, { hash: true })
    // console.log(formData)
    // const formErors = {}
    // // Validate form
    // if(!formData.CCname) {
    //   formErors['CCname'] = 'Cardholder\'s name is required'
    // }
    // if(!formData.CCnumber) {
    //   formErors['CCnumber'] = 'Card number is required for billing'
    // }
    // if(!formData.CCcvc) {
    //   formErors['CCcvc'] = 'Your card\'s CCV is required. CCV is the 3 digit number at the back of your card'
    // }
    // if(!formData.CCexpiry) {
    //   formErors['CCexpiry'] = 'Enter a valid expiry data for your CCV'
    // }
    // if(!formData.amount || !formData.email || !formData.publicKey) {
    //   formErors['submit'] = 'Invalid session. Please, close the dialog box and retry'
    // }
    // console.log(formErors)
    // if(isEmpty(formErors)) {
    //   this.props.chargeUser(formData)
    // }
  }
  
  authenticateUser(e) {
    e.preventDefault()
    const formData = formSerializer(e.target, { hash: true })
    console.log(formData)
    const formErors = {}
    if(!formData.authValue || !formData.authValue.length) {
      formErors['authValue'] = 'Please enter the OTP sent to you'
    }
    if(!formData.transactionId || !formData.publicKey) {
      formErors['submit'] = 'Invalid session. Please, close the dialog box and retry again'
    }
    console.log(formErors)
    if(isEmpty(formErors)) {
      this.props.authCharge(formData)
    }
  }
  
  render () {
    return (
      <div className="container">
        {this.props.store.chReducer.chargeStep === 1 && <FundWalletCardStep1 fundWallet={this.handleCharge} state={this.props.state} /> }
        {this.props.store.chReducer.chargeStep === 2 && <FundWalletCardStep2 confirmFunding={this.handleAuth} state={this.props.state} store={this.props.store} /> }
      </div>
    )
  }
}

const FundWalletCardStep1 = ({ fundWallet, state }) => {
  return (
    <CardReactFormContainer
      container="card-wrapper"
      formInputsNames={{
        number: 'CCnumber',
        expiry: 'CCexpiry',
        cvc: 'CCcvc',
        name: 'CCname',
      }}
      formatting={true}>
      <form onSubmit={fundWallet}>
        <div className="row">
          <div className="col-xs-12">
            <div id="card-wrapper"></div>
          </div>
        </div>
        <div className="row" style={{ margin: '20px -15px 0' }}>
        <div className="row">
          <input type="hidden" value={state.data.customer} name="email" />
          <input type="hidden" value={state.data.publicKey} name="publicKey" />
          <input type="hidden" value={state.data.currency} name="currency" />
          <input type="hidden" value={false} name="inclusive" />
          <input type="hidden" value="card" name="chargeWith" />
          <div className="col-5">
            <div className="form-group">
              <label>Amount</label>
              <input className="form-control" placeholder="0.00" type="text" name="amount" autoComplete="off" />
            </div>
          </div>
          <div className="col-7">
            <div className="form-group">
              <label>Name on card</label>
              <input className="form-control" placeholder="eg., Chinedu Adamu" type="text" name="CCname" autoComplete="off" />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-8">
            <div className="form-group">
              <label>Card number</label>
              <input className="form-control" placeholder="eg., 5555 5555 5555 5555" type="text" name="CCnumber" autoComplete="off" />
            </div>
          </div>
          <div className="col-4">
            <div className="form-group">
              <label>Card PIN</label>
              <input className="text-center form-control" placeholder="eg., 4618" type="password" name="CCpin" autoComplete="off" maxLength={4} />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-6">
            <div className="form-group">
              <label>Card expiry date</label>
              <input className="form-control" placeholder="eg., mm/yy" type="text" name="CCexpiry" autoComplete="off" />
            </div>
          </div>
          <div className="col-6">
            <div className="form-group">
              <label>CVC/CVV</label>
              <input className="form-control" placeholder="CVC/CVV" type="text" name="CCcvc" autoComplete="off" />
            </div>
          </div>
        </div>
        </div>
        <div className="modal-footer" style={{ marginRight: '-15px', marginLeft: '-15px' }}>
          <button type="button" className="btn btn-secondary waves-effect" data-dismiss="modal">Cancel</button>
          <button type="submit" className="btn btn-primary waves-effect waves-light">Fund Wallet</button>
        </div>
      </form>
    </CardReactFormContainer>
  )
}

const FundWalletCardStep2 = ({ confirmFunding, state, store }) => {
  console.log('FundWalletCardStep2', store) //
  return (
    <form onSubmit={confirmFunding}>
      <input type="hidden" value={state.data.publicKey} name="publicKey" />
      <input type="hidden" value={store.chReducer.transaction.id} name="transactionId" />
      <div className="form-group row">
        <div className="input-group">
          <input className="text-center form-control" placeholder="OTP" type="password" name="authValue" autoComplete="off" maxLength={10} />
          <span className="input-group-btn add-on">
            <button type="button" className="btn btn-white"><i className="mdi mdi-lock-outline"></i></button>
          </span>
        </div>
      </div>
      <div className="modal-footer" style={{ marginRight: '-15px', marginLeft: '-15px' }}>
        <button type="button" className="btn btn-secondary waves-effect" data-dismiss="modal">Cancel</button>
        <button type="submit" className="btn btn-primary waves-effect waves-light">Confirm Funding (N{store.chReducer.transaction.amountToPay})</button>
      </div>
    </form>
  )
}


const mapStateToProps = (store) => {
  return {
    store: store,
    isWorking: getIsWorking(store)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    chargeUser: (data) => dispatch(chargeUser(data)),
    authCharge: (data) => dispatch(authCharge(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FundWalletCard)