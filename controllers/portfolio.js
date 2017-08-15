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

/** GET */
export const get = {
  // index {{{
  /**
   * Returns the index of the portfolio
   *
   * @async
   * @param {HTTP} request
   * @param {HTTP} response
   */
  index: async function (request, response) {
    try {
      response.render('portfolio/index', {
        title: 'Portfolio'
      })
    } catch (error) {
      console.log(error)
    }
  },
  // }}}
  // projects{{{
  /**
   * Returns all projects of the portfolio
   *
   * @async
   * @param {HTTP} request
   * @param {HTTP} response
   */
  projects: async function (request, response) {
    try {
      // Function: getProjects {{{
      /**
       * Returns all projects of the portfolio
       *
       * @returns {Promise} Promise containing all projects
       * @see Mongoose
       */
      const getProjects = () => {
        return Portfolio
          .find({})
          .exec()
      }
      // }}}

      const projects = await getProjects()

      /** The global middleware ensure that this controller may only be executed as a xhr request */
      response.json(projects)
    } catch (error) {
      console.log(error)
    }
  }
  // }}}
}
