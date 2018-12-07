const baseConfig = require('../../server/config/config.base.js');
const serverConfig = require('../../server/config/config.server.js');
const constants = require('../../server/config/constants.js');
const models = require('../../server/models')
var helpers = require ('../../server/helpers/generic')

var request = require('request');
var endpoint = baseConfig.apiUrl;
const phoneNumber1 = '08067506296';
const phoneNumber2 = '08161730129';

describe("Verifying already registered users: ", () => {
  httpResponse = null;
  httpStatusCode = null;
  var verifyCode = null;

  describe("Case: success", () => {
    beforeEach((done)=>{
      var phone = helpers.formatPhone(phoneNumber1);
      models.user.findOne({
          where: {phone}
      }).then(user=>{
        if(!helpers.isEmpty(user)){

          models.verificationCode.findOne({
            where: {userId: user.id}
          }).then(verifiedObj=>{
            if(!helpers.isEmpty(verifiedObj)){
              verifyCode = verifiedObj.verificationCode;
              done();
            }
          });
        }else{
          console.log("User empty")
          done();
        }
      }).catch(e=>{
        console.log("Failed getting verification code ", e);
        return e;
      });

    })

    beforeEach((done) => {

      request.post({
          url: endpoint + "/api/v1/user/verify",
          headers: {
            Accept: "application/json"
          },
          json: {
                   verifyCode,
                   phoneToVerify: phoneNumber1,
               },
        }, (err, res, body) => {
          if(err) {throw err}
          httpStatusCode = res.statusCode;
          done();
        });

    });


    afterEach(()=>{
      httpStatusCode = null;
      verifyCode = null;
    });

    it(": ", (done) => {
      expect(verifyCode.length).toEqual(6);
      expect(httpStatusCode).toEqual(200);
      done();
    });
  });

  describe("Case: success for second phone", () => {
    beforeEach((done)=>{
      var phone = helpers.formatPhone(phoneNumber2);
      models.user.findOne({
          where: {phone}
      }).then(user=>{
        if(!helpers.isEmpty(user)){

          models.verificationCode.findOne({
            where: {userId: user.id}
          }).then(verifiedObj=>{
            if(!helpers.isEmpty(verifiedObj)){
              verifyCode = verifiedObj.verificationCode;
              done();
            }
          });
        }else{
          console.log("User empty")
          done();
        }
      }).catch(e=>{
        console.log("Failed getting verification code ", e);
        return e;
      });

    })

    beforeEach((done) => {

      request.post({
          url: endpoint + "/api/v1/user/verify",
          headers: {
            Accept: "application/json"
          },
          json: {
                   verifyCode,
                   phoneToVerify: phoneNumber2,
               },
        }, (err, res, body) => {
          if(err) {throw err}
          httpStatusCode = res.statusCode;
          done();
        });

    });


    afterEach(()=>{
      httpStatusCode = null;
      verifyCode = null;
    });

    it(": ", (done) => {
      expect(verifyCode.length).toEqual(6);
      expect(httpStatusCode).toEqual(200);
      done();
    });
  });

  describe("Case: no valid record associated to phone", () => {
    //No need of grabbing verification code since
    //This phone does not exist, so we give a dummy
    //verification code instead.

    beforeEach((done) => {

      request.post({
          url: endpoint + "/api/v1/user/verify",
          headers: {
            Accept: "application/json"
          },
          json: {
                   verifyCode: '666666',
                   phoneToVerify: "08055246510",
               },
        }, (err, res, body) => {
          if(err) {throw err}
          httpStatusCode = res.statusCode;
          done();
        });

    });


    afterEach(()=>{
      httpStatusCode = null;
    });

    it(": ", (done) => {
      expect(httpStatusCode).toEqual(400);
      done();
    });
  });

  describe("Case: verification code not found", () => {
    //Also no need of grabbing verification code since
    //we are supplying an invalid one.

    beforeEach((done) => {

      request.post({
          url: endpoint + "/api/v1/user/verify",
          headers: {
            Accept: "application/json"
          },
          json: {
                   verifyCode: "888888",
                   phoneToVerify: phoneNumber1,
               },
        }, (err, res, body) => {
          if(err) {throw err}
          httpStatusCode = res.statusCode;
          done();
        });

    });


    afterEach(()=>{
      httpStatusCode = null;
    });

    it(": ", (done) => {
      expect(httpStatusCode).toEqual(401);
      done();
    });
  });

  describe("Case: invalid verification code", () => {
    //Supplying an invalid verification code,
    //wrong format

    beforeEach((done) => {

      request.post({
          url: endpoint + "/api/v1/user/verify",
          headers: {
            Accept: "application/json"
          },
          json: {
                   verifyCode: "8888",
                   phoneToVerify: phoneNumber1,
               },
        }, (err, res, body) => {
          if(err) {throw err}
          httpStatusCode = res.statusCode;
          done();
        });

    });


    afterEach(()=>{
      httpStatusCode = null;
    });

    it(": ", (done) => {
      expect(httpStatusCode).toEqual(401);
      done();
    });
  });

  //TODO: error cannot getTableName of undefined
  describe("Case: success by get request", () => {
    beforeEach((done)=>{
      var phone = helpers.formatPhone(phoneNumber2);
      models.user.findOne({
          where: {phone}
      }).then(user=>{
        if(!helpers.isEmpty(user)){

          models.verificationCode.findOne({
            where: {userId: user.id}
          }).then(verifiedObj=>{
            if(!helpers.isEmpty(verifiedObj)){
              verifyCode = verifiedObj.verificationCode;
              done();
            }
          });
        }else{
          console.log("User empty")
          done();
        }
      }).catch(e=>{
        console.log("Failed getting verification code ", e);
        return e;
      });

    })

    beforeEach((done) => {

      request.get({
          url: endpoint + "/v/" + verifyCode,
        }, (err, res, body) => {
          if(err) {throw err}
          httpStatusCode = res.statusCode;
          done();
        });

    });


    afterEach(()=>{
      httpStatusCode = null;
      verifyCode = null;
    });

    it(": ", (done) => {
      expect(httpStatusCode).toEqual(200);
      done();
    });

  });

  describe("Case: invalid code by get request", () => {

    beforeEach((done) => {
      verifyCode = 83484;
      request.get({
          url: endpoint + "/v/" + verifyCode,
        }, (err, res, body) => {
          if(err) {throw err}
          httpStatusCode = res.statusCode;
          done();
        });

    });


    afterEach(()=>{
      httpStatusCode = null;
      verifyCode = null;
    });

    it(": ", (done) => {
      expect(verifyCode.length).not.toEqual(6);
      expect(httpStatusCode).toEqual(401);
      done();
    });

  });

  describe("Case: no record of code by get request", () => {

    beforeEach((done) => {
      verifyCode = "834999";
      request.get({
          url: endpoint + "/v/" + verifyCode,
        }, (err, res, body) => {
          if(err) {throw err}
          httpStatusCode = res.statusCode;
          done();
        });

    });


    afterEach(()=>{
      httpStatusCode = null;
      verifyCode = null;
    });

    it(": ", (done) => {
      expect(verifyCode.length).toEqual(6);
      expect(httpStatusCode).toEqual(400);
      done();
    });

  });
})
