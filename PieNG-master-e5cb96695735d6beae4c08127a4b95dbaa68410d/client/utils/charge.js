import Promise from 'promise'
import storage from 'local-storage-fallback'
import * as api from './api'
import { getAccountType } from './user' 

export const authCharge = (charge) => {
  return new Promise((resolve, reject) => {
    api.post('charge/verify', charge).then((response) => {
      if (response && response.transaction && response.transaction.completed && response.status && response.status === 'success') {
        // changeBalance(response.transaction.amountToPay)
        resolve(response)
      } else {
        reject(response)
      }
    }).catch((error) => { 
      reject(error)
    })
  })
}

export const chargeUser = (charge) => {
  return new Promise((resolve, reject) => {
    api.post('charge', charge).then((response) => {
      if (response && response.transaction && response.status && response.status === 'success') {
        resolve(response)
      } else {
        reject(response)
      }
    }).catch((error) => {
      reject(error)
    })
  })
}

export const fetchPaymentHistory = (accountId, options = {}) => {
  return new Promise((resolve, reject) => {
    let accountType = getAccountType(accountId)
    let { startDate = null, endDate = null } = options, query = 'f=f'
    if(startDate) {
      query += '&startDate=' + encodeURIComponent(startDate)
    }
    if(endDate) {
      query += '&endDate=' + encodeURIComponent(endDate)
    }
    if(accountType === 'USER') {
      api.get(`transactions/history?${query}`).then(response => {
        if(response && response.charges && response.status && response.status === 'success') {
          resolve(response)
        } else {
          reject(response)
        }
      }).catch(error => {
        reject(error)
      })
    } else {
      api.get(`business/${accountId}/transactions/history?${query}`).then(response => {
        if(response && response.charges && response.status && response.status === 'success') {
          resolve(response)
        } else {
          reject(response)
        }
      }).catch(error => {
        reject(error)
      })
    }
  })
}

export const walletTransfer = (transferData) => {
  return new Promise((resolve, reject) => {
    api.post('wallet/transferSession', transferData).then(response => {
      if(response && response.transfer && response.status && response.status === 'success') {
        resolve(response.transfer)
      } else {
        reject(response)
      }
    }).catch(error => {
      reject(error)
    })
  })
}

export const reverseTransaction = transferData => {
  return new Promise((resolve, reject) => {
    api.post('reverse', transferData).then(response => {
      if(response && response.status && response.status === 'success') {
        resolve(response)
      } else {
        reject(response.message || 'Something went wrong')
      }
    }).catch(error => {
      reject(error.message)
    })
  })
}

export const submitFunding = fundingData => new Promise((resolve, reject) => {
  api.post('wallet/funding', fundingData).then(response => {
    if (response && response.status && response.status === 'success') {
      resolve(response)
    } else {
      reject(response.message || 'Something went wrong')
    }
  }).catch(error => {
    reject(error.message)
  })
})