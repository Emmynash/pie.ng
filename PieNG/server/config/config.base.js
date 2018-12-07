if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'staging') {
  require('dotenv').config({path:__dirname+'/../../.env'})
}
const env = process.env.NODE_ENV || 'development'
const port = process.env['PORT'] || 8080

const configBase = {
  development: {
    apiUrl: process.env.API_URL,
    appUrl: process.env.APP_URL,
    port: process.env['PORT'] || 8080,
    db: {
      urlLive: process.env['DATABASE_URL'],
    },
  },
  staging: {
    apiUrl: process.env.API_URL,
    appUrl: process.env.APP_URL,
    port: port,
    db: {
      urlLive: process.env['DATABASE_URL'],
    },
  },
  production: {
    apiUrl: process.env.API_URL,
    appUrl: process.env.APP_URL,
    port: port,
    db: {
      urlLive: process.env['DATABASE_URL'],
    },
  },
  test: {
    apiUrl: process.env.API_URL || `http://localhost:${port}`,
    appUrl: process.env.APP_URL || `http://localhost:${port}`,
    port,
    db: {
      urlLive: process.env['DATABASE_URL'] || 'mysql://root:HackingMysql@localhost/lpay_test',
    },
  },
}

module.exports = Object.assign({}, configBase[env], {
  env,
  appName: 'PIE.NG',
})
