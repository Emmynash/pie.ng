'use strict';
const uniqueKey = require('unique-key')

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('banks', [{
      id: uniqueKey('bnk_', 24),
      name: 'First Bank',
      bankCode: '011',
      enabled: false,
      createdAt: "20170907",
      updatedAt: "20170907"
    },{
      id: uniqueKey('bnk_', 24),
      name: 'Access Bank',
      bankCode: '044',
      enabled: true,
      createdAt: "20170907",
      updatedAt: "20170907"
    },{
      id: uniqueKey('bnk_', 24),
      name: 'GTBank',
      bankCode: '058',
      enabled: false,
      createdAt: "20170907",
      updatedAt: "20170907"
    }, {
      id: uniqueKey('bnk_', 24),
      name: 'FCMB',
      bankCode: '214',
      enabled: false,
      createdAt: "20170907",
      updatedAt: "20170907"
    }, {
      id: uniqueKey('bnk_', 24),
      name: 'Unity Bank',
      bankCode: '215',
      enabled: false,
      createdAt: "20170907",
      updatedAt: "20170907"
    }, {
      id: uniqueKey('bnk_', 24),
      name: 'Stanbic IBTC Bank',
      bankCode: '221',
      enabled: false,
      createdAt: "20170907",
      updatedAt: "20170907"
    }, {
      id: uniqueKey('bnk_', 24),
      name: 'Sterling Bank',
      bankCode: '232',
      enabled: false,
      createdAt: "20170907",
      updatedAt: "20170907"
    }, {
      id: uniqueKey('bnk_', 24),
      name: 'EcoBank Nigeria',
      bankCode: '050',
      enabled: false,
      createdAt: "20170907",
      updatedAt: "20170907"
    }, {
      id: uniqueKey('bnk_', 24),
      name: 'Fidelity Bank',
      bankCode: '070',
      enabled: false,
      createdAt: "20170907",
      updatedAt: "20170907"
    }, {
      id: uniqueKey('bnk_', 24),
      name: 'Diamond Bank',
      bankCode: '063',
      enabled: false,
      createdAt: "20170907",
      updatedAt: "20170907"
    }, {
      id: uniqueKey('bnk_', 24),
      name: 'Heritage Bank',
      bankCode: '030',
      enabled: false,
      createdAt: "20170907",
      updatedAt: "20170907"
    }, {
      id: uniqueKey('bnk_', 24),
      name: 'Keystone Bank',
      bankCode: '082',
      enabled: false,
      createdAt: "20170907",
      updatedAt: "20170907"
    }, {
      id: uniqueKey('bnk_', 24),
      name: 'Skye Bank',
      bankCode: '076',
      enabled: false,
      createdAt: "20170907",
      updatedAt: "20170907"
    }, {
      id: uniqueKey('bnk_', 24),
      name: 'Zenith',
      bankCode: '057',
      enabled: false,
      createdAt: "20170907",
      updatedAt: "20170907"
    }, {
      id: uniqueKey('bnk_', 24),
      name: 'Wema Bank',
      bankCode: '035',
      enabled: false,
      createdAt: "20170907",
      updatedAt: "20170907"
    }, {
      id: uniqueKey('bnk_', 24),
      name: 'UBA',
      bankCode: '033',
      enabled: false,
      createdAt: "20170907",
      updatedAt: "20170907"
    }, {
      id: uniqueKey('bnk_', 24),
      name: 'Standard Chartered Bank',
      bankCode: '068',
      enabled: false,
      createdAt: "20170907",
      updatedAt: "20170907"
    }, {
      id: uniqueKey('bnk_', 24),
      name: 'Enterprise Bank',
      bankCode: '084',
      enabled: false,
      createdAt: "20170907",
      updatedAt: "20170907"
    }, {
      id: uniqueKey('bnk_', 24),
      name: 'Union Bank',
      bankCode: '032',
      enabled: false,
      createdAt: "20170907",
      updatedAt: "20170907"
    }, {
      id: uniqueKey('bnk_', 24),
      name: 'AfriBank',
      bankCode: '014',
      enabled: false,
      createdAt: "20170907",
      updatedAt: "20170907"
    }], {})
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('banks', null, {})
  }
}
