if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'staging') {
  require('dotenv').config({path:__dirname+'/../../.env'})
}
const env = process.env.NODE_ENV || 'development'

const configBase = {
  development: {
    apiUrl: process.env.API_URL || 'https://hive-katorbryan.c9users.io',
    appUrl: process.env.APP_URL || 'https://hive-katorbryan.c9users.io',
  },
  staging: {
    apiUrl: process.env.API_URL,
    appUrl: process.env.APP_URL,
  },
  production: {
    apiUrl: process.env.API_URL,
    appUrl: process.env.APP_URL,
  },
  test: {
    apiUrl: process.env.API_URL || 'http://localhost',
    appUrl: process.env.APP_URL || 'http://localhost',
  },
}

module.exports = Object.assign({}, configBase[env], {
  env,
  appName: 'Pie.NG',
})