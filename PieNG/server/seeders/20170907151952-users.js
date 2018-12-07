'use strict';
var unique = require('unique-key');
var hash = require("sha256")

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
    */

      return queryInterface.bulkInsert('users', [{
        id: 'tus_testuser2487Pjn',
        phone: "2347059528155",
        email: "successfultestuser@pie.ng",
        password: hash(unique(200)),
        name: 'Successful Test User',
        activated: true,
        createdAt: "20170907",
        updatedAt: "20170907"
      },{
        id: 'tus_testuser014621n',
        phone: "2348181484568",
        email: "failedtestuser@pie.ng",
        password: hash(unique(200)),
        name: 'Failed Test User',
        activated: true,
        createdAt: "20170907",
        updatedAt: "20170907"
      }], {});
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
    return queryInterface.bulkDelete('users', null, {})
  }
};
