/**
 * Portfolio Controller
 * Handles every part of the portfolio page
 *
 * @author Daniel Medina
 * Date: 07/31/2017
 */

/** Configs imports */

/** Modules imports */

/** Models imports */
import Portfolio from '../models/portfolio'

/** Libs imports */

/** Exporting the controller */
module.exports = {
  // getIndex {{{
  /**
   * Returns the index of the portfolio
   *
   * @async
   * @param {HTTP} request
   * @param {HTTP} response
   */
  getIndex: async function (request, response) {
    try {
      response.render('portfolio/index', {
        title: 'Portfolio'
      })
    } catch (error) {
      console.log(error)
    }
  },
  // }}}
  // getProjects{{{
  /**
   * Returns all projects of the portfolio
   *
   * @async
   * @param {HTTP} request
   * @param {HTTP} response
   */
  getProjects: async function (request, response) {
    /**
     * Returns all projects of the portfolio
     *
     * @returns {Promise} Promise containing all projects
     * @see Mongoose
     */
    function getProjects () {
      return Portfolio
        .find({})
        .exec()
    }

    try {
      const projects = await getProjects()

      /** The global middleware ensure that this controller may only be executed as a xhr request */
      response.json(projects)
    } catch (error) {
      console.log(error)
    }
  }
  // }}}
}
