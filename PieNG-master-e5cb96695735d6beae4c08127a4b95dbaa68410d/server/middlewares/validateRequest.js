const jwt = require('jwt-simple')
const models = require('../models')
const _ = require('lodash')

module.exports = (req, res, next) => {
  // When performing a cross domain request, you will recieve
  // a preflighted request first. This is to check if the app
  // is safe. 
  
  // We skip the token outh for [OPTIONS] requests.
  //if(req.method == 'OPTIONS') next();
  
  // let nonSecurePaths = ['/api/v1', '/api/v1/login', '/contact'];
  // console.log(req.url);
  // if ( nonSecurePaths.includes(req.path.replace(/\/$/, ""))) return next();
  
  const token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token']
  
  if (token) {
    try {
      var decoded = jwt.decode(token, require('../config/config.server').secret)
      if (decoded.exp <= Date.now()) {
        return res.status(400)
         .json({
            status: 400,
            message: 'Token Expired'
         })
      }
      
      // Authorize the user to see if s/he can access our resources
      models.user.findOne({
        where: {
          id: decoded.user.id,
          activated: true,
        },
        include: [{ model: models.wallet, as: 'wallets'}],
      }).then(user => {
        if(!_.isEmpty(user)) {
          req.loggedInUser = user
          next()
        } else {
          return res.status(403).json({
            message: 'Not Authorized'
          })
        }
      }).catch(error => {
        return res.status(500).json({
          message: 'Opps! Something went wrong'
        })
      })
    } catch (err) {
      return res.status(500).json({
        message: 'Oops something went wrong',
      })
    }
  } else {
    return res.status(401).json({
      message: 'Invalid Token or Key'
    })
  }
}