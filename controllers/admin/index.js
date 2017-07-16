/** Admin's index controller */

/** Importing models */
// import Admin from '../../models/admin'

/** Importing modules */
// import moment from 'moment'

/** Exporting the controller */
module.exports = {
  /** HTTP REQUEST - GET */
  /** ------------------ */
  getIndex: (request, response) => {
    response.render('admin/index', {
      title: 'Administration'
    })
  },
  getAuthentication: (request, response) => {
    response.render('admin/authentication', {
      title: 'Authentication'
    })
  }
}
