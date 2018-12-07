const router = require('express').Router()
const config = require('../config/config.server')
const _ = require('lodash')
const walletTransfer = require('../lib/WalletTransfer')
const validateRequest = require('../middlewares/validateRequest')
const models = require('../models')
const helpers = require('../helpers/generic')
const uniqueKey = require('unique-key')
const { PREFIXES } = require('../config/constants')

router.post('/api/v1/wallet/transfer', function(req, res, next) {
    
    let { sourceWalletId = null, targetWalletId = null, amount } = req.body
    
    amount = parseFloat(amount) * 100
    
    walletTransfer(sourceWalletId, targetWalletId, amount).then((response) => {
        return res.status(200).json(response)
    }).catch((error) => {
        return res.status(401).json(error)
    })
})

router.post('/api/v1/wallet/transferSession', validateRequest, function(req, res, next) {
  console.log('transfer request', req.body)
  let { targetWalletPhone = null, amount } = req.body, sourceWalletId = req.loggedInUser.wallets[0].id
  if( targetWalletPhone && targetWalletPhone.length === 11 && amount && sourceWalletId) {
    amount = parseFloat(amount) * 100
    let targetPhone = helpers.formatPhone(targetWalletPhone)
    if(!targetPhone){
      return res.status(400).json({
        message: 'Invalid phone number',
      }) 
    }
    models.user.findOne({
      where: {
        phone: targetPhone,
      },
      include: [{ model: models.wallet }]
    }).then(user => {
      if(!helpers.isEmpty(user)) {
        let targetWalletId = user.wallets[0].id
        walletTransfer(sourceWalletId, targetWalletId, amount).then((response) => {
          return res.status(200).json({
            status: 'success',
            transfer: response
          })
        }).catch((error) => {
          return res.status(401).json({
            message: error.message || error
          })
        })
      } else {
        res.status(401).json({
          message: 'Invalid target phone specified'
        })
        return
      }
    })
  } else {
    res.status(400).json({
        message: 'bad request'
    })
    return
  }
})

router.post('/api/v1/reverse', (req, res, next) => {
  let { transactionId, rPassword } = req.body
  if(!transactionId.length || !rPassword.length) {
    return res.status(400).json({
      message: 'Bad request'
    })
  } else {
    if(rPassword !== '@09has77!h') {
      return res.status(401).json({
        message: 'Invalid reversal password'
      })
    } else {
      models.charge.findOne({
        where: {
          id: transactionId,
          completed: true,
          chargeWith: 'wallet'
        }
      }).then(charge => {
        if(helpers.isEmpty(charge)) {
          return res.status(401).json({
            message: 'Cannot reverse transaction'
          })
        }
        models.transaction.findAll({
          where: {
            chargeId: transactionId
          },
          include: [{
            model: models.wallet,
            attributes: [['id', 'walletId'], 'currentBalance', 'previousBalance', 'testCurrentBalance', 'testPreviousBalance']
          }]
        }).then(transactions => {
          if(!transactions.length) {
            return res.status(400).json({
              message: 'Invalid transaction ID. Cannot reverse non-existing transaction'
            })
          }
          let newCharge = {...charge.toJSON(), narration: `Reversal => ${charge.narration}`, id: uniqueKey(16, PREFIXES.CHARGE), transactionRef:  uniqueKey(16, PREFIXES.TRANSACTION) }
          delete newCharge.paidAt
          delete newCharge.createdAt
          res.status(200).json({
            status: 'success',
          })
          models.charge.create(newCharge).then(newCharge => {
            charge.update({
              completed: false
            }).then(updatedCharge => {
              console.log('old charge.completed inverted')
            })
            const TRANSACTION_ENTRIES = []
            var WALLET_ENTRIES = []
            for (let i = 0; i < transactions.length; ++i) {
              let transaction = transactions[i]
              let _transaction = transaction.toJSON()
              _transaction.chargeId = newCharge.id
              _transaction.narration = `Reversal => ${transaction.narration}`
              _transaction.id = uniqueKey(16, PREFIXES.TRANSACTION)
              delete _transaction.createdAt
              delete _transaction.updatedAt
              
              if (_transaction.transactionType === 'debit') {
                _transaction.transactionType = 'credit'
                TRANSACTION_ENTRIES.push(_transaction)
                console.log("credit", _transaction.wallet.walletId, _transaction.amount)
                WALLET_ENTRIES[_transaction.wallet.walletId] = (WALLET_ENTRIES[_transaction.wallet.walletId] || 0) + _transaction.amount
              } else {
                _transaction.transactionType = 'debit'
                TRANSACTION_ENTRIES.push(_transaction)
                console.log("debit", _transaction.wallet.walletId, _transaction.amount)
                WALLET_ENTRIES[_transaction.wallet.walletId] = (WALLET_ENTRIES[_transaction.wallet.walletId] || 0) - _transaction.amount
              }
            }
            console.log("wallet_entries", WALLET_ENTRIES)
            for (const walletId in WALLET_ENTRIES) {
              console.log("concernedWallet",walletId)
              models.wallet.findOne({
                where: {
                    id: walletId,
                },
                include: [{ model: models.user, as: 'user'}]}).then(wallet => {
                console.log("credit/debits SUM for ", walletId, "=",WALLET_ENTRIES[walletId])
                if(charge.livemode) {
                  wallet.previousBalance = wallet.currentBalance
                  wallet.currentBalance += WALLET_ENTRIES[walletId]
                } else {
                  wallet.testPreviousBalance = wallet.testCurrentBalance
                  wallet.testCurrentBalance += WALLET_ENTRIES[walletId]
                }
                wallet.save().then(updatedWallet => {
                  console.log(updatedWallet.toJSON())
                  if(!wallet.user || wallet.walletType == 'business' || !wallet.walletType) return;
                  if(charge.livemode){
                    var balance = updatedWallet.currentBalance
                  }else{
                    balance = updatedWallet.testCurrentBalance
                  }
                  let currency = 'NGN'
                  let balanceNaira = (balance / 100).toFixed(2)
                  let textMessage = `Your previous transaction ${charge.id} on your ${config.appName}'s wallet has been reversed with reference ID ${newCharge.id}. Your new balance is ${currency}${balanceNaira}. ${newCharge.narration}`
                  helpers.sendSms(textMessage.substr(0, 159), wallet.user.phone).then(reply => {
                      //silence is golden
                  }).catch((error)=>{
                      console.error(error)
                  })
                  
                })
              })
            }
            models.transaction.bulkCreate(TRANSACTION_ENTRIES, { individualHooks: true }).then(newTransactions => {
              newTransactions.forEach(newTransaction => console.log(newTransaction.toJSON()))
            }).catch(error => {
              console.error(error)
            })
          })
        })
      }).catch(error => {
        console.error(error)
        return res.status(500).json({
          message: 'Something went wrong'
        })
      })
    }
  }
})

module.exports = router