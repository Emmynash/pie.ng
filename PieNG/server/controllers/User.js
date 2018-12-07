import express from 'express'
import uniqueKey from 'unique-key'
import passHash from 'password-hash'
import validateRequest from '../middlewares/validateRequest'
import models from '../models'
import helpers from '../helpers/generic'
import config from '../config/config.server'
import genToken from '../helpers/generateToken'
import { UserCharges } from '../lib/UserUtils'
const router = express.Router()
const Promise = global.Promise

/* GET users listing. */
router.post('/api/v1/user/create', function(req, res, next) {
  const pool = {}
  try {
    let { name= '', phone= '', password= '', email= '' } = req.body
    if(!name.length || !phone.length || !password.length) {
      res.status(400).json({
        message: 'Invalid request'
      })
      return
    }

    let phoneBf = phone
    phone = helpers.formatPhone(phone)
    if(!phone){
      return res.status(400).json({
        message: 'Invalid phone number',
      })
    }
    let userId = uniqueKey(16, 'us_'), verifyCode = uniqueKey({ size: 6, charType: 'numeric'})
    password = passHash.generate(password)
    models.user.findOrCreate({
      where: { phone, email},
      defaults: {
        name, password, id: userId,
      }
    }).spread((user, created) => {
      pool['user'] = user
      pool['created'] = created
      return models.wallet.findOrCreate({
        where: { userId: pool.user.id, walletType: 'default' },
        defaults: { id: uniqueKey('wal_'), walletType: 'personal' }
      })
    }).spread((wallet, created) => {
      return models.verificationCode.findOne({
        where: { id: userId }
      })
    }).then(verificationCodeObj => {
      if(verificationCodeObj && !helpers.isEmpty(verificationCodeObj)) {
        return verificationCodeObj.update({ verificationCode: verifyCode })
      } else {
        let verificationCodeId = uniqueKey(16, 'vfc_')
        return models.verificationCode.create({ id: verificationCodeId, 'verificationCode': verifyCode, 'userId': pool.user.id })
      }
    }).then(verificationCodeObj => {
      pool['verificationCodeObj'] = verificationCodeObj
      let verifyMessage = `Thank you for creating an account on ${config.appName}. Your verification code is ${verificationCodeObj.verificationCode}. You can also visit ${config.appUrl}/v/${verificationCodeObj.verificationCode} to verify this phone number`
      if(!pool.created){ // && pool.user.activated
        return new Promise(resolve => {
          resolve(true)
        })
      } else {
        return helpers.sendSms(verifyMessage, pool.user.phone)
      }
    }).then(response => {
      if(!pool.created) {
        res.status(409).json({
          message: `A user already exist with the phone number ${phoneBf}`
        })
        return
      } else {
        let user = pool.user
        user.phone = phoneBf
        user.password = undefined
        console.info('Created ', user)
        res.status(201).json({
          user: user,
          status: 'success'
        })
        return
      }
    }).catch(error => {
      console.error(error)
      res.status(error.status || 500).json({
        message: 'An error occured and your request could not be processed',
        error: true,
      })
    })
  } catch(e) {
    console.error(e)
    res.status(e.status || 500).json({
      message: e.message || 'An error occured and your request could not be processed',
      error: true,
    })
    return
  }
})

router.post('/api/v1/user/verify', (req, res, next)=> {
  let { verifyCode= '', phoneToVerify= '' }= req.body, pool= {}
  if(verifyCode.length !== 6) {
    res.status(401).json({
      message: `${verifyCode} is not a valid verification code`
    })
    return
  } else {
    let phone = helpers.formatPhone(phoneToVerify)
    if(!phone){
      return res.status(400).json({
        message: 'Invalid phone number',
      })
    }
    models.user.findOne({
      where: { phone }
    }).then(user=> {
      if(!helpers.isEmpty(user)) {
        pool['user'] = user
        models.verificationCode.findOne({
          where: { verificationCode: verifyCode, userId: user.id }
        }).then(verifiedObj=> {
          if(!helpers.isEmpty(verifiedObj)) {
            return pool.user.update({ activated: true })
          } else {
            res.status(401).json({
              message: 'The verification code you provided is invalid'
            })
            return
          }
        }).then(()=> {
          let user = pool.user
          user.password = undefined
          res.status(200).json({
            status: 'success',
            user,
          })
          return
        })
      } else {
        res.status(400).json({
          message: `There\'s no valid record associated to ${phoneToVerify}`
        })
        return
      }
    }).catch(e => {
      console.log('Verification Error', e)
      res.status(500).json({
        message: 'Opps! Something went wrong and your phone number could not be verified. Please try again'
      })
      return
    })
  }
})

router.post('/api/v1/user/login', (req, res, next) => {
  let { login = '', password = '' } = req.body
  if (!login.length || !password.length) { // Login and/or password is empty
    return res.status(401).json({
      message: 'Invalid login credentials'
    })
  }
  let phone = helpers.formatPhone(login)  // Format phone number to international form
  // Find one user with the phone number and include the wallet and business associated with the user
  if (!phone) {
    return res.status(400).json({
      message: 'Invalid phone number',
    })
  }
  models.user.findOne({
    where: { phone, activated: true },
    include: [{
      model: models.business,
      include: {
        model: models.wallet, as: 'wallets'
      },
      attributes: {
        exclude: ['mwLivePubKey', 'mwLiveSecretKey', 'apiSecret', 'testApiSecret']
      }
    }, {
      model: models.wallet
    }]
  }).then(user => {
    if (!helpers.isEmpty(user)) {
      if (passHash.verify(password, user.password)) {
        user = user.toJSON()
        user.password = undefined
        user.logicaladdress = undefined
        return res.status(200).json(genToken(user))
      } else {
        return res.status(401).json({
          message: 'Incorrect password and phone number combination'
        })
      }
    } else {
      return res.status(401).json({
        message: 'This phone number is not linked to any account'
      })
    }
  })
})

router.get('/v/:verificationCode', (req, res, next) => {
  let verifyCode = req.params.verificationCode, pool= {}
  if(verifyCode.length !== 6) {
    res.status(401).json({
      message: `${verifyCode} is not a valid verification code`
    })
    return
  } else {
    models.user.findOne({
      include: [{ models: models.verificationCode, where: { verificationCode: verifyCode }}] // TODO FIX: Verification Error TypeError: Cannot read property 'getTableName' of undefined
    }).then(user=> {
      if(!helpers.isEmpty(user)) {
        pool['user'] = user
        if(!helpers.isEmpty(user)) {
          return pool.user.update({ activated: true })
        } else {
          res.status(401).json({
            message: 'The verification code you provided is invalid'
          })
          return
        }
        let user = pool.user
        user.password = undefined
        res.status(200).json({
          status: 'success',
          user,
        })
        return
      } else {
        return res.status(400).json({
          message: `There\'s no valid record associated to ${verifyCode}`
        })
      }
    }).catch(e => {
      console.log('Verification Error', e)
      return res.status(500).json({
        message: 'Opps! Something went wrong and your phone number could not be verified. Please try again'
      })
    })
  }
})

router.get('/api/v1/transactions/history', validateRequest, (req, res, next) => {
  let user = req.loggedInUser,
      { startDate = null, endDate = null } = req.query,
      where = {
        $or: {
          walletId: {  $in: user.wallets.map(wallet => (wallet.id)) },
        }
      },
      createdAt = {}
  if(startDate) {
    console.log(startDate)
    startDate = new Date(startDate)
    startDate.setHours(startDate.getHours() + 1)
    startDate.setMinutes(0)
    startDate.setSeconds(0)
    Object.assign(createdAt, { $gte: startDate })
  }
  if(endDate) {
    console.log(endDate)
    endDate = new Date(endDate)
    endDate.setHours(23)
    endDate.setMinutes(59)
    endDate.setSeconds(59)
    Object.assign(createdAt, { $lte: endDate })
  }
  Object.assign(where, { createdAt })
  models.transaction.findAll({
    where,
    attributes: [
      ['chargeId', 'id'],
      'amount',
      'narration',
      ['transactionType', 'chargeType'],
      [models.sequelize.fn('date_format', models.sequelize.col('createdAt'), '%Y-%m-%d'), 'paidAtDate'],
      [models.sequelize.fn('date_format', models.sequelize.col('createdAt'), '%H:%i'), 'paidAtTime'],
    ],
    order: [[ 'createdAt', 'DESC']]
  }).then(transactions => {
    return res.status(200).json({
      status: 'success',
      charges: transactions
    })
  })
})

router.get('/api/v1/summary', validateRequest, (req, res, next) => {
  let user = req.loggedInUser, pool = {}
  UserCharges(user).then(charges => {
    pool['userCharges'] = charges
    return new Promise(resole => {
      resole(true)
    })
  }).then(() => {
    res.status(200).json({
      status: 'success',
      ...pool
    })
  }).catch(error => {
    console.error(error)
    return res.status(500).json({
      message: 'Sorry, an error occured!'
    })
  })
})

router.get('/api/v1/user', validateRequest, (req, res, next) => {
  let user = req.loggedInUser
  models.user.findById(user.id, {
    include: [{
      model: models.wallet,
    }, {
      model: models.business,
      attributes: {
        exclude: ['mwLivePubKey', 'mwLiveSecretKey', 'apiSecret', 'testApiSecret']
      }
    }]
  }).then(user => {
    user = user.toJSON()
    let wallets = user.wallets
    let businesses = user.businesses
    user.wallets = undefined
    user.businesses = undefined
    user.password = undefined
    res.status(200).json({
      user,
      wallets,
      businesses
    })
    return
  }).catch(error => {
    console.error(error)
    res.status(500).json({
      message: 'Opps! Something went wrong and your request could not be completed'
    })
    return
  })
})

router.get('/api/v1/user/dashboard', validateRequest, (req, res, next) => {
  const user = req.loggedInUser, pool = {}, $today = (new Date()).setHours(0,0,0,0)
  models.user.findById(user.id, {
    attributes: [ 'id', 'name', 'phone' ],
    include: [{ model: models.wallet, attributes: ['id', 'tag', 'currentBalance', 'previousBalance'] }]
  }).then(user => {
    if(!helpers.isEmpty(user)) {
      let tempUser = user.toJSON(), tempWallets = tempUser.wallets, $or = []
      for (let i = 0; i < tempWallets.length; ++i) {
        $or.push(tempWallets[i].id)
      }
      tempUser.wallets = undefined
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
        todayTransactions = todayTransactions[0].toJSON()
        console.log('transactions', todayTransactions.amount)
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
          user: tempUser,
          wallets: tempWallets,
          history: {
            todayEarnings: pool.todayEarnings,
            yesterdayEarnings: yesterdayEarnings
          }
        })
      }).catch(error => {
        console.error(error)
        return res.status(500).json({
          message: 'Opps! An error occured and your request could not be processed'
        })
      })
    } else {
      console.error('ELSE')
      res.status(500).json({
        message: 'Opps! Something went wrong with your request and your request could not be completed'
      })
      return
    }
  }).catch(error => {
    console.error(error)
    res.status(500).json({
      message: 'Opps! Something went wrong with your request and your request could not be completed'
    })
    return
  })
})

router.post('/api/v1/user/reset-password', validateRequest, (req, res, next) => {
  let { newpassword = '', userpassword = '' } = req.body,
        user = req.loggedInUser
  if(!newpassword.length || !userpassword.length) {
    return res.status(401).json({
      message: 'Invalid request'
    })
  } else {
    if(newpassword === userpassword) {
      return res.status(401).json({
        message: 'You cannot change your password to the same password'
      })
    } else {
      newpassword = passHash.generate(newpassword)
      userpassword = passHash.generate(userpassword)
      if(!passHash.verify(user.password, userpassword)) {
        console.log(user)
        return res.status(401).json({
          message: 'Your old password does not match'
        })
      } else {
        user.update({
          password: newpassword
        }).then(updated => {
          return res.status(200).json({
            status: 'success',
            message: 'Password changed successfully'
          })
        })
      }
    }
  }
})

router.get('/api/v1/user/wallets', validateRequest, (req, res) => {
  const user_x = req.loggedInUser
  models.user.findById(user_x.id, {
    attributes: [ 'id', 'name', 'phone' ],
    include: [{ model: models.wallet, attributes: ['id', 'tag', 'currentBalance', 'previousBalance', 'walletType', 'currency'] }]
  }).then(user => {
    if (!helpers.isEmpty(user)) {
      return res.json({
        status: 'success',
        wallets: user.wallets
      })
    } else {
      return res.status(404).json({
        message: 'User not found'
      })
    }
  }).catch(error => {
    console.log(error)
    return res.json({
      message: 'Opps! Something went wrong with your request and your request could not be completed'
    })
  })
})

module.exports = router
