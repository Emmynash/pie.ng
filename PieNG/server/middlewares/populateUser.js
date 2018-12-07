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
  
  // const token = (req.body && req.body.access_token) || 
    // (req.query && req.query.access_token) || req.headers['x-access-token']
  
  const token = (req.body && req.body.access_token) ? req.body.access_token : ( (req.query && req.query.access_token) ? req.query.access_token :  req.headers['x-access-token'] || null);
  
  if (token && token.length > 5) {
    try {
      var decoded = jwt.decode(token, require('../config/config.server').secret);
      if (decoded.exp <= Date.now()) {
        return next();
      }
      
      // Authorize the user to see if s/he can access our resources
      models.user.findOne({
        where: {
          id: decoded.user.id,
          activated: 1,
        },
        include: [{ model: models.wallet, as: 'wallets'}],
      }).then(user => {
        if(!_.isEmpty(user)) {
          req.loggedInUser = user
          next()
          return
        } else {
          next();
          return;
        }
      }).catch(error => {
        next();
        return;
      });
    } catch (err) {
      return next();
    }
  } else {
    return next();
  }
};