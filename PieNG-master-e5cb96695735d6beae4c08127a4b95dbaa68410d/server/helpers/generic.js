const config = require('../config/config.server')
const uniqueKey = require('unique-key')
const googleLibphonenumber = require('google-libphonenumber')
const PNF = googleLibphonenumber.PhoneNumberFormat
const phoneUtil = googleLibphonenumber.PhoneNumberUtil.getInstance()

const SMS_GATEWAY = process.env['DEFAULT_SMS_GATEWAY'] || 'EBULKSMS' //'IBULKY' || 'EBULKSMS' || TELESIGN
console.log(SMS_GATEWAY)
const TeleSignSDK = require('telesignsdk')
const unirest = require('unirest')

var hasOwnProperty = Object.prototype.hasOwnProperty

module.exports = {
  toBoolean: (str) => {
    if(str == null) return false
    if(str == 1) return true;
    if (typeof str === 'boolean') {
      return (str === true)
    }
    if(typeof str === 'string') {
      if(str === '') return false
      str = str.replace(/^\s+|\s+$/g, '')
      if(str.toLowerCase() === 'true' || str.toLowerCase() === 'yes') {
        return true
      }
      str = str.replace(/,/g, '.')
      str = str.replace(/^\s*\-\s*/g, '-')
    
      // var isNum = string.match(/^[0-9]+$/) != null;
      // var isNum = /^\d+$/.test(str);
      if(!isNaN(str)) {
        return (parseFloat(str) !== 0)
      }
      return false
    }
  },
  formatPhone: (phone, countryCode = 'NG') => {
    try{
      let formatedPhone = phoneUtil.format(phoneUtil.parse(phone, countryCode), PNF.E164).substr(1)
      return formatedPhone
    } catch(e) {
      console.log(e.message || 'invalid phone number')
      return null
    }
  },
  
  unformatPhone: (phone, countryCode = 'NG') => {
    try {
      let formatedPhone = phoneUtil.format(phoneUtil.parse(phone, countryCode), PNF.NATIONAL)
      return formatedPhone.replace(/ /g, '')
    } catch(e) {
      console.log(e.message || 'invalid phone number')
      return null
    }
  },

  isEmpty: (obj = {}) => {

    // null and undefined are 'empty'
    if (obj == null) return true

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0)    return false
    if (obj.length === 0)  return true

    // If it isn't an object at this point
    // it is empty, but it can't be anything *but* empty
    // Is it empty?  Depends on your application.
    if (typeof obj !== 'object') {
      return true
    }

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false
    }

    return true
  },
  isObject: (obj) => {
    return (!!obj) && (obj.constructor === Object)
  },
  sendSms: (body = '', recipient = '', messageType = 'OTP', retry = false) => {
    const SMS_GATEWAYS = ['TELESIGN', 'EBULKSMS']
    let indexOfDefault = SMS_GATEWAYS.indexOf(SMS_GATEWAY), defaultGateway = SMS_GATEWAY
    if(retry) {
      let indexOfNewDefault = Math.abs(indexOfDefault - 1) // Works 'cause there are just two gateways
      defaultGateway = SMS_GATEWAYS[indexOfNewDefault]
    }
    let gateway
    if (defaultGateway === 'TELESIGN') {
      gateway = config.telesign
    }
    if (defaultGateway === 'IBULKY') {
      gateway = config.ibulky
    }
    if (defaultGateway === 'EBULKSMS') {
      gateway = config.ebulksms
    }
    const { apiKey, customerId, restEndpoint, timeout } = gateway

    return new Promise((resolve, reject) => {
      if(config.env === 'test' && !process.env.ALLOW_SMS_IN_TEST_MODE){
        console.log('testing in progress, SMS not sent ')
        resolve('No SMS sent. Testing in progress')
        return
      }
      if(defaultGateway === 'TELESIGN') {
        const telesign = new TeleSignSDK(customerId, apiKey, restEndpoint, timeout)
        telesign.sms.message(function(err, reply){
          if(err){
            console.log('Error: Could not reach TeleSign\'s servers')
            console.error(err) // network failure likely cause for error
            reject(err)
          } else{
            console.log(`Message sent to ${recipient}`, body)
            console.log(reply)
            resolve(reply) // save the reference_id to check status of the message
          }
        },
        recipient,
        body,
        messageType)
      }
      if(defaultGateway === 'IBULKY') {
        unirest.get(`${restEndpoint}/sendsms/?apikey=${apiKey}&sender=${encodeURIComponent(config.appName)}&recipient=${recipient}&message=${encodeURIComponent(body)}&msgtype=text&delivery=yes`)
        .end(response => {
          console.log(response.body)
          if(response.body.startsWith('2501')) {
            resolve(response.body)
          } else {
            reject(response.body)
          }
          console.log(`Message sent to ${recipient}`, body)
        })
      }
      if(defaultGateway === 'EBULKSMS') {
        const ebulksms = require('ebulksms')(customerId, apiKey, { senderId: config.appName })
        ebulksms.send(recipient, body, uniqueKey('msg_', 32), {
          flash: false, // (Optional) Default false
        }).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      }
    })
  },
  createOrUpdate: (model, where = {}, defaults = {}) => {
    model.findOne({
      where
    }).then(res => {
      if(res && !this.isEmpty(res)) {
        return res.update(defaults)
      } else {
        const newObj = Object.assign(where, defaults)
        return model.create(newObj)
      }
    })
  },
  safetyfyTransJson: (obj) => {
    obj.tansactionRef = undefined
    obj.transactionToken = undefined
    obj.authType = undefined
  }
}
