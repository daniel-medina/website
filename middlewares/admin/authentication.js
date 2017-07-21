/** Middleware - admin - index */

/** Imports goes here */
import {defaultUsername, defaultPassword} from '../../config/admin'

import Admin from '../../models/admin'

import Password from '../../lib/password'

module.exports = {
  // isAuth {{{
  isAuth: (request, response, next) => {
    /**
     * Count the number of admin account
     *
     * @returns {Promise} The count is returned as a promise
     * @see Mongoose
     */
    async function adminCount () {
      return Admin.count({}).exec()
    }

    /**
     * Create a default admin account
     *
     * @returns {Promise} Admin's model creation returned as a promise
     * @see Mongoose
     */
    async function createDefaultAdmin () {
      let created = new Date()
      let username = defaultUsername
      let password = await Password.hash(defaultPassword)

      return Admin
        .create({
          created: created,
          username: username,
          password: password
        })
    }

    /**
     * Check if the user is logged in as an admin
     *
     * @returns {Response} Redirect the user or pass to the next control
     */
    async function checkAuth () {
      let check = request.session.admin
      let path = request.route.path

      /** If he's authenticated */
      if (check) {
        /**
         * If the user is on the authentication page
         * We redirect him to the index of the admin panel
         * Because there is no need for him to login again
         */
        if (path === '/admin/authentication') {
          request.flash('error', 'You are already logged in.')
          response.redirect('/admin')
        } else {
          /** If not, let him go */
          next()
        }
      } else {
        /**
         * If the user is on the disconnect page
         * While not being logged in
         * We redirect him to the index of the website
         */
        if (path === '/admin/disconnect') {
          request.flash('error', 'You can\'t disconnect if you\'re not logged in.')
          response.redirect('/')
        } else {
          /**
           * If the user is not logged in, and trying to access a page that is not
           * The authentication page, redirect him to the proper route
           */
          if (path !== '/admin/authentication') {
            request.flash('error', 'You need to login in order to access the admin panel.')
            response.redirect('/admin/authentication')
          } else {
            next()
          }
        }
      }
    }

    /**
     * Asynchronous code execution
     *
     * @throws Will throw an error to the console if it catches one
     */
    (async function () {
      try {
        let adminAmount = await adminCount()

        if (adminAmount === 0) {
          /** If there is no admin in the database, we create a default one */
          let create = await createDefaultAdmin() // eslint-disable-line

          /**
           * If the first admin has just been created,
           * the user can't possibly be authenticated,
           * so we redirect him to the authentication page
           */
          response.redirect('/admin/authentication')
        } else {
          /** We check if he's authenticated */
          let check = await checkAuth() // eslint-disable-line
        }
      } catch (error) {
        console.log(error)
      }
    }())
  }
  // }}}
}
