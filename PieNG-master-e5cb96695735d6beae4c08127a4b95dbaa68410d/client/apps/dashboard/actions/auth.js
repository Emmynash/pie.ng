import * as user from '../../../utils/user'
import * as toastr from '../../../utils/toastr'
// import config from '../../../config/config.client'
import { isWorking, isDoneWorking } from './common'

export const loginSuccess = (response) => {
  return { type: 'LOGIN_SUCCESS', token: response.token, user: response.user }
}

const loginFail = error => {
  return { type: 'LOGIN_FAILED', error }
}

const logoutSuccess = () => {
  return { type: 'LOGOUT_SUCCESS' }
}

const accountChanged = (account) => {
  return { type: 'ACCOUNT_CHANGED', account }
}

const accountChangeFail = error => {
  return { type: 'ACCOUNT_CHANGE_FAILED', error }
}

const resetPasswordSuccess = response => ({
  type: 'PASSWORD_CHANGED', response
})

const resetPasswordFail = error => ({
  type: 'PASSWORD_CHANGE_FAIL', error
})

export const login = (credentials, history) => {
  return (dispatch) => {
    dispatch(isWorking())
    return user.login(credentials).then((response) => {
      dispatch(loginSuccess(response))
      window.location.assign(config.appUrl.concat('/dashboard'))/*global config*/
    }).catch((error) => {
      dispatch(loginFail(error))
      dispatch(isDoneWorking())
      toastr.error('Login Failed', error.message || error)
    })
  }
}

export const logout = () => {
  return (dispatch) => {
    return user.logout().then(() => {
      window.location.assign(config.appUrl.concat('/dashboard/account/login'))
      dispatch(logoutSuccess())
    }).catch(() => {
      // dispatch(logout(error));
    })
  }
}

const fetchInfoSuccess = (accountInfo) => ({
  type: 'FETCH_INFO_SUCCESS', accountInfo
})

const fetchInfoFail = (error) => {
  type: 'FETCH_INFO_FAIL', error
}

const fetchDashboardSuccess = (dashboard) => ({
  type: 'FETCH_DASHNOARD_SUCCESS', dashboard
})

const fetchDashboardFail = (error) => ({
  type: 'FETCH_DASHNOARD_FAIL', error
})

const fetchWalletsSuccess = payload => ({
  type: 'FETCH_WALLETS_SUCCESS', payload
})

const fetchWalletsFail = error => ({
  type: 'FETCH_WALLETS_FAIL', error
})

export const changeAccount = (account) => {
  return (dispatch) => {
    dispatch(isWorking())
    return user.changeAccount(account).then(() => {
      toastr.success('Okay!', 'Account switched successfully')
      window.location.assign(config.appUrl.concat('/dashboard/summary'))
      dispatch(accountChanged(account))
      dispatch(storeCurrentUser(account))
      dispatch(isDoneWorking())
    }).catch((error) => {
      dispatch(accountChangeFail(error))
      toastr.error('Oops!', 'Something went wrong. Please try again')
    })
  }
}

export const fetchInfo = (accountId) => {
  return (dispatch) => {
    dispatch(isWorking())
    return user.fetchInfo(accountId).then(info => {
      dispatch(fetchInfoSuccess(info))
      dispatch(isDoneWorking())
    }).catch(error => {
      dispatch(fetchInfoFail(error))
      dispatch(isDoneWorking())
      toastr.error('Snap!', 'Something went wrong. Please try again')
    })
  }
}

export const fetchDashboard = (accountId) => {
  return (dispatch) => {
    dispatch(isWorking())
    return user.fetchDashboard(accountId).then(dashboard => {
      dispatch(fetchDashboardSuccess(dashboard))
      dispatch(isDoneWorking())
    }).catch(error => {
      dispatch(fetchDashboardFail(error))
      dispatch(isDoneWorking())
      toastr.error('Snap!', error || 'We could not load your dashboard information')
    })
  }
}

export const resetPassword = (password) => {
  return (dispatch) => {
    dispatch(isWorking())
    return user.resetPassword(password).then(response => {
      dispatch(resetPasswordSuccess(response))
      dispatch(isDoneWorking())
      toastr.success('Okay', response.message)
    }).catch(error => {
      dispatch(resetPasswordFail(error))
      dispatch(isDoneWorking())
      toastr.error('Snap!', error || 'We could not change your password')
    })
  }
}

export const fetchWallets = accountId => {
  return dispatch => {
    dispatch(isWorking())
    return user.fetchWallets(accountId).then(response => {
      dispatch(fetchWalletsSuccess(response.wallets))
      dispatch(isDoneWorking())
    }).catch(error => {
      dispatch(fetchWalletsFail(error))
      dispatch(isDoneWorking())
      toastr.error('Oops!', 'Something went wrong. Please refresh the page')
    })
  }
}

export const storeCurrentUser = (account) => ({
  type: 'STORE_CURRENT_USER', account
})