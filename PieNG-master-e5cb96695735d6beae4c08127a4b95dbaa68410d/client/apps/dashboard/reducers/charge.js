// import * as user from '../../../utils/user'

const initialState = {
  chargeSuccess: false,
  chargeAuthSuccess: false,
  chargeStep: 1,
  transaction: {},
  paymentHistory: [],
  transfer: {}
}

export default (state = initialState, action) => {
  switch (action.type) {
   case 'CHARGE_SUCCESS':
      return {
        ...state,
        chargeSuccess: true,
        chargeStep: 2,
        transaction: action.transaction
      }
    case 'CHARGE_FAILED':
      return {
        ...state,
        chargeSuccess: false,
        chargeStep: 1,
      }
   case 'AUTH_CHARGE_SUCCESS':
      return {
        ...state,
        chargeAuthSuccess: true,
        transaction: action.transaction
      }
    case 'AUTH_CHARGE_FAILED':
      return {
        ...state,
        chargeAuthSuccess: false,
        chargeStep: 1,
      }
    case 'FETCH_PAYMENT_SUCCESS':
      return {
        ...state,
        paymentHistory: action.paymentHistory
      }
    case 'FETCH_PAYMENT_FAIL':
      return {
        ...state,
      }
    case 'TRANSFER_SUCCESS':
      return {
        ...state,
        transfer: action.transfer
      }
    case 'WALLET_FUNDING_SUCCESS':
      return {
        ...state
      }
    case 'TRANSFER_FAIL':
      return state
    default:
      return state
  }
}