const baseConfig = require('../../server/config/config.base.js');
const serverConfig = require('../../server/config/config.server.js');
const constants = require('../../server/config/constants.js');
var models = require('../../server/models')
var helpers = require ('../../server/helpers/generic')

const request = require('request');
const endpoint = baseConfig.apiUrl;

const phoneNumber1 = '08067506296';
const password1 = 'yahweh';

describe("Business: ", () => {
  var httpResponse = null;
  var httpStatusCode = null;

  describe("Case: Create business for user", () => {
    beforeEach((done) => {
      request.post({
        url: endpoint + '/api/v1/business/create',
        headers: {
          Accept: "application/json",
        },
        json: {
          name: 'Retnan DASER',
          phone: phoneNumber1,
        },
      })
    })
  })
})
