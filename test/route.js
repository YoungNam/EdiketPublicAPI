/* eslint-env mocha */

const expect = require('chai').expect;
const request = require('superagent');

describe('Request header', () => {
  it('should run test.', (done) => {
    request.get('http://localhost:5000/drafts/')
      .set('Accept', 'application/json')
      .end(e => {
        expect(e).to.eql(null);
        done();
      });
  });
});
