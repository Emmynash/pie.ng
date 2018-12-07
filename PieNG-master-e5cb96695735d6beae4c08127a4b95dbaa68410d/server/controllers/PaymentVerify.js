import express from 'express'
import models from '../models'
import helpers from '../helpers/generic'
import uniqueKey from 'unique-key'
import config from '../config/config.server'
const router = express.Router()


router.put('/api/v1/charge/retry-otp/:transactionId', function(req, res, next) {
  const transactionId = req.params.transactionId
  models.charge.findOne({
    where: {
      id: transactionId,
      chargeWith: 'wallet'
    },
    include: [{
      model: models.wallet,
      as: 'customerWallet',
      include: {
        model: models.user,
        as: 'user'
      }
    }]
  }).then(charge => {
    if(helpers.isEmpty(charge)) {
      return res.status(404).json({
        message: 'Invalid request'
      })
    }
    models.wallet.findOne({
      where: {
        id: charge.walletId
      },
      include: [{
        model: models.business,
        as: 'business'
      }]
    }).then(wallet => {
      models.transactionOtp.findOne({
        where: {
          chargeId: transactionId
        }
      }).then(transactionOtp => {
        if(helpers.isEmpty(transactionOtp)) {
          return res.status(400).json({
            message: 'Bad request'
          })
        }
        let updatedAt = new Date(transactionOtp.updatedAt), otp = transactionOtp.otp
        if(!(updatedAt <= new Date() && updatedAt >= new Date(new Date() - 15 * 60 * 1000))) {
          console.log('Old OTP updatedAt ' + updatedAt, otp)
          otp = uniqueKey({size: 6, charType: 'numeric'})
          return transactionOtp.update({
            otp
          })
        }
        return new Promise(resolve => resolve(transactionOtp))
      }).then(updateTransactionOtp => {
        let textMessage = `Your ${config.appName} OTP is ${updateTransactionOtp.otp}. You requested for this OTP when you started a transaction to pay ${wallet.business.name} the sum of ${charge.currency}${(charge.amountToPay/100).toFixed(2)}`
        helpers.sendSms(textMessage, charge.customerWallet.user.phone, 'OTP', true).then(response => {
          return res.status(200).json({
            status: 'success',
            updatedAt: updateTransactionOtp.updatedAt
          })
        }).catch(error => {
          console.log(error)
          return res.status(500).json({
            message: 'Sorry, we could not deliver your requested OTP'
          })
        })
      }).catch(error => {
        console.log(error)
        return res.status(500).json({
          message: 'Sorry, an error occurred and the server could not process your request'
        })
      })
    }).catch(error => {
      console.log(error)
      return res.status(500).json({
        message: 'Sorry, an error occurred and the server could not process your request'
      })
    })
  }).catch(error => {
    console.log(error)
    return res.status(500).json({
      message: 'Sorry, an error occurred and the server could not process your request'
    })
  })
})

module.exports = router
