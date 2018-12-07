import Promise from 'promise'
import storage from 'local-storage-fallback'
import * as api from './api'

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

export const retryOtp = transactionId => {
  return new Promise((resolve, reject) => {
    api.put(`charge/retry-otp/${transactionId}`).then((response) => {
      if (response && response.status && response.status === 'success') {
        resolve(response)
      } else {
        reject(response)
      }
    }).catch((error) => {
      reject(error)
    })
  })
}