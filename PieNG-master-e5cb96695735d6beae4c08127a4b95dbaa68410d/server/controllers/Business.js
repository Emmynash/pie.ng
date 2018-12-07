const router = require('express').Router()
const models = require('../models')
const validateRequest = require('../middlewares/validateRequest')
const uniqueKey = require('unique-key')
const helpers = require('../helpers/generic')
const _ = require('lodash')
const { INVALID_REQUEST, RECORD_CREATED, SERVER_ERROR, PREFIXES } = require('../config/constants')

router.get('/api/v1/business/:businessId', (req, res, next) => {
  const _id = req.params.businessId
  models.business.findById(_id, {
    attributes: {
      exclude: ['apiSecret', 'testApiSecret', 'createdAt', 'updatedAt', 'mwLivePubKey', 'mwLiveSecretKey']
    },
    include: [{
      model: models.wallet
    }]
  }).then(business => {
    if(!_.isEmpty(business)) {
      res.status(200).json(business)
      return
    } else {
      res.status(401).json({
        message: 'Invalid API key'
      })
      return
    }
  }).catch(error => {
    res.status(error.status || 500).json({
      message: error.message || 'Oops! Something went wrong',
    })
    return
  })
})

router.get('/api/v1/business', validateRequest, (req, res, next) => {
  const userId = req.body.x_key || req.query.x_key || req.headers['x-key']
  models.business.findAll({
    where: {
      userId,
    },
    attributes: {
      exclude: ['mwLivePubKey', 'mwLiveSecretKey', 'apiSecret', 'testApiSecret']
    }
  }).then(businesses => {
    res.status(200).json(businesses)
    return
  }).catch(error => {
    console.log('Controllers.Business.get\\Business', error)
    res.status(500).json({
      message: 'Oops! Something went wrong',
    })
    return
  })
})

router.post('/api/v1/business/create', validateRequest, (req, res, next) => {
  /**
   * TODO: Create a settlement account for the provided bank details
   * Success Response:
   */
  // Get userId from header or query or body
  let userId = req.body.x_key || req.query.x_key || req.headers['x-key'] || null
  let { name = '', url = '', address = '', phone = '', email = '', bankCode = '', } = req.body, pool = {}
  
  if(!name.length || !url.length || !address.length || !phone.length || !email.length || !userId) {
    console.info('Controllers.Business.post', 'Can not validate user')
    res.status(401).json({
      message: 'Invalid request',
    })
    return
  }
  // Generate keys and businessId
  let apiKey = uniqueKey('pklv_'), apiSecret = uniqueKey('sklv_'), testApiKey = uniqueKey('pk_'), testApiSecret = uniqueKey('sk_'), businessId = uniqueKey('bus_')
  phone = helpers.formatPhone(phone)
  if(!phone){
    return res.status(400).json({
      message: 'Invalid phone number',
    }) 
  }
  models.business.create({
    url, name, phone, email, apiKey, address, apiSecret, testApiKey, testApiSecret, id: businessId,
  }).then(business => {
    business = business.toJSON()
    business.apiSecret = undefined
    business.testApiSecret = undefined
    business.createdAt = undefined
    business.updatedAt = undefined
    pool['business'] = business
    return models.businessAdmin.create({
      userId, businessId: pool.business.id, role: 'admin'
    })
  }).then(businessAdmin => {
    return models.wallet.create({
      bankCode,
      businessId: pool.business.id,
      id: uniqueKey('wal_'),
      tag: 'default',
      walletType: 'business',
      currentBalance: 0,
      previousBalance: 0,
    })
  }).then(wallet => {
    wallet = wallet.toJSON()
    wallet['business'] = pool.business
    res.status(201).json({
      status: 'success',
      business: pool.business,
      wallets: wallet,
    })
    return
  }).catch(error => {
    console.log('business/create', error)
    res.status(500).json({
      message: 'Oops! Something went wrong',
    })
    return
  })
})

router.get('/api/v1/business/:businessId/wallets', (req, res, next) => {
  let businessId = req.params.businessId
  models.wallet.findAll({
    where: {
      businessId,
    }
  }).then(accounts => {
    res.status(200).json(accounts)
    return
  })
})

router.post('/api/v1/business/wallet/create', (req, res, next) => {
  let { accountNumber, bankCode, tag, businessId, currentBalance = 0, previousBalance = 0 } = req.body
  models.wallet.findOrCreate({
    where: { businessId, tag },
    defaults: { tag, currentBalance, previousBalance, id: uniqueKey(16, PREFIXES.BUSINESS_ACCOUNT) }
  }).spread((wallet, created) => {
    res.status(200).json({
      created,
      wallet,
    })
    return
  }).catch(error => {
    console.error(error)
    res.status(500).json({
      message: 'Oops! Something went wrong',
    })
    return
  })
})

router.get('/api/v1/business/:businessId/dashboard', (req, res, next) => {
  const pool = {}, $today = (new Date()).setHours(0,0,0,0)
  models.business.findById(req.params.businessId, {
    include: [{ model: models.wallet, as: 'wallets' }],
    attributes: {
      exclude: ['mwLivePubKey', 'mwLiveSecretKey', 'apiSecret', 'testApiSecret']
    }
  }).then(business => {
    if (!helpers.isEmpty(business)) {
      let tempBusiness = business.toJSON()
      let tempWallets = business.wallets, $or = []
      if (tempWallets.length) {
        // Wallets is not empty
        for(let i = 0; i < tempWallets.length; ++i) {
          if (!tempBusiness.livemode) {
            tempWallets[i].currentBalance = tempWallets[i].testCurrentBalance
            tempWallets[i].previousBalance = tempWallets[i].testPreviousBalance
          }
          $or.push(tempWallets[i].id)
          tempWallets[i].testCurrentBalance = undefined
          tempWallets[i].testPreviousBalance = undefined
        }
      }
      tempBusiness.wallets = tempWallets
      tempBusiness.type = 'business'
      tempBusiness.apiSecret = undefined
      pool['business'] = tempBusiness
      models.charge.findAll({
        attributes: [[models.sequelize.fn('SUM', models.sequelize.col('amountToPay')), 'amount']],
        where: {
          targetWalletId: {
            $or
          },
          paidAt: {
            $gt: new Date($today)
          }
        }
      }).then(todayTransactions => {
        console.log('transactions', todayTransactions)
        let todayEarnings = todayTransactions.amount || 0
        if(todayEarnings) {
          todayEarnings = (parseFloat(todayEarnings)/100)
        }
        pool['todayEarnings'] = todayEarnings
        const $_today = new Date($today)
        const $yesterday = $_today.setDate($_today.getDate() - 1)
        return models.charge.findAll({
          attributes: [[models.sequelize.fn('SUM', models.sequelize.col('amountToPay')), 'amount']],
          where: {
            targetWalletId: {
              $or
            },
            paidAt: {
              $between: [new Date($yesterday), new Date($today)]
            }
          }
        }).catch(error => {
          console.error(error)
          res.status(500).json({
            message: 'Opps! Something has gone wrong and your request could not not completed'
          })
        })
      }).then(yesterTransactions => {
        let yesterdayEarnings = yesterTransactions[0].toJSON().amount || 0
        if(yesterdayEarnings) {
          yesterdayEarnings = (parseFloat(yesterdayEarnings)/100)
        }
        console.log(yesterTransactions[0].toJSON(), pool.todayEarnings)
        return res.status(200).json({
          business: pool.business,
          wallets: tempWallets,
          history: {
            todayEarnings: pool.todayEarnings,
            yesterdayEarnings
          }
        })
      }).catch(error => {
        console.error(error)
        return res.status(500).json({
          message: 'Opps! An error occured and your request could not be processed'
        })
      })
    }
  }).catch(error => {
    console.error(error)
    return res.status(500).json({
      message: 'Oops! Something went wrong and your request could not be completed'
    })
  })
})

router.get('/api/v1/business/:businessId/settings', (req, res, next) => {
  const _id = req.params.businessId, pool = {}
  models.business.findById(_id, {
    attributes: {
      exclude: ['createdAt', 'updatedAt', 'mwLivePubKey', 'mwLiveSecretKey']
    },
    include: [{
      model: models.wallet, as: 'wallets'
    }]
  }).then(business => {
    if(!_.isEmpty(business)) {
      let tempBusiness = business.toJSON()
      if(!business.livemode) {
        tempBusiness.apiKey = tempBusiness.testApiKey
        tempBusiness.apiSecret = tempBusiness.testApiSecret
      }
      pool.business = tempBusiness
      return res.status(200).json({
        business: tempBusiness
      })
    } else {
      res.status(401).json({
        message: 'Invalid API key'
      })
      return
    }
  }).catch(error => {
    res.status(error.status || 500).json({
      message: error.message || 'Oops! Something went wrong',
    })
    return
  })
})


router.get('/api/v1/business/:businessId/transactions/history', validateRequest, (req, res, next) => {
  let businessId = req.params.businessId, user = req.loggedInUser,
      { startDate = null, endDate = null } = req.query,
      createdAt = {}
  if(startDate) {
    startDate = new Date(startDate)
    startDate.setHours(startDate.getHours() + 1)
    // startDate.setMinutes(0)
    // startDate.setSeconds(0)
    Object.assign(createdAt, { $gte: startDate })
  }
  if(endDate) {
    endDate = new Date(endDate)
    endDate.setHours(23)
    endDate.setMinutes(59)
    endDate.setSeconds(59)
    Object.assign(createdAt, { $lte: endDate })
  }
  console.log(createdAt)
  models.businessAdmin.findOne({
    where: {
      userId: user.id,
      businessId: businessId,
    },
    attributes: {
      exclude: ['mwLivePubKey', 'mwLiveSecretKey', 'apiSecret']
    }
  }).then(businessAdmin => {
    if(!helpers.isEmpty(businessAdmin)) {
      if(businessAdmin.role === 'admin') {
        // TODO: Check assigned role from businessAdmins.roleDef
        models.business.findById(businessId, { include: [{ model: models.wallet, as: 'wallets' }] }).then(business => {
          let where = {
            walletId: {  $in: business.wallets.map(wallet => (wallet.id)) },
            livemode: business.livemode,
            createdAt
          }
          return models.transaction.findAll({
            where,
            attributes: [
              ['chargeId', 'id'],
              'amount',
              'narration',
              ['transactionType', 'chargeType'],
              [models.sequelize.fn('date_format', models.sequelize.col('createdAt'), '%Y-%m-%d'), 'paidAtDate'],
              [models.sequelize.fn('date_format', models.sequelize.col('createdAt'), '%H:%i'), 'paidAtTime'],
            ],
            // include: [{
            //   model: models.charge,
            //   attributes: {
            //     include: ['businessReference']
            //   }
            // }],
            order: [[ 'createdAt', 'DESC']]
          })
        }).then(transactions => {
          return res.status(200).json({
            status: 'success',
            charges: transactions
          })
        }).catch(error => {
          console.error(error)
          res.status(500).json({
            message: 'An unexpected error has occurred and your request could not be processed'
          })
        })
      } else {
        return res.status(401).json({
          message: 'Sorry, you don\'t have permission to access the requested resource'
        })
      }
    } else {
      return res.status(401).json({
        message: 'Sorry, you don\'t have permission to access the requested resource'
      })
    }
  })
})


router.get('/api/v1/business/:businessId/toggle-mode', validateRequest, (req, res) => {
  let user = req.loggedInUser, businessId = req.params.businessId
  models.business.findOne({
    where: {
      id: businessId
    },
    include: [{
      model: models.user, as: 'users'
    }]
  }).then(business => {
    let tempBusiness = business.toJSON()
    let users = tempBusiness.users.find(usr => {
      return usr.id === user.id
    })
    if(helpers.isEmpty(users)) {
      return res.status(403).json({
        message: 'Forbidden'
      })
    }
    business.update({
      livemode: !tempBusiness.livemode
    }).then(updatedBusiness => {
      return res.status(200).json({
        status: 'success'
      })
    })
  })
})

module.exports = router