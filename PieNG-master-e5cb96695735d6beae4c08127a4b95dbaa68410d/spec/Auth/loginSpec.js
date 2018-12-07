var baseConfig = require("../../server/config/config.base.js");
var serverConfig = require("../../server/config/config.server.js");
var constants = require("../../server/config/constants.js");
var models = require('../../server/models')
var helpers = require ('../../server/helpers/generic')
var promise = require('bluebird')

var request = require('request');
var endpoint = baseConfig.apiUrl;
const email1 = "dretnan@logicaladdress.com";
const phoneNumber1 = '08066635255';

describe("Auth", () => {
    var httpResponse = null;
    var httpStatusCode = null;
    var access_token = null;

    describe('Case: Register Success', () => {

        beforeEach((done) => {
            request.post({
                url: endpoint + '/api/v1/user/create',
                headers: {
                  'Accept': 'application/json',
                },
                json: {
                    phone: phoneNumber1,
                    password: 'yahweh',
                    name: 'Joyce ADAMS',
                },
            },(err, res, body) => {
                if (err) { throw err; }
                httpResponse = body;
                httpStatusCode = res.statusCode;
                done();
            });
        }, 10000);

        afterEach(()=>{
            httpStatusCode = null;
            httpResponse = null;

        });

        it(': phone has no country code, email in request is not compulsory', (done) => {
            expect(httpStatusCode).toEqual(201);
            done();
        });

    });
    //TODO: activate phone number before logging in.
    var verifyCode = null;
    describe("Activation success", () => {
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
      });

      it(": ", (done) => {
        expect(verifyCode.length).toEqual(6);
        expect(httpStatusCode).toEqual(200);
        done();
      });
    });


    describe("login success: ", () => {
        beforeEach((done)=> {
            request.post({
               url: endpoint + "/api/v1/user/login",
               headers: {
                   Accept: "application/json",
               },
               json: {
                        login: phoneNumber1,
                        password: "yahweh",
                    },
           },(err, res, body) => {
               if(err) {throw err}
               httpResponse = body;
               httpStatusCode = res.statusCode;
               access_token = body.token;
               done();
           });
        });

        afterEach(() => {
           httpResponse = null;
           httpStatusCode = null;
        });

        it(": ", (done) => {
           expect(httpStatusCode).toEqual(200);
           expect(httpResponse).not.toBe(null);
           done();
        });
    });

    describe("Case: invalid credentials missing password", () => {
        beforeEach((done)=> {
            request.post({
               url: endpoint + "/api/v1/user/login",
               headers: {
                   Accept: "application/json",
               },
               json: {
                        login: phoneNumber1,
                    },
           },(err, res, body) => {
               if(err) {throw err}
               httpResponse = body;
               httpStatusCode = res.statusCode;
               done();
           });
        });

        afterEach(() => {
           httpResponse = null;
           httpStatusCode = null;
        });

        it(": ", (done) => {
            expect(httpStatusCode).toEqual(401);
            done();
        });
    });

    describe("Case: invalid credentials both missing", () => {
        beforeEach((done)=> {
            request.post({
               url: endpoint + "/api/v1/user/login",
               headers: {
                   Accept: "application/json",
               },
               json: {
                    },
           },(err, res, body) => {
               if(err) {throw err}
               httpResponse = body;
               httpStatusCode = res.statusCode;
               done();
           });
        });

        afterEach(() => {
           httpResponse = null;
           httpStatusCode = null;
        });

        it(": ", (done) => {
            expect(httpStatusCode).toEqual(401);
            done();
        });
    });

    describe("Case: invalid credentials missing login", () => {
        beforeEach((done)=> {
            request.post({
               url: endpoint + "/api/v1/user/login",
               headers: {
                   Accept: "application/json",
               },
               json: {
                        password: "yahweh",
                    },
           },(err, res, body) => {
               if(err) {throw err}
               httpResponse = body;
               httpStatusCode = res.statusCode;
               done();
           });
        });

        afterEach(() => {
           httpResponse = null;
           httpStatusCode = null;
        });

        it(": ", (done) => {
            expect(httpStatusCode).toEqual(401);
            done();
        });
    });

    describe("Case: incorrect login credentials", () => {
        beforeEach((done)=> {
            request.post({
               url: endpoint + "/api/v1/user/login",
               headers: {
                   Accept: "application/json",
               },
               json: {
                        login: phoneNumber1,
                        password: "yawe"
                    },
           },(err, res, body) => {
               if(err) {throw err}
               httpResponse = body;
               httpStatusCode = res.statusCode;
               done();
           });
        });

        afterEach(() => {
           httpResponse = null;
           httpStatusCode = null;
        });

        it(": ", (done) => {
            expect(httpStatusCode).toEqual(401);
            done();
        });
    });

    describe("Case: Phone number not registered", () => {
        beforeEach((done)=> {
            request.post({
               url: endpoint + "/api/v1/user/login",
               headers: {
                   Accept: "application/json",
               },
               json: {
                        login: "33344545454",
                        password: "yahweh"
                    },
           },(err, res, body) => {
               if(err) {throw err}
               httpResponse = body;
               httpStatusCode = res.statusCode;
               done();
           });
        });

        afterEach(() => {
           httpResponse = null;
           httpStatusCode = null;
        });

        it(": ", (done) => {
            expect(httpStatusCode).toEqual(401);
            done();
        });
    });

    //TODO: Fix unauthorised user access
    describe("Case: get loggedInUser", () => {
      it(": should return 200 response Code", (done) => {
        request.get({
          url: endpoint+'/api/v1/user',
          headers: {
            'x-access-token': access_token,
          },
        }, (err, res) => {
          if(err){throw err}
          expect(res.statusCode).toEqual(200);
          done();
        })
      })
    })

})
