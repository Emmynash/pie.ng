'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('roles', [{
      id: 1,
      role: 'Pie Admin',
      slug: 'pie-admin',
      createdAt: "20170907",
      updatedAt: "20170907"
    },{
      id: 2,
      role: 'Pie Account',
      slug: 'pie-account',
      createdAt: "20170907",
      updatedAt: "20170907"
    }], {})
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('roles', null, {})
  }
}
