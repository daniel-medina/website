/**
 * Backend testing
 * Powered by Mocha
 */

/** Nothing needs to be asynchronous here */
const chai = require('chai')
const expect = chai.expect
const http = require('chai-http')
const server = 'http://localhost:3000'

chai.use(http)

describe('Core parts', function () {
  describe('Verifying that all pages are properly sent to the user', function () {
    it('Index page is properly sent to the guest', function (done) {
      /**
       * See if the index page returns a http message 200 or not
       *
       * @async
       * @returns {Promise} Promise containing the request on the server
       */
      async function getStatus () {
        return chai.request(server)
          .get('/')
          .end()
      }

      /**
       * Asynchronous code execution
       *
       * @async
       * @throws Will throw an error to the console if it catches one
       */
      (async function () {
        try {
          const status = await getStatus()

          expect(status).to.equal(200)
          done()
        } catch (error) {
          console.log(error)
        }
      }())
    })
  })
})

/* eslint-env node, mocha */
