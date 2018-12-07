const jwt = require('jwt-simple')

const generateToken = (user, expiration = 1) => {
  let expires = expiresIn(expiration)
  let token = jwt.encode({
    exp: expires,
    user
  }, require('../config/config.server').secret)
  
  return {
    expires,
    token,
    user
  }
}
 
const expiresIn = (numDays) => {
  let dateObj = new Date()
  return dateObj.setDate(dateObj.getDate() + numDays)
}

module.exports = generateToken