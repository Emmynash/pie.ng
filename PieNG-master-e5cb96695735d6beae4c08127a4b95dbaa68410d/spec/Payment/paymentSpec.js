const baseConfig = require('../../server/config/config.base.js');
const serverConfig = require('../../server/config/config.server.js');
const constants = require('../../server/config/constants.js');
var models = require('../../server/models')
var helpers = require ('../../server/helpers/generic')

const request = require('request');
const endpoint = baseConfig.apiUrl;

const phoneNumber1 = '08067506296';
const phoneNumber2 = '08161730129'
const password1 = 'yahweh'
const password2 = "yahwe";

var OTPSuccess = "123456";
var OTPFailure = "123456";
var ccSuccess = {
  publicKey: 'pk_Wpiesgh3h36b3pie', email: 'sotayamy@gmail.com',
  CCnumber: "5555555555554444", CCcvc: "100", CCname: "Retnan Daser",
  CCexpiry: "11/21", amount:"22000000", CCpin: "9235",
}

var ccSuccess2 = {
  publicKey: 'pk_Wpiesgh3h36b3pie', email: 'sotayamy@gmail.com',
  CCnumber: "5555555555554444", CCcvc: "100", CCname: "Retnan Daser",
  CCexpiry: "11/21", amount:"150000", CCpin: "9235",
}

var ccFailure = {
  publicKey: 'pk_Wpiesgh3h36b3pie', email: '',
  CCnumber: "5105105105105100",CCcvc: "455", CCname:'',
  CCexpiry: "07/21", amount: "15000000", CCpin: "1529",
}
var access_token = null;
var access_token2 = null;

describe("Payment: ", () => {
  httpResponse = null;
  httpStatusCode = null;
  var chargeId = null;
  var chargeId2 = null;

  describe("Case: login success in payment", () => {
    beforeEach((done) => {
        request.post({
            url: endpoint + '/api/v1/user/login',
            headers: {
              'Accept': 'application/json',
            },
            json: {
                login: phoneNumber1,
                password: password1,
            },
        },(err, res, body) => {
            if (err) { throw err; }
            access_token = body.token;
            httpResponse = body;
            httpStatusCode = res.statusCode;
            done();
        });

    });

    afterEach(() => {
      httpResponse = null;
      httpStatusCode = null;
    })

    it(": should return 200", (done) =>{
        expect(httpStatusCode).toEqual(200);
        done();
    })
  })

  describe("Case: wallet funding 'charge' in test", () => {
    beforeEach((done) => {
      request.post({
        url: endpoint + '/api/v1/charge',
        headers: {
          Accept: "application/json",
          "x-access-token": access_token,
        },

        json: ccSuccess,
      }, (err, res, body) => {
        if(err){throw err}
        chargeId = body.transaction.id;
        httpStatusCode = res.statusCode;
        httpResponse = body;
        done();
      })
    }, 60000);

    afterEach(() => {
      httpResponse = null;
      httpStatusCode = null;
    })

    it(": should return 201", (done) => {
      expect(httpStatusCode).toEqual(201);
      expect(chargeId).not.toBeNull();
      done();
    })
  })

  describe("Case: wallet funding 'verification' in test", () => {
    beforeEach((done) => {
      request.post({
        url: endpoint + '/api/v1/charge/verify',
        headers: {
          Accept: "application/json",
          'x-access-token': access_token,
        },
        json: {
          transactionId:chargeId,
          publicKey: ccSuccess.publicKey,
          authValue: OTPSuccess,
        },

      }, (err, res, body) => {
        if(err){throw err}
        httpStatusCode = res.statusCode;
        httpResponse = body;
        done();
      })
    }, 30000)

    afterEach(() => {
      httpResponse = null;
      httpStatusCode = null;
    })

    it(": should return 200", (done) => {
      expect(httpStatusCode).toEqual(200);
      done();
    })
  })

  describe("Case: amount has been credited to wallet", () => {
    var sourceWalletCurrentBalance = null;
    var walletServiceChargeFundBalance = null;
    var sourceWalletPreviousBalance = null;
    beforeEach((done) => {
      var phone = helpers.formatPhone(phoneNumber1);
      models.user.findOne({
        where: {phone}
      }).then(user => {
        if(!helpers.isEmpty(user)){
          models.wallet.findOne({
            where: { userId: user.id}
          }).then(walletObj => {
            if(!helpers.isEmpty(walletObj)){
              sourceWalletCurrentBalance = walletObj.testCurrentBalance;
              sourceWalletPreviousBalance = walletObj.testPreviousBalance;
              done();
            }
          })
        }else{
          console.log("Unable to find user");
          done();
        }

      }).catch(e => {
        console.log("Unabled to find currentBalance");
        return e;
      })
    })

    beforeEach((done) => {
      models.wallet.findOne({
        where: {id: 'wal_fund.pie.ng'}
      }).then(walletObj =>{
        if(!helpers.isEmpty(walletObj)){
          walletServiceChargeFundBalance = walletObj.testCurrentBalance;
          done();
        }else{
          console.log("Unable to find wallet entry")
        }
      }).catch(e => {
        console.log("Unabled to find currentBalance");
        return e;
      })
    })

    afterEach(() => {
      sourceWalletCurrentBalance = null;
      walletServiceChargeFundBalance = null;
    })


    it(": should return amount credited", (done) => {
      expect(sourceWalletCurrentBalance).toEqual("2200000000");
      expect(walletServiceChargeFundBalance).toEqual(0);
      done();
    })
  })

  describe("Case: login success to second payment account", () => {
    beforeEach((done) => {
        request.post({
            url: endpoint + '/api/v1/user/login',
            headers: {
              'Accept': 'application/json',
            },
            json: {
                login: phoneNumber2,
                password: password2,
            },
        },(err, res, body) => {
            if (err) { throw err; }
            access_token2 = body.token;
            httpResponse = body;
            httpStatusCode = res.statusCode;
            done();
        });

    });

    afterEach(() => {
      httpResponse = null;
      httpStatusCode = null;
    })

    it(": should return 200", (done) =>{
        expect(httpStatusCode).toEqual(200);
        done();
    })
  })

  describe("Case: second wallet funding 'charge' in test", () => {
    beforeEach((done) => {
      request.post({
        url: endpoint + '/api/v1/charge',
        headers: {
          Accept: "application/json",
          "x-access-token": access_token2,
        },

        json: ccSuccess2,
      }, (err, res, body) => {
        if(err){throw err}
        chargeId2 = body.transaction.id;
        httpStatusCode = res.statusCode;
        httpResponse = body;
        done();
      })
    }, 60000);

    afterEach(() => {
      httpResponse = null;
      httpStatusCode = null;
    })

    it(": should return 201", (done) => {
      expect(httpStatusCode).toEqual(201);
      expect(chargeId2).not.toBeNull();
      done();
    })
  })

  describe("Case: second wallet funding 'verification' in test", () => {
    beforeEach((done) => {
      request.post({
        url: endpoint + '/api/v1/charge/verify',
        headers: {
          Accept: "application/json",
          'x-access-token': access_token2,
        },
        json: {
          transactionId:chargeId2,
          publicKey: ccSuccess2.publicKey,
          authValue: OTPSuccess,
        },

      }, (err, res, body) => {
        if(err){throw err}
        httpStatusCode = res.statusCode;
        httpResponse = body;
        done();
      })
    }, 30000)

    afterEach(() => {
      httpResponse = null;
      httpStatusCode = null;
    })

    it(": should return 200", (done) => {
      expect(chargeId2).not.toBeNull();
      expect(httpStatusCode).toEqual(200);
      done();
    })
  })

  describe("Case: amount has been credited to second wallet", () => {
    var sourceWalletCurrentBalance = null;
    var walletServiceChargeFundBalance = null;
    var sourceWalletPreviousBalance = null;
    beforeEach((done) => {
      var phone = helpers.formatPhone(phoneNumber2);
      models.user.findOne({
        where: {phone}
      }).then(user => {
        if(!helpers.isEmpty(user)){
          models.wallet.findOne({
            where: { userId: user.id}
          }).then(walletObj => {
            if(!helpers.isEmpty(walletObj)){
              sourceWalletCurrentBalance = walletObj.testCurrentBalance;
              done();
            }
          })
        }else{
          console.log("Unable to find user");
          done();
        }

      }).catch(e => {
        console.log("Unabled to find currentBalance");
        return e;
      })
    })

    beforeEach((done) => {
      models.wallet.findOne({
        where: {id: 'wal_fund.pie.ng'}
      }).then(walletObj =>{
        if(!helpers.isEmpty(walletObj)){
          walletServiceChargeFundBalance = walletObj.testCurrentBalance;
          done();
        }else{
          console.log("Unable to find wallet entry")
        }
      }).catch(e => {
        console.log("Unabled to find currentBalance");
        return e;
      })
    })

    afterEach(() => {
      sourceWalletCurrentBalance = null;
      walletServiceChargeFundBalance = null;
    })

    it(": should return amount credited", (done) => {
      expect(sourceWalletCurrentBalance).toEqual("15000000");
      expect(walletServiceChargeFundBalance).toEqual(0);
      done();
    })
  })
})
