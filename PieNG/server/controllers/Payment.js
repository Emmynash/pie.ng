const config = require('../config/config.server')
const router = require('express').Router()
const models = require('../models')
const uniqueKey = require('unique-key')
const parseFullName = require('parse-full-name').parseFullName
const _ = require('lodash')
const helpers = require('../helpers/generic')
const CrossServer = require('../helpers/crossServer')
const { INVALID_REQUEST, SERVER_ERROR, NOT_AUTHORIZED, PREFIXES } = require('../config/constants')
const walletTransfer = require('../lib/WalletTransfer')

/**
 * Directly charge a customer
 *
 */
router.post('/api/v1/charge', (req, res, next) => {
  console.log('\x1b[31m', req.body)
  console.log('\x1b[0m', req.body)
  let {
    publicKey, email, chargeWith = 'card',
    CCnumber, CCcvc, CCname,
    CCexpiry, amount = 0, CCpin = '',
    currency = 'NGN', phone = '08181484568',
    accNumber = '',  bankCode = '', narration = 'Payment', accName = '',
    commission = 0, inclusive = true, commissionWallet = 'default',
    wallet = 'default', cardType = 'verve',
    reference = ''
  } = req.body
  let { first, last, middle = '' } = parseFullName(CCname || accName),
      customerId = uniqueKey(24, PREFIXES.CUSTOMER)
  phone = helpers.formatPhone(phone)
  let businessReference = reference
  if(!phone){
    return res.status(400).json({
      message: 'Invalid phone number',
    })
  }
  if(!publicKey.length || !email.length
    || !(chargeWith === 'card' || chargeWith === 'account' || chargeWith === 'wallet')
    || !narration.length  || !amount) {
    // One of the above field is empty or invalid
    return res.status(400).json({
      message: 'Invalid request',
    })
  } else {
    var pool = {}
    models.business.findOne({
      where: { $or: [{ apiKey: publicKey }, { testApiKey: publicKey }] },
      include: [{ model: models.wallet, as: 'wallets' }]
    }).then(business => {
      pool['business'] = business || {}
      pool['livemode'] = (business.apiKey === publicKey ? true : false)
      return models.wallet.findById(commissionWallet)
    }).then(commissionWalletObjx => {
      if(!helpers.isEmpty(commissionWalletObjx)) {
        pool.business.wallets.push(commissionWalletObjx)
      }
      let moneywave = config.moneywave
      if(pool.business && (pool.livemode === 0 || pool.livemode === false || pool.livemode === false)/* && config.env === 'production'*/){
        console.log(pool.livemode)
        console.log('fakemoney detection', pool.business)
        moneywave.baseUrl = 'https://fake-moneywave.herokuapp.com'
        moneywave.apiKey = 'ts_LieLieApiKey'
        moneywave.apiSecret = 'ts_LieLieApiSecret'
      } else {
        if(pool.business.mwLivePubKey && pool.business.mwLiveSecretKey && !_.isNull(pool.business.mwLivePubKey) && !_.isNull(pool.business.mwLiveSecretKey)){
          //Westpoint Consult (Imo) and Paarpoint (Niger)
          moneywave.apiKey = pool.business.mwLivePubKey
          moneywave.apiSecret = pool.business.mwLiveSecretKey
        }
      }
      if(!_.isEmpty(pool.business) && _.has(pool.business, 'wallets') && pool.business.wallets.length) {
        // Get the default or specified wallet
        const walletObj = pool.business.wallets.find((wObj, i) => {
          if(i === pool.business.wallets.length) {
            return pool.business.wallets[0] // If no wallet is found, return the first wallet which is probably the default one
          }
          return (wObj.tag === wallet) || (wObj.id === wallet)
        })
        // Get the commission wallet
        const commissionWalletObj = pool.business.wallets.find((wObj, i) => {
          if(i === pool.business.wallets.length) {
            return pool.business.wallets[0] // If no wallet id
          }
          return (wObj.tag === commissionWallet) || (wObj.id === commissionWallet)
        })
        pool['wallet'] = walletObj
        pool['commissionWallet'] = commissionWalletObj
        return models.customer.findOrCreate({
          where: { businessId: pool.business.id, email, fName: first, lName: last },
          defaults: { phone, id: customerId, active: true }
        }).spread((customer, created) => {
          pool['customer'] = customer.toJSON()
          if(chargeWith === 'card') {
            let [ expMonth, expYear ] = CCexpiry.replace(/ /g,'').split('/')
            CCnumber = CCnumber.replace(/ /g, '')
            return models.customerCard.findOrCreate({
              where: {
                customerId: customer.id, expYear, expMonth,
                verification: CCcvc, number: CCnumber, pin: CCpin, type: cardType
              },

              defaults: { id: uniqueKey(20, PREFIXES.CARD), fName: first, lName: last, mName: middle, livemode: pool.livemode }
            })
          } else if(chargeWith === 'account') {
            return models.customerAccount.findOrCreate({
              where: { customerId: customer.id, number: accNumber, bankCode },
              defaults: { id: uniqueKey(16, PREFIXES.CUSTOMER_ACCOUNT), name: accName, livemode: pool.livemode }
            })
          } else {
            // Charge from wallet
            return models.wallet.findOne({
              include: [{ model: models.user, as: 'user',  where: { phone }}]
            })
          }
        }).then(chargeFrom => {
          if(chargeWith === 'wallet' && !helpers.isEmpty(chargeFrom) && !helpers.isEmpty(chargeFrom.user)) {
            // Charge from wallet
            pool['chargeFrom'] = chargeFrom // In which case findById returned an Object
            const chargeId = uniqueKey(16, PREFIXES.CHARGE)
            if(inclusive && (parseFloat(commission) > parseFloat(amount))) {
              return res.status(400).json({
                message: 'Your commission can not be greater than the amount you are charging'
              })
            }
            if(inclusive && (parseFloat(commission) > parseFloat(amount))) {
              return res.status(400).json({
                message: 'Your commission can not be greater than the amount you are charging'
              })
            }
            let extraCharge = [], charges
            try {
              if(pool.business.walletTransactionChargeAbs > 0) {
                console.log('walletTransactionChargeAbs', pool.business.walletTransactionChargeAbs)
                extraCharge.push(pool.business.walletTransactionChargeAbs)
              }
              charges = require('../helpers/walletServiceCharge')(amount, inclusive, commission, ...extraCharge)
            } catch(e) {
              return res.status(401).json({
                message: e.message
              })
            }
            models.charge.create({
              id: chargeId, amountToPay: charges.amount, serviceCharge: charges.gateWayCommission, businessCommission: charges.businessCommission,
              narration, livemode: pool.livemode, currency, chargeWith, authType: 'OTP',
              customerId: pool.customer.id, customerWalletId: chargeFrom.id, walletId: pool.wallet.id,
              commissionWalletId: pool.commissionWallet.id, businessId: pool.business.id, rawAmount: amount, businessReference
            }).then(charge => {
              const OTP = ((pool.livemode === 0 || pool.livemode === false || pool.livemode === false) && ['2347059528155','2348181484568'].indexOf(chargeFrom.user.phone) > -1 ? '123456' : uniqueKey({size: 6, charType: 'numeric'}) )
              return models.transactionOtp.create({ otp: OTP, id: uniqueKey('trnx_otp_', 24), chargeId: charge.id }).then(tansactionOTP => {
                if((pool.livemode === 0 || pool.livemode === false) && ['2347059528155','2348181484568'].indexOf(chargeFrom.user.phone) > -1){
                  return res.status(201).json({
                    status: 'success',
                    transaction: charge
                  })
                }
                const body = `Your ${config.appName} OTP is ${OTP}. You requested for this OTP when you started a transaction to pay ${pool.business.name} the sum of ${currency}${parseFloat(amount).toFixed(2)}`//TODO: consider what users will see that they are paying for.
                helpers.sendSms(body, chargeFrom.user.phone).then(reply => {
                  charge = charge.toJSON()
                  console.log('charge', charge)
                  charge.transactionRef = undefined
                  charge.transactionToken = undefined
                  charge.moneywaveCommission = undefined
                  charge.amountToPay /= 100
                  charge.businessCommission /= 100
                  charge.serviceCharge /= 100
                  return res.status(201).json({
                    status: 'success',
                    transaction: charge
                  })
                }).catch(e => {
                  console.error(e)
                  return res.status(200).json({
                    message: `We could not send your requested OTP to ${helpers.unformatPhone(phone)}`
                  })
                })
              })
            }).catch(e => {
              console.error(e)
              return res.status(500).json({
                message: 'Opps! Something went wrong. Please try again later'
              })
            })
          } else if(!helpers.isEmpty(chargeFrom)) {
            // Charge from bank acoount or card
            chargeFrom = chargeFrom[0] // That means the findOrCreate returned an array
            pool['chargeFrom'] = chargeFrom
            const charges = require('../helpers/serviceCharge')(amount, inclusive, commission)
            console.log(moneywave)
            CrossServer.post('merchant/verify', {
              'baseUrl': moneywave.baseUrl,
              'apiKey': moneywave.apiKey,
              'secret': moneywave.apiSecret
            }).then(Response => {
              let params = {
                'firstname': pool.customer.fName,
                'lastname': pool.customer.lName,
                'email': pool.customer.email || 'admin@lpay.com',
                'phonenumber': '+' + pool.customer.phone,
                'apiKey' : moneywave.apiKey,
                'narration': narration,
                'medium': 'web',
                'redirecturl': 'https://logicaladdress.com',
                'amount': charges.amount/100,
                'fee': charges.allCommissions/100,
                'recipient': 'wallet',
              }
              if(chargeWith === 'card') {
                params = {...params,
                  'card_no': chargeFrom.number,
                  'cvv': chargeFrom.verification,
                  'expiry_year': chargeFrom.expYear,
                  'expiry_month': chargeFrom.expMonth,
                  'charge_auth': 'PIN',
                  'pin': chargeFrom.pin,
                }
              } else {
                params = {...params,
                 'charge_with': 'account',
                 'sender_account_number': chargeFrom.number,
                 'sender_bank': chargeFrom.bankCode,
                }
              }
              params['baseUrl'] = moneywave.baseUrl
              console.log(moneywave)
              CrossServer.post('transfer', params, {
                'Authorization': Response.token,
              }).then(response => {
                console.log('moneywave response production', moneywave.baseUrl)
                let chargeId = uniqueKey(16, PREFIXES.CHARGE)
                const chargeObj = {
                  id: chargeId, narration, customerId: pool.customer.id, message: 'Payment', amountToPay: charges.amount,
                  serviceCharge: charges.gateWayCommission, businessCommission: charges.businessCommission,
                  walletId: pool.wallet.id, businessId: pool.business.id, commissionWalletId: pool.commissionWallet.id,
                  currency: response.data.transfer.chargeCurrency, livemode: pool.livemode,
                  transactionRef: response.data.transfer.flutterChargeReference, transactionToken: Response.token,
                  authType: /*response.data.transfer.authparams[0].validateparameter || */'OTP', chargeWith
                }
                if(chargeWith === 'account') chargeObj['accountId'] = chargeFrom.id
                if(chargeWith === 'card') chargeObj['cardId'] = chargeFrom.id
                models.charge.create(chargeObj).then(charge => {
                  charge = charge.toJSON()
                  console.log('charge', charge)
                  charge['customer'] = pool.customer
                  charge.transactionRef = undefined
                  charge.transactionToken = undefined
                  charge.moneywaveCommission = undefined
                  charge.amountToPay = charge.amountToPay / 100
                  charge.businessCommission = charge.businessCommission / 100
                  charge.serviceCharge = charge.serviceCharge / 100
                  return res.status(201).json({
                    status: 'success',
                    transaction: charge
                  })
                }).catch(error => {
                  console.error(error)
                  return res.status(500).json({
                    message: 'Oops! Something went wrong!'
                  })
                })
              }).catch(error => {
                if(error.data === 'International Cards not permitted on this Platform') var message = 'Oops! Bad timing.|Sorry, we do not support international cards for now'
                var serverError = (error.message || 'Oops! Something went wrong!') + '|' + (error.data || 'An error occured while we were trying to bill your card')
                console.error('success else', error)
                return res.status(500).json({
                  message: message || serverError,
                })
              })
            }).catch(error => {
              console.error(error)
              return res.status(error.status || 500).json({
                message: error.message || 'Oops! Something went wrong!'
              })
            })
          } else {
            console.log('The wallet does not exist')
            return res.status(401).json({
              message: 'The wallet does not exist'
            })
          }
        }).catch(error => {
          console.error(error)
          res.status(error.status || 500).json({
            message: error.message || 'Oops! Something went wrong!'
          })
          return
        })
      } else if(!_.isEmpty(pool.business) && (!_.has(pool.business, 'wallets') || !pool.business.wallets.length)) {
        console.log('No wallet attached to business')
        res.status(400).json({
          message: `No wallet attached to this app|If you are the owner of this app, goto ${config.appUrl} and add at least one wallet for your business`
        })
        return
      } else {
        console.log(401, 'Invalid API key')
        res.status(401).json({
          message: 'Invalid API key'
        })
        return
      }
    }).catch(e => {
      console.error(e)
      res.status(500).json({
        message: 'Oops! Something went wrong. Please try again later'
      })
      return
    })
  }
})

router.post('/api/v1/charge/verify', (req, res, next) => {
  let { transactionId = '', publicKey = '', authValue = '' } = req.body, pool = {}
  if(!transactionId.length || !publicKey.length || !authValue.length) {
    res.status(400).json({
      message: 'Incomplete validation params',
    })
    return
  } else {
    return models.business.findOne({
      where: { $or: [{ apiKey: publicKey }, { testApiKey: publicKey }] },
    }).then(business => {
      if(!_.isEmpty(business)) {
        pool['livemode'] = (business.apiKey === publicKey)
        let moneywave = config.moneywave
        if(business && (pool.livemode === 0 || pool.livemode === false || pool.livemode === false)/* && config.env === 'production'*/) {
          console.log(pool.livemode)
          console.log('fakemoney detection', business)
          moneywave.baseUrl = 'https://fake-moneywave.herokuapp.com'
          moneywave.apiKey = 'ts_LieLieApiKey'
          moneywave.apiSecret = 'ts_LieLieApiSecret'
        } else {
          if(business.mwLivePubKey && business.mwLiveSecretKey && !_.isNull(business.mwLivePubKey) && !_.isNull(business.mwLiveSecretKey)){
            //Westpoint Consult (Imo) and Paarpoint (Niger)
            moneywave.apiKey = business.mwLivePubKey
            moneywave.apiSecret = business.mwLiveSecretKey
          }
        }
        return models.charge.findOne({ where: { id: transactionId, completed: false } }).then(charge => {
          if(!_.isEmpty(charge)) {
            if(charge.chargeWith === 'wallet') {
              // Transaction if from wallet
              return models.transactionOtp.findOne({//use or query: id or chargei
                where: { chargeId: transactionId, otp: authValue, createdAt: { $lte: new Date(), $gte: new Date(new Date() - 15 * 60 * 1000) } },
              }).then(transactionOtp => {
                if(!_.isEmpty(transactionOtp)) {
                  transactionOtp.destroy().then(() => {
                    return models.wallet.findOne({
                        where: {
                          id: charge.customerWalletId,
                        },
                        include: [{ model: models.user, as: 'user'}]
                      }).then(customerWallet => {
                      let currentBalance = ((charge.livemode === 1 || charge.livemode === true) ? customerWallet.currentBalance : customerWallet.testCurrentBalance)
                      if(currentBalance >= (charge.amountToPay + charge.serviceCharge + charge.businessCommission)) {
                        // Customer's wallet has sufficient balance
                        charge.updateAttributes({
                          pendingValidation: false, completed: true,
                          netDebitAmount: charge.amountToPay
                        }).then(updatedCharge => {
                          const TRANSACTION_ENTRY = [{ //creditGatewayUserFromVirtualUser: {
                            id: uniqueKey(16, PREFIXES.TRANSACTION),
                            transactionType: 'credit',
                            amount: charge.serviceCharge,
                            currency: charge.currency,
                            narration: `${charge.narration} - Service charge`,
                            walletId: config.gatewayUserWalletId,
                            livemode: charge.livemode,
                            chargeId: charge.id
                          }, {
                            id: uniqueKey(16, PREFIXES.TRANSACTION),
                            transactionType: 'debit',
                            amount: charge.serviceCharge,
                            currency: charge.currency,
                            narration: `${charge.narration} - Service charge`,
                            walletId: charge.customerWalletId,
                            livemode: charge.livemode,
                            chargeId: charge.id
                          }, {
                            id: uniqueKey(16, PREFIXES.TRANSACTION),
                            transactionType: 'credit',
                            amount: charge.amountToPay,
                            currency: charge.currency,
                            narration: `${charge.narration} #${charge.businessReference}`,
                            walletId: charge.walletId,
                            livemode: charge.livemode,
                            chargeId: charge.id
                          }, {
                            id: uniqueKey(16, PREFIXES.TRANSACTION),
                            transactionType: 'debit',
                            amount: charge.amountToPay,
                            currency: charge.currency,
                            narration: charge.narration,
                            walletId: charge.customerWalletId,
                            livemode: charge.livemode,
                            chargeId: charge.id
                          }, {
                            id: uniqueKey(16, PREFIXES.TRANSACTION),
                            transactionType: 'credit',
                            amount: charge.businessCommission,
                            currency: charge.currency,
                            narration: `${charge.narration} - Business service Charge`,
                            walletId: charge.commissionWalletId,
                            livemode: charge.livemode,
                            chargeId: charge.id
                          }, {
                            id: uniqueKey(16, PREFIXES.TRANSACTION),
                            transactionType: 'debit',
                            amount: charge.businessCommission,
                            currency: charge.currency,
                            narration: `${charge.narration} - Business service Charge`,
                            walletId: charge.customerWalletId,
                            livemode: charge.livemode,
                            chargeId: charge.id
                          }]
                          models.transaction.bulkCreate(TRANSACTION_ENTRY, { individualHooks: true })
                          .then(results => {
                            const allWallets = [charge.walletId, charge.customerWalletId, config.gatewayUserWalletId]
                            if(charge.walletId !== charge.commissionWalletId) allWallets.push(charge.commissionWalletId)
                            return models.wallet.findAll({
                              where: { id: { $in: allWallets }  }
                            })
                          }).then(concernedWallets => {
                            concernedWallets.forEach(concernedWallet => {
                              let currentBalance = (charge.livemode === 1 || charge.livemode === true) ? concernedWallet.currentBalance : concernedWallet.testCurrentBalance,
                                  previousBalance = currentBalance
                              if(concernedWallet.id === config.gatewayUserWalletId) {
                                currentBalance += charge.serviceCharge
                                /*
                                const body = `Your ${config.appName} wallet has been credited with ${currency}${amount}`
                                helpers.sendSms(body, phone).then(reply => {

                                });*/
                              }
                              if(concernedWallet.id === charge.commissionWalletId) {
                                currentBalance += charge.businessCommission
                                /*
                                const body = `Your ${config.appName} wallet has been credited with ${currency}${amount}`
                                helpers.sendSms(body, phone).then(reply => {

                                });*/
                              }
                              if(concernedWallet.id === charge.walletId) {
                                currentBalance += charge.amountToPay
                                console.log('--------')
                                console.log(charge.walletId, config.walletFundingService, req.loggedInUser)
                                if(charge.walletId === config.walletFundingService && req.loggedInUser){
                                  //This transaction is from a wallet funding service
                                  console.log('xyz')
                                  let defaultWalletId, uWallets = req.loggedInUser.wallets
                                  for(var i = 0; (uWallets && i < uWallets.length); i++){
                                    if(uWallets[i].tag === 'default'){
                                      defaultWalletId = uWallets[i].id
                                      break
                                    }
                                  }
                                  walletTransfer(charge.walletId, defaultWalletId, charge.amountToPay).then((response) => {
                                    //silence is golden
                                  }).catch(error => {
                                    console.error(error)
                                  })
                                }
                                /*
                                const body = `Your ${config.appName} wallet has been credited with ${currency}${amount}`
                                helpers.sendSms(body, phone).then(reply => {

                                });*/
                              }
                              if(concernedWallet.id === charge.customerWalletId) {
                                currentBalance -= (charge.amountToPay + charge.businessCommission + charge.serviceCharge)
                                let debitAmount = charge.amountToPay + charge.businessCommission + charge.serviceCharge
                                let amountNaira = (debitAmount / 100).toFixed(2)
                                let balanceNaira = (currentBalance / 100).toFixed(2)
                                helpers.sendSms(`Your ${config.appName}'s wallet has been debited with ${charge.currency}${amountNaira} with reference ID ${charge.id}. Your new balance is ${charge.currency}${balanceNaira}`,
                                  customerWallet.user.phone).then(reply => {
                                  //silence is golden
                                  console.log('SMS Debit Notification', reply)
                                }).catch(error => {
                                    console.error(error)
                                })
                              }
                              let updateWallet = {}
                              if((charge.livemode === 1 || charge.livemode === true)) {
                                updateWallet['currentBalance'] = currentBalance
                                updateWallet['previousBalance'] = previousBalance
                              } else {
                                updateWallet['testCurrentBalance'] = currentBalance
                                updateWallet['testPreviousBalance'] = previousBalance
                              }
                              concernedWallet.update(updateWallet)
                            })
                          }).catch(error => {
                            console.log(error)
                            return res.status(500).json({
                              message: 'Oopse!! error occured',
                            })
                          })
                          console.log('result', updatedCharge)
                          return res.status(202).json({
                            status: 'success',
                            transaction: updatedCharge,
                          })
                        }).catch(error => {
                          console.error(error)
                          return res.status(500).json({
                            message: 'Oops! Something went wrong. Please, try again later'
                          })
                        })
                      } else {
                        console.log('Insuficient balance')
                        return res.status(400).json({
                          message: 'Insuficient funds in wallet'
                        })
                      }
                    }).catch(error => {
                      console.error(error)
                      return res.status(500).json({
                        message: 'Oopse!! an error occured',
                      })
                    })
                  }).catch(error => {
                    return res.status(500).json({
                      message: 'An error occurred and we could not continue with your request. Please try again shortly'
                    })
                  })
                } else {
                  return res.status(401).json({
                    message: 'Invalid OTP entered'
                  })
                }
              }).catch(error => {
                console.error(error)
                return res.status(400).json({
                  message: 'OTP not found'
                })
              })
            } else {
              // Transaction is from card or bank account
              let params = {
                transactionRef: charge.transactionRef,
              }, moneywaveUrl = ''
              if(charge.chargeWith === 'card') {
                params['otp'] = authValue
                moneywaveUrl += 'transfer/charge/auth/card'
              } else {
                params['authType'] = charge.authType
                params['authValue'] = authValue
                params['paramstring'] = 'OTP'
                moneywaveUrl += 'transfer/charge/auth/account'
              }
              params['baseUrl'] = moneywave.baseUrl
              console.log(`sending resquest to ${moneywaveUrl}`)
              console.log('params', params)
              console.log(moneywave)
              CrossServer.post(moneywaveUrl, params, { 'Authorization': charge.transactionToken }).then(response => {
                charge.updateAttributes({
                  pendingValidation: false, completed: true,
                  netDebitAmount: parseFloat(response.data.netDebitAmount) * 100,
                  moneywaveCommission: (config.env === 'production' ? parseFloat(response.data.moneywaveCommission) * 100 : (0.014 * parseFloat(response.data.netDebitAmount) * 100) + 1000), // Test environment: Flutterwave returns 0 as transaction charge
                }).then(result => {
                  console.log('result', result)
                  console.log('sending response ahead of time')
                  res.json({
                    status: 'success',
                    transaction: {
                      id: result.id,
                      amountToPay: result.amountToPay,
                      rawAmount: result.rawAmount,
                      serviceCharge: result.serviceCharge,
                      businessCommission: result.businessCommission,
                      netDebitAmount: result.netDebitAmount,
                      moneywaveCommission: result.moneywaveCommission,
                      narration: result.narration,
                      livemode: result.livemode,
                      message: result.message,
                      chargeWith: result.chargeWith,
                      transactionRef: result.transactionRef,
                      authType: result.authType
                    },
                  })
                  const TRANSACTION_ENTRY = [{
                    id: uniqueKey(16, PREFIXES.TRANSACTION),
                    transactionType: 'credit',
                    amount: charge.netDebitAmount,
                    currency: charge.currency,
                    narration: `${charge.narration} - Pay virtual user sum total`,
                    walletId: config.virtualUserWalletId,
                    livemode: charge.livemode,
                    chargeId: charge.id
                  }, {
                    id: uniqueKey(16, PREFIXES.TRANSACTION),
                    transactionType: 'debit',
                    amount: charge.netDebitAmount,
                    currency: charge.currency,
                    narration: `${charge.narration} - Pay sales virtual user sum total`,
                    walletId: config.salesWalletId,
                    livemode: charge.livemode
                  }, {
                    id: uniqueKey(16, PREFIXES.TRANSACTION),
                    transactionType: 'debit',
                    // amount: charge.moneywaveCommission,
                    amount: (config.env === 'production' ? charge.moneywaveCommission : (0.014 * charge.netDebitAmount) + 1000 ),
                    currency: charge.currency,
                    narration: `${charge.narration} - charge virtual user to Moneywave (service charge)`,
                    walletId: config.virtualUserWalletId,
                    livemode: charge.livemode,
                    chargeId: charge.id
                  }, {
                    id: uniqueKey(16, PREFIXES.TRANSACTION),
                    transactionType: 'credit',
                    // amount: charge.moneywaveCommission,
                    amount: (config.env === 'production' ? charge.moneywaveCommission : (0.014 * charge.netDebitAmount) + 1000),
                    currency: charge.currency,
                    narration: `${charge.narration} - Pay Moneywave (service charge)`,
                    walletId: config.mWUserWalletId,
                    livemode: charge.livemode,
                    chargeId: charge.id
                  }, { //debitVirtualUserToGatewayUser: {
                    id: uniqueKey(16, PREFIXES.TRANSACTION),
                    transactionType: 'debit',
                    amount: charge.serviceCharge,
                    currency: charge.currency,
                    narration: `${charge.narration} - Charge virtual user to gateway service charge`,
                    walletId: config.virtualUserWalletId,
                    livemode: charge.livemode,
                    chargeId: charge.id
                  }, {
                    id: uniqueKey(16, PREFIXES.TRANSACTION),
                    transactionType: 'credit',
                    amount: charge.serviceCharge,
                    currency: charge.currency,
                    narration: `${charge.narration} - Pay gateway service charge`,
                    walletId: config.gatewayUserWalletId,
                    livemode: charge.livemode,
                    chargeId: charge.id
                  }, {
                    id: uniqueKey(16, PREFIXES.TRANSACTION),
                    transactionType: 'debit',
                    amount: charge.amountToPay,
                    currency: charge.currency,
                    narration: `${charge.narration} - Charge virtual user amount`,
                    walletId: config.virtualUserWalletId,
                    livemode: charge.livemode,
                    chargeId: charge.id
                  }, {
                    id: uniqueKey(16, PREFIXES.TRANSACTION),
                    transactionType: 'credit',
                    amount: charge.amountToPay,
                    currency: charge.currency,
                    narration: charge.narration,
                    walletId: charge.walletId,
                    livemode: charge.livemode,
                    chargeId: charge.id
                  }, {
                    id: uniqueKey(16, PREFIXES.TRANSACTION),
                    transactionType: 'debit',
                    amount: charge.businessCommission,
                    currency: charge.currency,
                    narration: `${charge.narration} - Service Charge`,
                    walletId: config.virtualUserWalletId,
                    livemode: charge.livemode,
                    chargeId: charge.id
                  }, {
                    id: uniqueKey(16, PREFIXES.TRANSACTION),
                    transactionType: 'credit',
                    amount: charge.businessCommission,
                    currency: charge.currency,
                    narration: `${charge.narration} - Service Charge`,
                    walletId: charge.commissionWalletId,
                    livemode: charge.livemode,
                    chargeId: charge.id
                  }]
                  models.transaction.bulkCreate(TRANSACTION_ENTRY, { individualHooks: true })
                  .then(results => {
                    const allWallets = [config.mWUserWalletId, config.gatewayUserWalletId, charge.walletId, config.salesWalletId]
                    if(charge.walletId !== charge.commissionWalletId) allWallets.push(charge.commissionWalletId)
                    return models.wallet.findAll({
                      where: { id: { $in: allWallets }  }
                    })
                  }).then(businessWallets => {
                    businessWallets.forEach(businessWallet => {
                      let currentBalance = ((charge.livemode === 1 || charge.livemode === true) ? businessWallet.currentBalance : businessWallet.testCurrentBalance),
                          previousBalance = currentBalance
                      if( businessWallet.id === config.mWUserWalletId ) {
                        currentBalance += charge.moneywaveCommission
                      }
                      if( businessWallet.id === config.gatewayUserWalletId ) {
                        currentBalance += charge.serviceCharge
                      }
                      if( businessWallet.id === charge.commissionWalletId ) {
                        currentBalance += charge.businessCommission
                      }
                      if( businessWallet.id === charge.walletId ) {
                        currentBalance += charge.amountToPay
                      }
                      if( businessWallet.id === config.salesWalletId ) {
                        currentBalance -= charge.netDebitAmount
                      }
                      let updateWallet = {}
                      if(charge.livemode === 1 || charge.livemode === true) {
                        updateWallet['currentBalance'] = currentBalance
                        updateWallet['previousBalance'] = previousBalance
                      } else {
                        updateWallet['testCurrentBalance'] = currentBalance
                        updateWallet['testPreviousBalance'] = previousBalance
                      }
                      console.log('--------')
                      console.log(businessWallet.id, currentBalance)
                      console.log('--------')
                      businessWallet.update(updateWallet).then((response)=>{
                        if(businessWallet.id === charge.walletId) {
                          currentBalance += charge.amountToPay
                          if(charge.walletId === config.walletFundingService && req.loggedInUser){
                            //This transaction is from a wallet funding service
                            let defaultWalletId, uWallets = req.loggedInUser.wallets
                            for(var i = 0; (uWallets && i < uWallets.length); i++){
                              if(uWallets[i].tag === 'default') {
                                defaultWalletId = uWallets[i].id
                                break
                              }
                            }
                            walletTransfer(charge.walletId, defaultWalletId, charge.amountToPay).then((response) => {
                                //silence is golden
                            }).catch((error) => {
                                console.error(error)
                            })
                          }
                        }
                      }).catch((error)=>{
                        console.log('error during updates')
                        console.log(businessWallet.id, error)
                      })
                    })
                  }).catch((error)=>{
                    console.log('bulkCreate Error')
                    console.log(error)
                  })
                }).catch(error => {

                })
              })
            }
          } else {
            res.status(401).json({
              message: 'Invalid transaction reference',
            })
            return
          }
        })
      } else {
        res.status(401).json({
          message: 'Invalid API Key or API Secret',
        })
        return
      }
    })
  }
})

router.get('/transaction/verify/:trxref', (req, res, next) => {
  let trxref = req.params.trxref
  let apiSecret = req.headers['authorization'] || null
  if(apiSecret){
    apiSecret = apiSecret.split(' ')
    apiSecret = (apiSecret.length === 1 ? apiSecret[0] : (apiSecret[0] !== 'Bearer' ? null : apiSecret[1]) )
    if(!apiSecret){
      return res.status(401).json({
        status: false,
        code: INVALID_REQUEST,
        message: 'Invalid secret',
      })
    }
  }else{
    return res.status(401).json({
      status: false,
      code: INVALID_REQUEST,
      message: 'Invalid secret',
    })
  }
  console.log('selectedKey', apiSecret)
  models.business.findOne({
    where: { $or: [{ apiSecret }, { testApiSecret: apiSecret }] },
  }).then(business => {
    if(!_.isEmpty(business)) {
      models.charge.findOne({
        where: {
          id: trxref,//TODO: Ensure only {this} business can verify {this} transaction
        }
      }).then(charge => {
        if(!_.isEmpty(charge)) {
          charge.netDebitAmount = undefined
          charge.moneywaveCommission = undefined
          charge.message = undefined
          charge.transactionToken = undefined
          charge.transactionRef = undefined
          charge.authType = undefined
          charge.status = 'success'
          let data = {
            data: charge,
            status: true
          }
          return res.status(200).json(data)
        } else {
          res.status(401).json({
            status: false,
            code: INVALID_REQUEST,
            message: 'Invalid transaction reference',
          })
        }
      })
    } else {
      res.status(401).json({
        status: false,
        code: INVALID_REQUEST,
        message: 'Invalid Secret Key',
      })
    }
  }).catch((error) => {
    res.status(401).json({
      status: false,
      code: SERVER_ERROR,
      message: 'server error occured',
      rawError: error,
    })
  })
})

module.exports = router
