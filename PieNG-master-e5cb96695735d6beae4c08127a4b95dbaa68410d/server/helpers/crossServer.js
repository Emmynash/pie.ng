const unirest = require('unirest')
const Promise = global.Promise

class CrossServer {
  static post(endpoint = '', params = {}, hdrs = {}, resilient = false) {
    let _endpoint = params.baseUrl + '/v1/' + endpoint
    let _headers = Object.assign({ 'Content-Type': 'application/json' }, hdrs)
    return new Promise((resolve, reject) => {
      try {
        console.error('\x1b[31m', params)
        params.baseUrl = undefined
        let Request = unirest.post(_endpoint).headers(_headers).send(params)
        Request.end(response => {
          console.error('crossServer', response)
          if(response && response.body && response.body.status && response.body.status === 'success') {
            resolve(response.body)
          } else {
            reject(response.body)
          }
        })
      } catch (e) {
        reject(e)
      }
    })
  }
}

module.exports = CrossServer