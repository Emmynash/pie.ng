import * as charge from '../../../utils/charge'
import * as toastr from '../../../utils/toastr'
// import config from '../../../config/config.client'
import { isWorking, isDoneWorking } from './common'

export const chargeSuccess = (transaction) => {
  return { type: 'CHARGE_SUCCESS', transaction }
}

const chargeFail = error => {
  return { type: 'CHARGE_FAILED', error }
}

export const authChargeSuccess = (transaction) => {
  return { type: 'AUTH_CHARGE_SUCCESS', transaction }
}

const authChargeFail = error => {
  return { type: 'AUTH_CHARGE_FAILED', error }
}

export const fetchPaymentHistorySuccess = (paymentHistory) => {
  return { type: 'FETCH_PAYMENT_SUCCESS', paymentHistory }
}

const fetchPaymentHistoryFail = (error) => {
  return { type: 'FETCH_PAYMENT_FAIL', error }
}

const transferSuccess = (transferResponse) => ({
  type: 'TRANSFER_SUCCESS', transferResponse
})

const transferFail = (error) => ({
  type: 'TRANSFER_FAIL', error
})

const reversalSuccess = transactionResponse => ({
  type: 'TRANSACTION_REVERSED', transactionResponse
})

const reversalFail = error => ({
  type: 'TRANSACTION_REVERSAL_FAILED', error
})

const fundingSuccess = payload => ({
    type: 'WALLET_FUNDING_SUCCESS', payload
})

const fundingFail = error => ({
    type: 'WALLET_FUNDING_FAIL', error
})

export const chargeUser = (card) => {
  return (dispatch) => {
    dispatch(isWorking())
    return charge.chargeUser(card).then((response) => {
      dispatch(chargeSuccess(response.transaction))
      dispatch(isDoneWorking())
      toastr.success('One More Thing', 'Please enter the OTP sent to you')
      // window.location.assign(config.appUrl.concat('/dashboard'))
    }).catch((error) => {
      dispatch(chargeFail(error))
      dispatch(isDoneWorking())
      toastr.error('Failed', error.message || error)
    })
  }
}

export const authCharge = (auth) => {
  return (dispatch) => {
    dispatch(isWorking())
    return charge.authCharge(auth).then((response) => {
      dispatch(authChargeSuccess(response.transaction))
      window.location.assign(config.appUrl.concat('/dashboard/summary'))/*global config*/
      dispatch(isDoneWorking())
    }).catch((error) => {
      dispatch(authChargeFail(error))
      dispatch(isDoneWorking())
      toastr.error('Snap!', 'We could not charge your card. Please try again')
    })
  }
}

export const fetchPaymentHistory = (accountId, options = {}) => {
  return (dispatch) => {
    dispatch(isWorking())
    return charge.fetchPaymentHistory(accountId, options).then(paymentHistory => {
      console.log('paymentHistory', paymentHistory)
      dispatch(fetchPaymentHistorySuccess(paymentHistory.charges))
      dispatch(isDoneWorking())
    }).catch(error => {
      dispatch(fetchPaymentHistoryFail(error))
      dispatch(isDoneWorking())
      toastr.error('Snap!', 'We could not fetch your payment history from the server')
    })
  }
}

export const walletTransfer = (transferData) => {
  return (dispatch) => {
    dispatch(isWorking())
    return charge.walletTransfer(transferData).then(transferResponse => {
      dispatch(transferSuccess(transferData))
      dispatch(isDoneWorking())
      toastr.success('Successful!', 'Your transfer request was successful')
    }).catch(error => {
      dispatch(transferFail(error))
      dispatch(isDoneWorking())
      toastr.error('Oops!', error.message || error)
    })
  }
}

export const reverseTransaction = transactionData => {
  return (dispatch) => {
    dispatch(isWorking())
    return charge.reverseTransaction(transactionData).then(transactionResponse => {
      dispatch(reversalSuccess())
      dispatch(isDoneWorking())
      toastr.success('Successful', `The transaction ${transactionData.transactionId} was reversed successfully`)
    }).catch(error => {
      dispatch(reversalFail())
      dispatch(isDoneWorking())
      toastr.error('Oops!', error.message || error)
    })
  }
}

export const submitFunding = data => dispatch => {
    dispatch(isWorking())
    return charge.submitFunding(data).then(response => {
        dispatch(fundingSuccess())
        dispatch(isDoneWorking())
        window.location.assign(config.appUrl.concat('/dashboard/fund'))
    }).catch(error => {
        dispatch(fundingFail())
        dispatch(isDoneWorking())
        toastr.error('Oops!', error.message || error)
    })
}