import React from 'react'
import { connect } from 'react-redux'
import { otpResend } from '../../actions'

const CAP_SECONDS = 40
const pad = (number, size) => {
  var s = String(number);
  while (s.length < (size || 2)) {
    s = "0" + s
  }
  return s
}

class PsVerification extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {
      retryIn: CAP_SECONDS,
      retrials: 1
    }
    this._startCount()
  }
  
  _startCount() {
    let timerId = setInterval(() => {
      let retryIn = this.state.retryIn - 1
      if(retryIn >= 0) {
        this.setState({ retryIn: retryIn })
      } else {
        clearInterval(timerId)
      }
    }, 1000)
  }
  
  _retryText() {
    let retryIn = this.state.retryIn
    if(retryIn > 0) {
      return `Retry in ${(Math.floor(retryIn / 60) + ':' + pad(retryIn % 60))}s`
    } else {
      if(this.props.store.retrying) {
        return 'Retrying'
      }
      return 'Retry again'
    }
  }
  
  _retryOtp(transactionId) {
    let retryIn = this.state.retryIn
    if(retryIn <= 0) {
      let retrials = this.state.retrials + 1
      this.setState({ retryIn: CAP_SECONDS * retrials, retrials})
      this._startCount()
      this.props.otpResend(transactionId)
    }
  }
  
  _retryTextOpacity() {
    let retryIn = this.state.retryIn, opacity = 0
    opacity = (CAP_SECONDS - retryIn) / CAP_SECONDS
    if(opacity < 0.4) {
      return 0.4
    }
    return opacity
  }
  
  render() {
    const { onSubmit, sentData, transactionData, dataFromPie } = this.props
    return (
      <div className="row">
        <div className="col-xs-12">
          <form onSubmit={onSubmit}>
            <input type="hidden" name="transactionId" value={transactionData.id} required="required" />
            <input type="hidden" name="publicKey" value={sentData.publicKey} required="required" />
            <div className="col-xs-12">
              <p className="lead text-center">Please enter the OTP sent to you. <a
                onClick={() => this._retryOtp(transactionData.id)}
                className="retry disabled">{this._retryText()}</a></p>
            </div>
            <div className="col-xs-12">
              <input placeholder="OTP" className="text-center" type="text" name="authValue" autoComplete="off" />
            </div>
            <div className="col-xs-12">
              <button
                type="submit"
                className="btn btn--primary type--uppercase">Confirm payment of {sentData.currencySign}{dataFromPie.totalAmountPresentable}</button>
            </div>
          </form>
        </div>
      </div>
    )
  }
}
const mapStateToProps = store => {
  return {
    store
  }
}

const mapDispatchToProps = dispatch => {
  return {
    otpResend: transactionId => dispatch(otpResend(transactionId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PsVerification)