import { getDefaultAccount } from '../../../utils/user'

const initialState = {
  isLoggedIn: false,
  token: null,
  user: {},
  errorMessage: '',
  defaultAccount: getDefaultAccount(),
  accountInfo: [],
  wallets: []
}

export default (state = initialState, action) => {
  switch (action.type) {
   case 'LOGIN_SUCCESS':
      return {
        ...state,
        isLoggedIn: true,
        token: action.token,
        user: action.user,
      }
    case 'LOGIN_FAILED':
      return {
        ...state,
        isLoggedIn: false,
      }

    case 'LOGOUT_SUCCESS':
      return {
        ...state,
        isLoggedIn: false,
        token: null,
        user: {},
      }
    case 'ACCOUNT_CHANGED':
      return {
        ...state,
        defaultAccount: action.account
      }
    case 'ACCOUNT_CHANGE_FAILED':
      return {
        ...state,
      }
    case 'STORE_CURRENT_USER':
      return {
        ...state,
        defaultAccount: action.account
      }
    case 'FETCH_INFO_SUCCESS':
      return {
        ...state,
        accountInfo: action.accountInfo
      }
    case 'FETCH_INFO_FAIL':
      return {
        ...state,
        errorMessage: action.error.message,
      }
    case 'FETCH_WALLETS_SUCCESS':
      return {
        ...state,
        wallets: action.payload
      }
    default:
      return state
  }
}