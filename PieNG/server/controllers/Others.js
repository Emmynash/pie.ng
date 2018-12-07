const config = require('../config/config.server')
const router = require('express').Router()
const models = require('../models')
const uniqueKey = require('unique-key')
const unirest = require('unirest')
const helpers = require('../helpers/generic')
const serviceCharge = require('../helpers/walletServiceCharge')
const resolve = require('../helpers/resolveConflict')

router.get('/api/v1/banks/list', (req, res, next) => {
  models.bank.findAll({ where: {enabled: true }}).then(banks => {
    res.status(200).json(banks)
  })
})

router.post('/api/v1/initialize-dialog', (req, res, next) => {
  let { apiKey = '', amount, inclusive = true, currency, commission = 0 } = req.body
  if(!apiKey.length) {
    res.status(400).json({
      message: 'Invalid API key supplied to request'
    })
    return
  } else {
    models.business.findOne({
      where: {
        $or: [{ apiKey }, { testApiKey: apiKey }]
      },
      attributes: {
        exclude: ['mwLivePubKey', 'mwLiveSecretKey', 'apiSecret', 'testApiSecret', 'createdAt', 'updatedAt']
      }
    }).then(business => {
      if(helpers.isEmpty(business)) {
        return res.status(401).json({
          message: 'Incorrect API key supplied to request'
        })
      } else {
        let livemode = false
        if(business.apiKey === apiKey){
          livemode = true
        }
        business = business.toJSON()
        business.livemode = livemode
        models.bank.findAll({
          where:{
            enabled: true,
          },
          order: [
            ['name', 'ASC']
          ]
        }).then(banks => {
          try {
            const { totalAmount, totalCommission } = serviceCharge(amount, inclusive, commission, business.walletServiceChargeAbs)
            let loggedInUser = req.loggedInUser || {}, loggedInPhone = loggedInUser.phone || null
            if(loggedInPhone) {
              loggedInPhone = helpers.unformatPhone(loggedInPhone)
            }
            return res.status(200).json({
              business,
              banks,
              totalAmount,
              totalAmountPresentable: (totalAmount/100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'),
              serviceCharge: totalCommission,
              loggedInPhone
            })
          } catch(error) {
            console.error(error)
            return res.status(500).json({
              message: error.message
            })
          }
        })
      }
    })
  }
})

router.post('/api/v1/accountEnquiry', (req, res, next) => {
  let { accNumber, bankCode } = req.body
  const params = { account_number: accNumber, bank_code: bankCode }
  try {
    unirest.post(config.moneywave.baseUrl + '/v1/merchant/verify')
      .headers({'Content-Type': 'application/json'})
      .send({ 'apiKey': config.moneywave.apiKey, 'secret': config.moneywave.apiSecret })
      .end((Response) => {
        if(Response && Response.body && Response.body.status === 'success') {
          unirest.post(config.moneywave.baseUrl + '/v1/resolve/account') 
            .headers({
              'Content-Type': 'application/json',
              'Authorization': Response.body.token
            })
            .send(params)
            .end((response) => {
              if(response.body.status === 'success') {
                res.status(200).json({
                  accName: response.body.data.account_name
                })
                return
              } else {
                console.log(response.body)
                res.status(500).json({
                  message: 'Opps! Something has gone wrong!'
                })
              }
            })
        } else {
          console.error(Response)
          res.status(500).json({
            message: 'Opps! Something has gone wrong!'
          })
        }
      })
  } catch(e) {
    console.error(e)
    res.status(500).json({
      message: 'Opps! Something has gone wrong!'
    })
  }
})

router.post('/api/v1/walletEnquiry', (req, res, next) => {
  let { phone = '' } = req.body
  if(!phone.length) {
    res.status(400).json({
      message: 'Phone number is required'
    })
    return
  } else {
    phone = helpers.formatPhone(phone)
    if(!phone){
      return res.status(400).json({
        message: 'Invalid phone number',
      }) 
    }
    
    models.user.findOne({
      where: { phone },
      include: [{ model: models.wallet, as: 'wallets' }]
    }).then(user => {
      if(!helpers.isEmpty(user)) {
        if(user.wallets.length) {
          user = user.toJSON()
          console.log(user)
          res.status(200).json({
            wallets: user.wallets
          })
        } else {
          res.status(401).json({
            message: 'You do not have any wallet attached to your'
          })
          return
        }
      } else {
        res.status(401).json({
          message: 'This phone number is not in use'
        })
        return
      }
    })
  }
})

router.get('/resolve/:businessId', (req, res, next) => {
  const businessId = req.params.businessId, endpoint = 'http://imo.evas.ng/pie_transaction_refs'
  resolve(businessId, endpoint).then(response => {
    return res.status(200).json({
      status: 'success',
      transactions: response
    })
  }).catch(error => {
    console.log(error)
    return res.status(500).json({
      message: 'An error occured'
    })
  })
})

module.exports = router