import Promise from 'promise'
import storage from 'local-storage-fallback'
import { getDefaultAccount, setDefaultAccount } from './user'
import * as api from './api'

export const addWallet = (wallet) => {
  let user = JSON.parse(storage.getItem('user'))
  let wallets = user.wallets || []
  wallets.push(wallet)
  user.wallets = wallets
  storage.setItem('user', JSON.stringify(user))
}

export const getWallets = () => {
  let user = JSON.parse(storage.getItem('user'))
  let wallets = user.wallets || []
  return wallets
}

export const toggleLocalMode = () => {
  let business = getDefaultAccount()
  business.livemode = !business.livemode
  setDefaultAccount(business)
}

export const hasWallets = () => {
  return (getWallets() !== null)
}

export const addBusiness = (bus) => {
  let user = JSON.parse(storage.getItem('user'))
  let businesses = user.businesses || user.business || []
  if(!Array.isArray(businesses)) businesses = [].push(businesses)
  businesses.push(bus)
  user.businesses = businesses
  storage.setItem('user', JSON.stringify(user))
}

export const getBusinesses = () => {
  let user = JSON.parse(storage.getItem('user'))
  return user.businesses || user.business || []
}

export const hasBusiness = () => {
  return (getBusinesses() !== null && getBusinesses().length)
}


export const createBusiness = (business) => {
  return new Promise((resolve, reject) => {
    api.post('business/create', business).then((response) => {
      if (response && response.status) {
        addBusiness(response.business)
        resolve(response)
      }
    }).catch((error) => {
      reject(error)
    })
  })
}

export const toggleMode = accountId => {
  return new Promise((resolve, reject) => {
    api.get(`business/${accountId}/toggle-mode`).then(response => {
      if(response && response.status &&response.status === 'success') {
        toggleLocalMode()
        resolve(true)
      } else {
        reject(response.message)
      }
    }).catch(error => {
      reject(error)
    })
  })
}