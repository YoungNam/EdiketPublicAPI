/* eslint-env mocha */
const AUTH_REQUIRED = require('../lib/constants/errors').AUTH_REQUIRED;
const TEST_HOST = require('../lib/constants/config').TEST_HOST;
const TEST_API_KEY = require('../lib/constants/config').TEST_API_KEY;
const expect = require('chai').expect;
const request = require('superagent');


describe('Request header', () => {
  it('should throw error without Auth key.', done => {
    request.get(TEST_HOST)
      .end(err => {
        expect(err).not.to.eql(null);
        expect(err.status).to.eql(401);
        expect(err.response.body).to.be.an('object');
        expect(err.response.body.code).to.eql(AUTH_REQUIRED.code);
        done();
      });
  });

  it('should throw error with invalid Authorization header.', done => {
    request.get(TEST_HOST)
      .set('Authorization', `Bearer ${TEST_API_KEY}`)
      .end(err => {
        expect(err).not.to.eql(null);
        expect(err.status).to.eql(401);
        expect(err.response.body).to.be.an('object');
        expect(err.response.body.code).to.eql(AUTH_REQUIRED.code);
        done();
      });
  });

  it('should return 200 with valid Authorization header.', done => {
    request.get(TEST_HOST)
      .set('Authorization', `"api-key"=${TEST_API_KEY}`)
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res.status).to.eql(200);
        done();
      });
  });
});
