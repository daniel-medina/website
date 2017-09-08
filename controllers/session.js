/**
 * Session Controller
 * Handles sessions
 *
 * @author Daniel Medina
 * Date: 08/20/2017
 */

/** Configs imports */

/** Modules imports */

/** Models imports */

/** Libs imports */

/** GET */
export const get = {
  // Controller: session {{{
  /**
   * Returns the current session
   * Via an ajax request
   *
   * @async
   * @param {HTTP} request
   * @param {HTTP} response
   */
  session: async (request, response) => {
    try {
      // Function: getSession {{{
      /**
       * Get the session of the current user
       *
       * @returns {Object} object containing the session
       */
      const getSession = () => {
        return request.session
      }
      // }}}

      const session = await getSession()

      /** We return the data as a json to be readable by a xhr request */
      response.json(session)
    } catch (error) {
      console.log(error)
    }
  }
  // }}}
}
