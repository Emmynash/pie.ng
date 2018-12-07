'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('permissions', [{
      roleId: 1, //'pie-admin',
      permissions: JSON.stringify(['*']),
      createdAt: "20170907",
      updatedAt: "20170907"
    },{
      roleId: 2,//'pie-account'
      permissions: JSON.stringify(["Can See Hello World"]),
      createdAt: "20170907",
      updatedAt: "20170907"
    }], {})
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('permissions', null, {})
  }
}
