import Promise from 'promise'
import storage from 'local-storage-fallback'
import * as api from './api'

const sameOldMessage = 'An error occurred and your request could not be completed'

export const getAccountType = (accountId) => (
  accountId.startsWith('us_') ? 'USER'  : 'BUSINESS' 
)

export const setToken = (token) => {
  storage.setItem('token', token)
}

export const setUser = (user) => {
  const userStr = JSON.stringify(user)
  storage.setItem('user', userStr)
  storage.setItem('activeAccount', userStr)
}

export const getToken = () => storage.getItem('token')

export const getUser = () => {
  const user = storage.getItem('user')
  return JSON.parse(user)
}

export const setDefaultAccount = (account) => {
  storage.setItem('activeAccount', JSON.stringify(account))
}

export const getDefaultAccount = () => {
  return JSON.parse(storage.getItem('activeAccount'))
}

export const setWallets = (wallets) => {
  storage.setItem('wallets', JSON.stringify(wallets))
}

export const getWallets = () => {
  const wallets = storage.getItem('wallets')
  return JSON.parse(wallets)
}

export const hasWallets = () => {
  return (getWallets() !== null)
}

export const isLoggedIn = () => {
  return (getToken() !== null && getUser() !== null && getDefaultAccount() !== null)
}

export const login = (user) => {
  return new Promise((resolve, reject) => {
    // if (isLoggedIn()) {
    //   let savedUser = { user: getUser(), token: getToken() }
    //   resolve(savedUser)
    // }
    api.post('user/login', user).then((response) => {
      if (response && response.user && response.token) {
        setToken(response.token)
        setUser(response.user)
        resolve(response)
      } else {
        reject(response)
      }
    }).catch((error) => {
      reject(error)
    })
  })
}

export const logout = () => {
  return new Promise((resolve, reject) => {
    try {
      storage.removeItem('token')
      storage.removeItem('activeAccount')
      storage.removeItem('user')
      console.log('Delete user')
      resolve(true)
    } catch (error) {
      reject(error)
    }
  })
}

export const signup = (user) => {
  return new Promise((resolve, reject) => {
    return api.post('user/create', user).then((response) => {
      if (response && response.status && response.status === 'success') {
        resolve(response.user)
      } else {
        console.log('user2', response)
        let reason = (response && response.message)
          && response.message || sameOldMessage
        reject(reason)
      }
    }).catch((error) => {
      console.log('reject', error)
      reject(error)
    })
  })
}

export const resetPassword = (user) => {
  return new Promise((resolve, reject) => {
    return api.post('user/reset-password', user).then(response => {
      if(response && response.status && response.status === 'success') {
        resolve(response)
      } else {
        console.error('resetPassword', response)
        reject(response.message)
      }
    }).catch(error => {
      reject(error)
    })
  })
}

export const verifyNewUser = (verification) => {
  return new Promise((resolve, reject) => {
    return api.post('user/verify', verification).then((response) => {
      if (response && response.status && response.status === 'success') {
        resolve(response.user)
      } else {
        let reason = (response && response.message)
          && response.message || sameOldMessage
        reject(reason)
      }
    }).catch((error) => {
      console.log('rejected', error)
      reject(error)
    })
  })
}

export const changeAccount = (account) => {
  return new Promise((resolve, reject) => {
    try {
      setDefaultAccount(account)
      resolve(true)
    } catch (error) {
      reject(error)
    }
  })
}

export const getSummary = () => {
  return new Promise((resolve, reject) => {
    api.get('summary').then(response => {
      if (response && response.status && response.status === 'success') {
        console.log(response)
        resolve(response)
      } else {
        reject(response.message || sameOldMessage)
      }
    }).catch(error => {
      console.error('utils/fetchSummary', error)
      reject(error.message || sameOldMessage)
    })
  })
}

export const fetchInfo = (accountId) => {
  return new Promise((resolve, reject) => {
    let accountType = getAccountType(accountId)
    if(accountType === 'USER') {
      api.get('user').then(response => {
        if(response.user) {
          resolve(response)
        } else {
          reject(response.message)
        }
      }).catch(error => {
        reject(error.message || sameOldMessage)
      })
    }
    if(accountType === 'BUSINESS') {
      api.get(`business/${accountId}/settings`).then(response => {
        if(response.business) {
          resolve(response)
        } else {
          reject(response.message)
        }
      }).catch(error => {
        reject(error.message || sameOldMessage)
      })
    }
  })
}

export const fetchDashboard = (accountId) => {
  return new Promise((resolve, reject) => {
    let accountType = getAccountType(accountId)
    if(accountType === 'USER') {
      api.get('user/dashboard').then(response => {
        if(!response.message) {
          resolve(response)
        } else {
          reject(response.message || sameOldMessage)
        }
      }).catch(error => {
        reject(error.message || sameOldMessage)
      })
    } else {
      api.get(`business/${accountId}/dashboard`).then(response => {
        if(!response.message) {
          resolve(response)
        } else {
          reject(response.message || sameOldMessage)
        }
      }).catch(error => {
        reject(error.message || sameOldMessage)
      })
    }
  })
}

export const fetchWallets = accountId => {
  return new Promise((resolve, reject) => {
    let accountType = getAccountType(accountId)
    if (accountType === 'USER') {
      api.get('user/wallets').then(response => {
        if (response.status && response.status === 'success') {
          resolve(response)
        } else {
          reject(response.message || sameOldMessage)
        }
      }).catch(error => {
        reject(error.message || sameOldMessage)
      })
    } else {
      api.get(`business/${accountId}/wallets`).then(response => {
        if (response.status && response.status === 'success') {
          resolve(response)
        } else {
          reject(response.message || sameOldMessage)
        }
      }).catch(error => {
        reject(error.message || sameOldMessage)
      })
    }
  })
}