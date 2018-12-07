const models = require('../models')
const config = require('../config/config.server')
const _ = require('lodash')
const uniqueKey = require('unique-key')
const helpers = require('../helpers/generic')
const { INVALID_REQUEST, SERVER_ERROR, NOT_AUTHORIZED, PREFIXES } = require('../config/constants')

module.exports = (sourceWalletId, targetWalletId, amount, narration = null) => {
    //amount assumed to be in kobo
    console.log('transfer', sourceWalletId, targetWalletId, amount)
    let currency = 'NGN'
    return new Promise( (resolve, reject) => {
       models.wallet.findOne({
        where: {
          id: sourceWalletId,
        },
        include: [{ model: models.user, as: 'user'}]
      }).then(sourceWallet => {
        if(_.isEmpty(sourceWallet)) {
          return reject('invalid source wallet')
        }
        if(config.env === 'production') {
            if(sourceWallet.currentBalance < amount){
                return reject('insufficient account balance')
            }
        }else{
            if(sourceWallet.testCurrentBalance < amount){
                return reject('insufficient account balance')
            }
        }

        return models.wallet.findOne({
            where: {
                id: targetWalletId,
            },
            include: [{ model: models.user, as: 'user'}]
        }).then((targetWallet) => {
            console.log('targetWallet', targetWallet)
            if(_.isEmpty(targetWallet)) {
                return reject('invalid source wallet')
            }
            if(config.env === 'production'){
                // transfer is only possible in production, or it's a pie test
                sourceWallet.previousBalance = sourceWallet.currentBalance
                sourceWallet.currentBalance -= amount
                targetWallet.previousBalance = targetWallet.currentBalance
                targetWallet.currentBalance += amount
            }else{
                sourceWallet.testPreviousBalance = sourceWallet.testCurrentBalance
                sourceWallet.testCurrentBalance -= amount
                targetWallet.testPreviousBalance = targetWallet.testCurrentBalance
                targetWallet.testCurrentBalance += amount
            }
            targetWallet.save().then((targetWalletUpdate) => {
                sourceWallet.save().then((sourceWalletUpdate)=>{
                    resolve({sourceWalletUpdate, targetWalletUpdate})
                    //Notify the caller early, while doing double entry in background
                    return models.charge.create({
                        id: uniqueKey(16, PREFIXES.CHARGE),
                        transactionRef: uniqueKey(16, PREFIXES.TRANSACTION),
                        sourceWalletId: sourceWalletId,
                        targetWalletId: targetWalletId,
                        walletId: targetWalletId,
                        rawAmount: amount,
                        chargeType: 'transfer',
                        authType: 'direct',
                        pendingValidation: false,
                        completed: true,
                        chargeWith: 'wallet',
                        status: 'success',
                        livemode: (config.env === 'production' ? 1 : 0),
                        narration: narration || 'machine transfer',
                        netDebitAmount: 0,
                        businessCommission: 0,
                        serviceCharge: 0,
                        amountToPay: amount,
                    }).then((charge)=>{
                        let balance = (config.env === 'production' ? sourceWallet.currentBalance : sourceWallet.testCurrentBalance)
                        if(sourceWallet.walletType === 'personal' && sourceWallet.user && sourceWallet.id !== config.walletFundingService){
                            let amountNaira = (amount / 100).toFixed(2)
                            let balanceNaira = (balance / 100).toFixed(2)
                            let textMessage
                            if(narration){
                                textMessage = `Your ${config.appName}'s wallet has been debited with ${currency}${amountNaira} with reference ID ${charge.id}. Your new balance is ${currency}${balanceNaira} ${narration}`
                            }else{
                               textMessage =  `Your ${config.appName}'s wallet has been debited with ${currency}${amountNaira} with reference ID ${charge.id}. Your new balance is ${currency}${balanceNaira}`
                            }
                            helpers.sendSms(textMessage, 
                                sourceWallet.user.phone).then(reply => {
                                //silence is golden,
                                /*Todo: Track the message {progress, sent, delivered}
                                { reference_id: '257C8A63ED8402689150893832A98FDC',
                                  status: { code: 290, description: 'Message in progress' },
                                  external_id: null 
                                }
                                */
                                // console.log('sourceWallet', reply)
                            }).catch((error) => {
                                console.log(error)
                            })
                        }//else { businesses don't yet have SMS Alerts }
                        balance = (config.env === 'production' ? targetWallet.currentBalance : targetWallet.testCurrentBalance)
                        if(targetWallet.walletType === 'personal' && targetWallet.user){
                            let amountNaira = (amount / 100).toFixed(2)
                            let balanceNaira = (balance / 100).toFixed(2)
                            let textMessage
                            if(narration) {
                                textMessage = `Your ${config.appName}'s wallet has been credited with ${currency}${amountNaira} with reference ID ${charge.id}. Your new balance is ${currency}${balanceNaira} ${narration}`
                            }else{
                               textMessage =  `Your ${config.appName}'s wallet has been credited with ${currency}${amountNaira} with reference ID ${charge.id}. Your new balance is ${currency}${balanceNaira}`
                            }
                            helpers.sendSms(textMessage, 
                                targetWallet.user.phone).then(reply => {
                                //silence is golden
                                console.log('targetWallet', reply)
                            }).catch((error)=>{
                                console.error(error)
                            })
                        }//else{ businesses don't yet have SMS Alerts }
                        models.transaction.create({
                            id: uniqueKey(16, PREFIXES.TRANSACTION),
                            walletId: sourceWalletId,
                            transactionType: 'debit',
                            narration: narration || 'transfer',
                            amount,
                            currency: 'NGN',
                            livemode: (config.env === 'production' ? 1 : 0),
                            chargeId: charge.id
                        }).catch((error)=>{
                            console.error(error)
                        })
                        models.transaction.create({
                            id: uniqueKey(16, PREFIXES.TRANSACTION),
                            walletId: targetWalletId,
                            transactionType: 'credit',
                            narration: narration || 'transfer',
                            amount,
                            currency: 'NGN',
                            livemode: (config.env === 'production' ? 1 : 0),
                            chargeId: charge.id
                        }).catch((error)=>{
                            console.error(error)
                        })
                    }).catch((error)=>{
                        console.error(error)
                    })
                        
                }).catch((error)=>{
                    console.error(error)
                    return reject('an unexpected error occured updating source wallet')
                })
            }).catch((error)=>{
                console.error(error)
                return reject('an unexpected error occured updating target wallet')
            })
        }).catch((error) => {
            console.error(error)
            return reject('error retrieving receipient\'s wallet')
        })
      }).catch((error) => {
          console.error(error)
          return reject('error retrieving source\'s wallet')
      })
    })
}