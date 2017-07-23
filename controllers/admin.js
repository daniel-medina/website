/**
 * Admin Controller
 * Controls the admin panel
 *
 * @author Daniel Medina
 * Date: 07/18/2017
 */

/** Configs imports */

/** Modules imports */
import slug from 'slug'
import uuid from 'uuid/v4'

/** Models imports */
import Admin from '../models/admin'
import Article from '../models/article'
import {ArticleCategory} from '../models/refs/articleCategory'

/** Libs imports */
import Password from '../lib/password'

/** Exporting the controller */
export default {
  // getIndex {{{
  /**
   * Returns the index view of the admin panel
   *
   * @param {HTTP} request
   * @param {HTTP} response
   */
  getIndex: function (request, response) {
    response.render('admin/index', {
      title: 'Administration'
    })
  },
  // }}}
  // getAuthentication {{{
  /**
   * Returns the authentication view
   *
   * @param {HTTP} request
   * @param {HTTP} response
   */
  getAuthentication: function (request, response) {
    response.render('admin/authentication', {
      title: 'Authentication'
    })
  },
  // }}}
  // postAuthentication {{{
  /**
   * Handles the user sent authentication form
   *
   * @param {HTTP} request
   * @param {HTTP} response
   */
  postAuthentication: function (request, response) {
    /**
     * Checks if the given username exist in the database
     *
     * @async
     * @param {String} username - The given username by the user
     * @returns {Promise} Promise containing the amount of admin matching the given username
     * @see Mongoose
     */
    async function checkUsername (username) {
      return Admin
        .count({ username: username })
        .exec()
    }

    /**
     * Gets the info of the admin, if he exist
     *
     * @async
     * @param {String} username - Username given by the user
     * @returns {Promise} Promise containing the info of the admin
     * @see Mongoose
     */
    async function getAdmin (username) {
      return Admin
        .findOne({ username: username })
        .exec()
    }

    /**
     * Check if the given password is correct
     *
     * @async
     * @see bcrypt
     */
    async function checkPassword () {
      let username = request.body.username
      let password = request.body.password
      let adminAmount = await checkUsername(username)

      /** If the username matches an admin */
      if (adminAmount === 1) {
        /** Now we can get all information of the admin */
        let admin = await getAdmin(username)
        let compare = await Password.compare(password, admin.password)

        /** We can now check if the password is correct */
        if (compare) {
          /** We update its session */
          request.session.admin = {
            uuid: uuid(),
            username: admin.username,
            password: admin.password
          }

          /** Now we flash a message to the user after redirecting him */
          request.flash('success', 'You successfully logged in as ' + username + '.')
          response.redirect('/admin')
        } else {
          request.flash('error', 'The given password is not correct.')
          response.redirect('back')
        }
      } else {
        request.flash('error', 'The given username doesn\'t exist in the database.')
        response.redirect('back')
      }
    }

    /**
     * Asynchronous code execution
     *
     * @async
     * @throws Will throw an error to the console if it catches one
     */
    (async function () {
      try {
        let check = await checkPassword() // eslint-disable-line
      } catch (error) {
        console.log(error)
      }
    }())
  },
  // }}}
  // disconnect {{{
  /**
   * Disconnect from the current session
   *
   * @param {HTTP} request
   * @param {HTTP} response
   */
  disconnect: function (request, response) {
    /** We destroy the session */
    request.session.destroy()

    /** Then we redirect the user to the index */
    response.redirect('/')
  },
  // }}}
  // getBlog {{{
  /**
   * Gives the admin the control of the blog part of the website
   *
   * @param {HTTP} request
   * @param {HTTP} response
   */
  getBlog: function (request, response) {
    /**
     * Get all article categories
     *
     * @async
     * @returns {Promise} Promise containing all article categories
     * @see Mongoose
     */
    async function getCategories () {
      return ArticleCategory
        .find({})
        .exec()
    }

    /**
     * Asynchronous code execution
     *
     * @async
     * @throws Will throw an error to the console if it catches one
     */
    (async function () {
      try {
        let categories = await getCategories()

        response.render('admin/blog/index', {
          title: 'Blog management',
          categories: categories
        })
      } catch (error) {
        console.log(error)
      }
    }())
  },
  // }}}
  // postBlog {{{
  /**
   * Handles the user sent article via the form
   *
   * @param {HTTP} request
   * @param {HTTP} response
   */
  postBlog: (request, response) => {
    /**
     * Create a new article
     *
     * @async
     * @returns {Promise} Promise containing the query execution
     * @see Mongoose
     */
    async function createArticle () {
      let created = new Date()
      let title = request.body.title
      let url = slug(title)
      let category = request.body.category
      let content = request.body.content
      let query = {
        created: created,
        url: url,
        category: category,
        title: title,
        content: content
      }

      return Article.create(query)
    }

    /**
     * Asynchronous code execution
     *
     * @async
     * @throws Will throw an error to the console if it catches one
     */
    (async function () {
      try {
        let create = await createArticle() // eslint-disable-line

        request.flash('success', 'The article was successfully created.')
        response.redirect('back')
      } catch (error) {
        console.log(error)
      }
    }())
  }
  // }}}
}
