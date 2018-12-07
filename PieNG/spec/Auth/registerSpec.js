const baseConfig = require('../../server/config/config.base.js');
const serverConfig = require('../../server/config/config.server.js');
const constants = require('../../server/config/constants.js');

const request = require('request');
const endpoint = baseConfig.apiUrl;
const phoneNumber1 = '08067506296';
const phoneNumber2 = '08161730129';
const accessToken2 = null;


describe('Auth', () => {
    var httpResponse = null;
    var httpStatusCode = null;

    describe('Case: Success 1', () => {
        beforeEach((done) => {
            request.post({
                url: endpoint + '/api/v1/user/create',
                headers: {
                  'Accept': 'application/json',
                },
                json: {
                    phone: phoneNumber1,
                    password: 'yahweh',
                    name: 'Retnan DASER',
                },
            },(err, res, body) => {
                if (err) { throw err; }
                res = res.toJSON();
                httpResponse = body;
                httpStatusCode = res.statusCode;
                done();
            });

        }, 10000);

        afterEach(()=>{
            httpStatusCode = null;
            httpResponse = null;
        });

        it(': ', (done) => {
            expect(httpStatusCode).toEqual(201);
            done();
        });

    });

    describe('Case: Success 2', () => {

        beforeEach((done) => {
            request.post({
                url: endpoint + '/api/v1/user/create',
                headers: {
                  'Accept': 'application/json',
                },
                json: {
                    phone: phoneNumber2,
                    password: 'yahwe',
                    name: 'Solomon DASER'
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

        it(':', (done) => {
            expect(httpStatusCode).toEqual(201);
            done();
        });

    });


    //TODO: cleaning emails
    describe('Case: Duplicate', () => {

        beforeEach((done) => {
            request.post({
                url: endpoint + '/api/v1/user/create',
                headers: {
                  'Accept': 'application/json',
                },
                json: {
                    phone: phoneNumber1,
                    password: 'yahweh',
                    name: 'Retnan DASER',
                },
            },(err, res, body) => {
                if (err) { throw err; }
                httpResponse = body;
                httpStatusCode = res.statusCode;
                done();
            });
        });

        afterEach(()=>{
            httpStatusCode = null;
            httpResponse = null;
        });

        it(': phone was used', (done) => {
            expect(httpStatusCode).toEqual(409);
            expect(httpResponse.message).not.toBe(null);
            done();
        });

    });

    describe('Case: Invalid Request', () => {

        beforeEach((done) => {
            request.post({
                url: endpoint + '/api/v1/user/create',
                headers: {
                  'Accept': 'application/json',
                },
                json: {
                    password: 'yahweh',
                    name: 'Retnan DASER',
                },
            },(err, res, body) => {
                if (err) { throw err; }
                httpResponse = body;
                httpStatusCode = res.statusCode;
                done();
            });
        });

        afterEach(()=>{
            httpStatusCode = null;
            httpResponse = null;
        });

        it(': no phone in request', (done) => {
            expect(httpStatusCode).toEqual(400);
            expect(httpResponse.message).not.toBe(null);
            done();
        });

    });

    describe('Case: Invalid Request', () => {

        beforeEach((done) => {
            request.post({
                url: endpoint + '/api/v1/user/create',
                headers: {
                  'Accept': 'application/json',
                },
                json: {
                    phone: '2348036504287',
                    password: 'yahweh',
                },
            },(err, res, body) => {
                if (err) { throw err; }
                httpResponse = body;
                httpStatusCode = res.statusCode;
                done();
            });
        });

        afterEach(()=>{
            httpStatusCode = null;
            httpResponse = null;
        });

        it(': no name in request', (done) => {
            expect(httpStatusCode).toEqual(400);
            expect(httpResponse.message).not.toBe(null);
            done();
        });

    });
})
