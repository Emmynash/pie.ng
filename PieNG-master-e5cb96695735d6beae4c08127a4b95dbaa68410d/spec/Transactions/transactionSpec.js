const baseConfig = require('../../server/config/config.base.js');
const serverConfig = require('../../server/config/config.server.js');
const constants = require('../../server/config/constants.js');
var models = require('../../server/models')
var helpers = require ('../../server/helpers/generic')

const request = require('request');
const endpoint = baseConfig.apiUrl;
const email1 = 'dretnan@logicaladdress.com';
const email2 = 'sotayamy@gmail.com';
const phoneNumber1 = '08067506296';
const phoneNumber2 = '08161730129';
const password1 = 'yahweh';
const password2 = 'yahwe';

describe('Transaction: ', () => {
    httpResponse = null;
    httpStatusCode = null;
    var sourceWalletId = null;
    var targetWalletId = null;
    var amountInSourceWallet = 15000000;
    var access_token = null;

    describe('Case: Users Exists ', () => {
       beforeEach((done) => {
           request.post({
               url: endpoint + "/api/v1/user/login",
               headers: {
                   Accept: "application/json",
               },
               json: {
                        login: phoneNumber1,
                        password: password1,
                    },
           },(err, res, body) => {
               if(err) {throw err}
               access_token = body.token;
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
           expect(httpStatusCode).toEqual(200);
           expect(httpResponse).not.toBe(null);
           done();
        });
    });

    describe('Case: Users Exists ', () => {
       beforeEach((done) => {
           request.post({
               url: endpoint + "/api/v1/user/login",
               headers: {
                   Accept: "application/json",
               },
               json: {
                        login: phoneNumber2,
                        password: password2,
                    },
           },(err, res, body) => {
               if(err) {throw err}
               access_token = body.token;
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
           expect(httpStatusCode).toEqual(200);
           expect(httpResponse).not.toBe(null);
           done();
        });
    });

    describe('Case: transfer from wallet B to Wallet A: insufficient funds', () => {
      beforeEach((done) => {
        var sourcePhone = helpers.formatPhone(phoneNumber2);
        models.user.findOne({
          where: {phone: sourcePhone}
        }).then(user => {
          if(!helpers.isEmpty(user)){
            models.wallet.findOne({
              where:{userId: user.id}
            }).then(walletObj => {
              if(!helpers.isEmpty(walletObj)){
                sourceWalletId = walletObj.id;
                done();
              }
            })
          }else{
            console.log("User empty")
            done();
          }
        }).catch(e=>{
          console.log("Failed in getting wallet id ", e);
          return e;
        });
      })

      beforeEach((done) => {
        var targetPhone = helpers.formatPhone(phoneNumber1);
        models.user.findOne({
          where: {phone: targetPhone}
        }).then(user =>{
          if(!helpers.isEmpty(user)){
            models.wallet.findOne({
              where:{userId: user.id}
            }).then(walletObj => {
              if(!helpers.isEmpty(walletObj)){
                targetWalletId = walletObj.id;
                done();
              }
            })
          }else{
            console.log("User empty")
            done();
          }
        }).catch(e=>{
          console.log("Failed in getting wallet id ", e);
          return e;
        });
      })

      beforeEach((done) => {
        request.post({
          url: endpoint+'/api/v1/wallet/transfer',
          headers: {
            Accept: 'application/json',
          },
          json: {
                  sourceWalletId,
                  targetWalletId,
                  amount: 1000000,
                },
          }, (err, res, body) => {
            if(err){throw err}
            httpStatusCode = res.statusCode;
            httpResponse = body;
            done();
          });
      })

      afterEach(() => {
        httpStatusCode = null;
        sourceWalletId = null;
        targetWalletId = null;
      })

      it(': should return 401', (done) => {
        expect(httpStatusCode).toEqual(401);
        done();
      })
    })



    // describe("Case: Debited and credited accounts should reflect accordingly for transferSession", () => {
    //   //40000 has been removed from phoneNumber1 and credited to phoneNumber2
    //   var sourceWalletCurrentBalance = null;
    //   var targetWalletCurrentBalance = null;
    //   beforeEach((done) => {
    //     models.user.findOne({
    //       where: {phone: helpers.formatPhone(phoneNumber1)}
    //     }).then(user => {
    //       if(!helpers.isEmpty(user)){
    //         models.wallet.findOne({
    //           where: {userId: user.id}
    //         }).then( walletObj => {
    //           if(!helpers.isEmpty(walletObj)){
    //             sourceWalletCurrentBalance = walletObj.testCurrentBalance;
    //             done();
    //           }
    //         })
    //       }
    //     })
    //   })
    //
    //   beforeEach((done) => {
    //     models.user.findOne({
    //       where: {phone: helpers.formatPhone(phoneNumber2)}
    //     }).then(user => {
    //       if(!helpers.isEmpty(user)){
    //         models.wallet.findOne({
    //           where: {userId: user.id}
    //         }).then( walletObj => {
    //           if(!helpers.isEmpty(walletObj)){
    //             targetWalletCurrentBalance = walletObj.testCurrentBalance;
    //             done();
    //           }
    //         })
    //       }
    //     })
    //   })
    //
    //   it(": should balance each other", (done) => {
    //     expect(sourceWalletCurrentBalance).toEqual(amountInSourceWallet - 4000000);
    //     expect(targetWalletCurrentBalance).toEqual(4000000);
    //     done();
    //   })
    // })

    describe("Case: transfer through transferSession : bad request", () => {
      var targetWalletPhone = "345555523";
      var amount = 1000000;
      beforeEach((done) => {
        request.post({
          url: endpoint + '/api/v1/wallet/transferSession',
          headers : {
            Accept: "application/json",
            'x-access-token': access_token,
          },
          json: {
            targetWalletPhone,
            amount,
          },
        }, (err, res, body) => {
          if(err){throw err}
          httpStatusCode = res.statusCode;
          httpResponse = body;
          done();
        })
      })

      afterEach(() => {
        httpStatusCode = null;
        httpResponse = null;
      })

      it(": returns 400 ", (done) => {
        expect(httpStatusCode).toEqual(400);
        done();
      });
    })

    describe("Case: transfer through transferSession : invalid phone number", () => {
      var targetWalletPhone = "34555552344";
      var amount = 1000000;
      beforeEach((done) => {
        request.post({
          url: endpoint + '/api/v1/wallet/transferSession',
          headers : {
            Accept: "application/json",
            'x-access-token': access_token,
          },
          json: {
            targetWalletPhone,
            amount,
          },
        }, (err, res, body) => {
          if(err){throw err}
          httpStatusCode = res.statusCode;
          httpResponse = body;
          done();
        })
      })

      afterEach(() => {
        httpStatusCode = null;
        httpResponse = null;
      })

      it(": returns 401 ", (done) => {
        expect(httpStatusCode).toEqual(401);
        done();
      });
    })

    describe("Case: transfer through transferSession : invalid target phone", () => {
      var targetWalletPhone = "08055246401";
      var amount = 1000000;
      beforeEach((done) => {
        request.post({
          url: endpoint + '/api/v1/wallet/transferSession',
          headers : {
            Accept: "application/json",
            'x-access-token': access_token,
          },
          json: {
            targetWalletPhone,
            amount,
          },
        }, (err, res, body) => {
          if(err){throw err}
          httpStatusCode = res.statusCode;
          httpResponse = body;
          done();
        })
      })

      afterEach(() => {
        httpStatusCode = null;
        httpResponse = null;
      })

      it(": returns 401 ", (done) => {
        expect(httpStatusCode).toEqual(401);
        done();
      });
    })

    describe("Case: transfer through transferSession: success", () => {
      var targetWalletPhone = phoneNumber2;
      var amount = 40000;
      beforeEach((done) => {
        request.post({
          url: endpoint + '/api/v1/wallet/transferSession',
          headers : {
            Accept: "application/json",
            'x-access-token': access_token,
          },
          json: {
            targetWalletPhone,
            amount,
          },
        }, (err, res, body) => {
          if(err){throw err}
          httpStatusCode = res.statusCode;
          httpResponse = body;
          done();
        })
      })

      afterEach(() => {
        httpStatusCode = null;
        httpResponse = null;
      })

      it(": returns 200 ", (done) => {
        expect(httpStatusCode).toEqual(200);
        done();
      });
    })

    describe("Case: transfer through transferSession : insufficient funds", () => {
      var targetWalletPhone = "08055246401";
      var amount = 20000000;
      beforeEach((done) => {
        request.post({
          url: endpoint + '/api/v1/wallet/transferSession',
          headers : {
            Accept: "application/json",
            'x-access-token': access_token,
          },
          json: {
            targetWalletPhone,
            amount,
          },
        }, (err, res, body) => {
          if(err){throw err}
          httpStatusCode = res.statusCode;
          httpResponse = body;
          done();
        })
      })

      afterEach(() => {
        httpStatusCode = null;
        httpResponse = null;
      })

      it(": returns 401 ", (done) => {
        expect(httpStatusCode).toEqual(401);
        done();
      });
    })


    describe('Case: transfer from wallet A to Wallet B', () => {
      beforeEach((done) => {
        var sourcePhone = helpers.formatPhone(phoneNumber2);
        models.user.findOne({
          where: {phone: sourcePhone}
        }).then(user => {
          if(!helpers.isEmpty(user)){
            models.wallet.findOne({
              where:{userId: user.id}
            }).then(walletObj => {
              if(!helpers.isEmpty(walletObj)){
                sourceWalletId = walletObj.id;
                done();
              }
            })
          }else{
            console.log("User empty")
            done();
          }
        }).catch(e=>{
          console.log("Failed in getting wallet id ", e);
          return e;
        });
      })

      beforeEach((done) => {
        var targetPhone = helpers.formatPhone(phoneNumber1);
        models.user.findOne({
          where: {phone: targetPhone}
        }).then(user =>{
          if(!helpers.isEmpty(user)){
            models.wallet.findOne({
              where:{userId: user.id}
            }).then(walletObj => {
              if(!helpers.isEmpty(walletObj)){
                targetWalletId = walletObj.id;
                done();
              }
            })
          }else{
            console.log("User empty")
            done();
          }
        }).catch(e=>{
          console.log("Failed in getting wallet id ", e);
          return e;
        });
      })

      beforeEach((done) => {
        request.post({
          url: endpoint+'/api/v1/wallet/transfer',
          headers: {
            Accept: 'application/json',
          },
          json: {
                  sourceWalletId,
                  targetWalletId,
                  amount: 10000,
                },
          }, (err, res, body) => {
            if(err){throw err}
            httpStatusCode = res.statusCode;
            httpResponse = body;
            done();
          }, 10000);
      })

      afterEach(() => {
        httpStatusCode = null;
        sourceWalletId = null;
        targetWalletId = null;
      })

      it(': should return 200', (done) => {
        expect(sourceWalletId).not.toBeNull();
        expect(targetWalletId).not.toBeNull();
        expect(httpStatusCode).toEqual(200);
        done();
      })
    })

    // describe("Case: Debited and credited accounts should reflect accordingly transfer on wallet ids", () => {
    //   //40000 has been removed from phoneNumber1 and credited to phoneNumber2
    //   var sourceWalletCurrentBalance = null;
    //   var targetWalletCurrentBalance = null;
    //   beforeEach((done) => {
    //     models.user.findOne({
    //       where: {phone: helpers.formatPhone(phoneNumber2)}
    //     }).then(user => {
    //       if(!helpers.isEmpty(user)){
    //         models.wallet.findOne({
    //           where: {userId: user.id}
    //         }).then( walletObj => {
    //           if(!helpers.isEmpty(walletObj)){
    //             sourceWalletCurrentBalance = walletObj.testCurrentBalance;
    //             done();
    //           }
    //         })
    //       }
    //     })
    //   })
    //
    //   beforeEach((done) => {
    //     models.user.findOne({
    //       where: {phone: helpers.formatPhone(phoneNumber1)}
    //     }).then(user => {
    //       if(!helpers.isEmpty(user)){
    //         models.wallet.findOne({
    //           where: {userId: user.id}
    //         }).then( walletObj => {
    //           if(!helpers.isEmpty(walletObj)){
    //             targetWalletCurrentBalance = walletObj.testCurrentBalance;
    //             done();
    //           }
    //         })
    //       }
    //     })
    //   })
    //
    //   it(": should balance each other", (done) => {
    //     expect(sourceWalletCurrentBalance).toEqual(3000000);
    //     expect(targetWalletCurrentBalance).toEqual(12000000);
    //     done();
    //   })
    // })



    describe('Case: Get transaction history', () =>{
      beforeEach((done) => {
          request.get({
            url: endpoint + "/api/v1/transactions/history",
            headers : {
              'x-access-token': access_token,
            },
          }, (err, res) => {
            if(err){throw err}
            httpStatusCode = res.statusCode;
            done();
          })
      })

      afterEach(() => {
        httpStatusCode = null;
      })

      it(": Should return 200 response code", (done) => {
        expect(httpStatusCode).toEqual(200);
        done();
      })
    })

})
