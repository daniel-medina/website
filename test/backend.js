/**
 * Backend testing
 * Powered by Mocha
 */

/** Importing configs */

/** Nothing needs to be asynchronous here */
const chai = require('chai')
const expect = chai.expect
const http = require('chai-http')
const server = 'http://localhost:3000'

chai.use(http)

describe('Core parts', function () {
  // Verifying that all pages are properly sent to the user {{{
  describe('Verifying that all pages are properly sent to the user', function () {
    // index page is properly sent to the user {{{
    it('index page is properly sent to the user', function (done) {
      /** We execute a request to the server */
      chai.request(server)
        /** the url is / ; the index */
        .get('/')
        .end(function (error, response) {
          if (error) throw error

          /** We checks if the index returns a http code 200 */
          expect(response.status).to.equal(200)

          done()
        })
    })
    // }}}
    // admin page is properly sent to the user {{{
    it('admin page is properly sent to the user', function (done) {
      /** We execute a request to the server */
      chai.request(server)
        /** the url is / ; the index */
        .get('/admin')
        .end(function (error, response) {
          if (error) throw error

          /** We checks if the index returns a http code 200 */
          expect(response.status).to.equal(200)

          done()
        })
    })
    // }}}
  })
  // }}}
  describe('Administration security checks', function () {
  // testing authentication with default credentials {{{
    it('testing authentication with default credentials', function (done) {
      chai.request(server)
        .post('/admin/authentication')
        /** Will have to put the config variables once imports/exports are usable here */
        .send({
          username: 'admin',
          password: 'admin'
        })
        .then(function (response) {
          expect(response).to.have.cookie('admin')

          done()
        })
        .catch(function (error) {
          console.log(error)
        })
    })
    // }}}
    // all admin routes must redirect to /admin/authentication if the user is not logged in as an admin {{{
    describe('all admin routes must redirect to /admin/authentication if the user is not logged in as an admin', function () {
      chai.request(server)
    })
  // }}}
  })
})

/* eslint-env node, mocha */
