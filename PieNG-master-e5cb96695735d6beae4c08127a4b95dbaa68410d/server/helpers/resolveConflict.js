const unirest = require('unirest')
const models = require('../models')
const helpers = require('../helpers/generic')
const walletTransfer = require('../lib/WalletTransfer')

const comparer = (otherArray) => {
  return current => {
    return otherArray.filter(other => {
      return other.transaction_reference === current.id // && other.display === current.display
    }).length === 0
  }
}

module.exports = (businessId, endpoint) => {
  return new Promise((resolve, reject) => {
    models.business.findById(businessId, { include: [{ model: models.wallet, as: 'wallets' }] }).then(business => {
      if (!helpers.isEmpty(business)) {
        let wallets = []
        for (let j = 0; j < business.wallets.length; ++j) {
          wallets.push(business.wallets[j].id)
        }
        console.log('wallets', wallets)
        unirest.get(endpoint).end(response => {
          if (response && response.body && ( (response.body instanceof Array ) || response.body === Object(response.body) )) {
            const transactions = response.body
            models.charge.findAll({
              attributes: ['id', 'amountToPay', 'sourceWalletId', 'targetWalletId'],
              where: {
                completed: true,
                walletId: { $in: wallets }
              }
            }).then(charges => {
              const leftOvers = charges.filter(comparer(transactions))
              resolve(leftOvers)
            }).catch(error => {
              console.error(error)
              reject(error)
            })
          }
        })
      } else {
        console.error('Business not found')
        reject(new Error('Business not found'))
      }
    })
  })
}