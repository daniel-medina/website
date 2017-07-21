/** Administration controller */

/** Imports goes here */
import Admin from '../models/admin'
import Article from '../models/article'
import {ArticleCategory} from '../models/refs/articleCategory'

import Password from '../lib/password'

import slug from 'slug'
import uuid from 'uuid/v4'

module.exports = {
  // getIndex {{{
  getIndex: (request, response) => {
    response.render('admin/index', {
      title: 'Administration'
    })
  },
  // }}}
  // getAuthentication {{{
  getAuthentication: (request, response) => {
    response.render('admin/authentication', {
      title: 'Authentication'
    })
  },
  // }}}
  // postAuthentication {{{
  postAuthentication: (request, response) => {
    async function checkUsername (username) {
      return Admin
        .count({ username: username })
        .exec()
    }

    /**
     * Gets the info of the admin, if he exist
     *
     * @param {String} username - Username given by the user
     * @returns {Promise} Promise containing the info of the admin
     */
    async function getAdmin (username) {
      return Admin
        .findOne({ username: username })
        .exec()
    }

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
  disconnect: (request, response) => {
    /** We destroy the session */
    request.session.destroy()

    /** Then we redirect the user to the index */
    response.redirect('/')
  },
  // }}}
  // getBlog {{{
  getBlog: (request, response) => {
    async function getCategories () {
      return ArticleCategory
        .find({})
        .exec()
    }

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
  postBlog: (request, response) => {
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
