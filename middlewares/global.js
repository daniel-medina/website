/**
 * Global Middleware
 * Protects everything in the website
 *
 * @author Daniel Medina
 * Date: 31/07/2017
 */

/** Configs imports */

/** Modules imports */

/** Models imports */

/** Libs imports */

/** ALL */
export const all = {
  // ajaxProtection {{{
  /**
   * Allow only xhr request to pass
   *
   * @async
   * @param {HTTP} request
   * @param {HTTP} response
   * @param {HTTP} next
   */
  ajaxProtection: async function (request, response, next) {
    try {
      const xhr = request.xhr

      /** The request may bass only if it contains xhr header */
      if (xhr) {
        next()
      } else {
        /** If it's not, redirect the user to the index page */
        response.redirect('/')
      }
    } catch (error) {
      console.log(error)
    }
  }
  // }}}
}
