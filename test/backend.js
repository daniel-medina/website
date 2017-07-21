/**
  * Backend testing
  * Powered by Mocha
  */

// const request = require('request')
const expect = require('chai').expect

describe('Core parts', function () {
  it('test ?! onche onche', function () {
    let onche = 1
    expect(onche).to.equal(1)
  })
})

/* eslint-env node, mocha */
