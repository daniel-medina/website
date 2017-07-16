/** Middleware - admin - index */

/** Importing models */
import Admin from '../../models/admin'

/** Importing modules */

module.exports = {
  isAuthenticated: (request, response, next) => {
    async function adminCount () {
      return Admin.count({}).exec()
    }

    (async function () {
      try {
        let count = await adminCount()

        /** If there is no admin in the database, we insert a default admin with default credentials
          * Else, we check if he's authenticated or not */
        if (count === 0) {
          response.send('no admin ...')
        } else {
          response.send('coucou')
          next()
        }
      } catch (error) {
        console.log(error)
      }
    }())
  }
}
