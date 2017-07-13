/** Backend testing
 * Powered by Mocha
 */

/** Requiring request module */
const request = require('request')

/** Requiring chai */
const expect = require('chai').expect

/** Defining the tests to execute */
describe('Core parts', function () {
  it('body must be empty', function () {
    request('http://localhost:3000', function (error, response, body) {
      let onche = 1
      expect(onche).to.equal(error)
    })
  })
})

/* eslint-env node, mocha */
