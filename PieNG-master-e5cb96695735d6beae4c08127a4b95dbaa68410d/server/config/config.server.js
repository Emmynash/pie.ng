const path = require('path')
const configBase = require('./config.base')

const config = {
  production: {
    moneywave: {
      apiKey: process.env['MONEYWAVE_APIKEY'],
      apiSecret: process.env['MONEYWAVE_SECRET'],
      baseUrl: 'https://live.moneywaveapi.co',
    },
    rave: {
      baseUrl: 'http://flw-pms-dev.eu-west-1.elasticbeanstalk.com',
      apiKey: process.env['RAVE_PUBKEY'],
      apiSecret: process.env['RAVE_SECRET']
    },
    telesign: {
      apiKey: process.env['TELESIGN_APIKEY'],
      customerId: process.env['TELESIGN_CUSTOMER_ID'] || '9A95CEB0-8825-4AE4-91F8-1904CEBD797D',
      restEndpoint: 'https://rest-api.telesign.com',
      timeout: 10*1000
    },
    mailgun: {
      apiKey: process.env['MAILGUN_APIKEY'],
      pubKey: 'pubkey-6ab24688986084806aeec3e391289ee2',
    },
    ibulky: {
      apiKey: '203cd67f798172006b069515-ae69998',
      restEndpoint: 'http://api.ibulky.com/sendsms',
    },
    ebulksms: {
      apiKey: '3f81d1095b2d80d2c8946eeac0fa32011c5c3e07',
      customerId: 'sales@logicaladdress.com',
      restEndpoint: 'http://api.ebulksms.com:8080'
    }
  },
  development: {
    telesign: {
      apiKey: 'ojLJzeqbkn2MLwPzf1+MGLTamnDoiO1r1WzcgB4DQbdT5xMuGbZ66vtUh/NLXbx0bXnES3iJRUPBLWiugKxs+g==',
      customerId: '9A95CEB0-8825-4AE4-91F8-1904CEBD797D',
      restEndpoint: 'https://rest-api.telesign.com',
      timeout: 10*1000
    },
    moneywave: {
      apiKey: 'ts_3QBNBXSPDJTDH9A9438C',
      apiSecret: 'ts_01A0UST1RHL5JDULX7ZTO35N91OG2W',
      baseUrl: 'http://moneywave.herokuapp.com',
    },
    rave: {
      baseUrl: process.env['RAVE_URL'] || 'https://api.ravepay.co',
      apiKey: process.env['RAVE_PUBKEY'],
      apiSecret: process.env['RAVE_SECRET']
    },
    mailgun: {
      apiKey: 'key-c7d1548ad07d22c453bae353695b43ce',
      pubKey: 'pubkey-6ab24688986084806aeec3e391289ee2',
    },
    ibulky: {
      apiKey: '203cd67f798172006b069515-ae69998',
      restEndpoint: 'http://api.ibulky.com/sendsms',
    },
    ebulksms: {
      apiKey: '3f81d1095b2d80d2c8946eeac0fa32011c5c3e07',
      customerId: 'sales@logicaladdress.com',
      restEndpoint: 'http://api.ebulksms.com:8080'
    }
  },
  test: {
    telesign: {
      apiKey: 'ojLJzeqbkn2MLwPzf1+MGLTamnDoiO1r1WzcgB4DQbdT5xMuGbZ66vtUh/NLXbx0bXnES3iJRUPBLWiugKxs+g==',
      customerId: '9A95CEB0-8825-4AE4-91F8-1904CEBD797D',
      restEndpoint: 'https://rest-api.telesign.com',
      timeout: 10*1000
    },
    moneywave: {
      apiKey: 'ts_3QBNBXSPDJTDH9A9438C',
      apiSecret: 'ts_01A0UST1RHL5JDULX7ZTO35N91OG2W',
      baseUrl: 'http://moneywave.herokuapp.com',
    },
    mailgun: {
      apiKey: 'key-c7d1548ad07d22c453bae353695b43ce',
      pubKey: 'pubkey-6ab24688986084806aeec3e391289ee2',
    },
    ibulky: {
      apiKey: '203cd67f798172006b069515-ae69998',
      restEndpoint: 'http://api.ibulky.com/sendsms',
    },
    ebulksms: {
      apiKey: '3f81d1095b2d80d2c8946eeac0fa32011c5c3e07',
      customerId: 'sales@logicaladdress.com',
      restEndpoint: 'http://api.ebulksms.com:8080'
    }
  }
}
 
const serverConfig =  Object.assign({},
  configBase,
  config[configBase.env],
  {
    root: path.normalize(__dirname + '/../..'),
    virtualUserWalletId: 'wall_98109lvirtual934USer98',
    salesWalletId: 'wall_35952lSales284USer75',
    mWUserWalletId: 'wall_51729lmoney934USwave4',
    gatewayUserWalletId: 'wall_12849UwaypIe924USgate5',
    walletFundingService: 'wal_fund.pie.ng',
    secret: 'lpay_9wuUgxwYioPmMxzsJsdSKAIler7d22c453bae3536'
  }
)

module.exports = serverConfig