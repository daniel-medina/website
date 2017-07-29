/**
 * Backend testing
 * Powered by Mocha
 */

/** Nothing needs to be asynchronous here */
const request = require('request')
// const expect = require('chai').expect

describe('Core parts', function () {
  it('test ?! onche onche', function () {
    request('http://localhost:3000', function (error, response, body) {
      console.log(error)
      console.log(response)
      console.log(body)
    })
  })
})

/* eslint-env node, mocha */
