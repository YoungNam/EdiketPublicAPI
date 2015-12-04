/* eslint-env mocha */
const INVALID_SCHEMA = require('../lib/constants/errors').INVALID_SCHEMA;
const TEST_HOST = require('../lib/constants/config').TEST_HOST;
const TEST_API_KEY = require('../lib/constants/config').TEST_API_KEY;
const expect = require('chai').expect;
const request = require('superagent');


describe('Upload Writing', () => {
  it('should throw error without required data.', done => {
    request.post(`${TEST_HOST}drafts/`)
      .set('Authorization', `"api-key"=${TEST_API_KEY}`)
      .send({ message: 'Please fix this, okay?' })
      .end(err => {
        expect(err).not.to.eql(null);
        expect(err.status).to.eql(400);
        expect(err.response.body).to.be.an('object');
        expect(err.response.body.code).to.eql(INVALID_SCHEMA.code);
        done();
      });
  });

  it('should successfully upload a request.', done => {
    request.post(`${TEST_HOST}drafts/`)
      .set('Authorization', `"api-key"=${TEST_API_KEY}`)
      .send({ content: 'Please fix this, okay?' })
      .end(err => {
        expect(err).to.eql(null);
        expect(err.status).to.eql(201);
        done();
      });
  });
});
