/**
 * Admin Middleware
 * Protects the admin panel
 *
 * @author Daniel Medina
 * Date: 07/12/2017
 */

/** Configs imports */
import {defaultUsername, defaultPassword} from '../config/admin'
import {
  minArticleTitleLength, minArticleCategoryLength,
  maxArticleTitleLength, maxArticleCategoryLength
} from '../config/blog'

/** Modules imports */
import slug from 'slug'

/** Models imports */
import Admin from '../models/admin'
import Article from '../models/article'
import {ArticleCategory} from '../models/refs/articleCategory'

/** Libs imports */
import Password from '../lib/password'

/** Setting slug mode */
slug.defaults.mode = 'rfc3986'

/** Exporting the middleware */
module.exports = {
  // postArticle {{{
  /**
   * Verify user sent information for the creation of an article
   *
   * @param {HTTP} request
   * @param {HTTP} response
   * @param {HTTP} next
   */
  postArticle: function (request, response, next) {
    let title = request.body.title

    /** If the title's length matches the given configuration */
    if (title.length > minArticleTitleLength && title.length < maxArticleTitleLength) {
      next()
    } else {
      /** Must flash POST data back in order to avoid pissing off the user */
      request.flash('error', 'The title\'s length must be between ' + minArticleTitleLength + ' and ' + maxArticleTitleLength + ' character long.')
      response.redirect('back')
    }
  },
  // }}}
  // postArticleCategory {{{
  /**
   * Secure the creation of article category
   *
   * @param {HTTP} request
   * @param {HTTP} response
   * @param {HTTP} next
   */
  postArticleCategory: function (request, response, next) {
    let title = request.body.title

    /** If the title matches the configuration's settings */
    if (title.length > minArticleCategoryLength && title.length < maxArticleCategoryLength) {
      next()
    } else {
      /** TODO : flashing POST data back */
      request.flash('error', 'The title\'s length must be between ' + minArticleCategoryLength + ' and ' + maxArticleCategoryLength + ' character long.')
      response.redirect('back')
    }
  },
  // }}}
  // articleCategoryExist {{{
  /**
   * Checks if the chosen article's category exist
   *
   * @param {HTTP} request
   * @param {HTTP} response
   * @param {HTTP} next
   */
  articleCategoryExist: function (request, response, next) {
    /**
     * Returns the amount of category matching the selected category id by the user
     *
     * @async
     * @param {Number} category Chosen category id, sent by the user as POST method
     * @returns {Promise} Promise containing the category count
     * @see Mongoose
     */
    async function countCategory (category) {
      /** Returns either 1 or 0, there can't be duplicate ids */
      return ArticleCategory.count({ _id: category }).exec()
    }

    /**
     * Asynchronous code execution
     *
     * @async
     * @throws Will throw an error to the console if it catches one
     */
    (async function () {
      try {
        let category = request.body.category
        let count = await countCategory(category)

        if (count !== 0) {
          next()
        } else {
          request.flash('error', 'The selected category doesn\'t exist.')
          response.redirect('back')
        }
      } catch (error) {
        console.log(error)
      }
    }())
  },
  // }}}
  // articleTitleExist {{{
  /**
   * Checks if the written article's title doesn't already exist
   * Because article's title are used as url, so there must not be any duplicate
   *
   * @param {HTTP} request
   * @param {HTTP} response
   * @param {HTTP} next
   */
  articleTitleExist: (request, response, next) => {
    /**
     * Returns the amount of article matching the written title
     * Converted to url
     *
     * @async
     * @returns {Promise} Promise containing the article count
     * @see Mongoose
     * @see slug
     */
    async function countArticle (url) {
      return Article.count({ url: url }).exec()
    }

    /**
     * Asynchronous code execution
     *
     * @async
     * @throws Will throw an error to the console if it catches one
     */
    (async function () {
      try {
        /** Convertion of the title to its url form, using slug */
        let url = slug(request.body.title)

        /** We then use it to see if it exists */
        let count = await countArticle(url)

        /** If it does not already exist, we can pass */
        if (count === 0) {
          next()
        } else {
          /** Else, we redirect the user back and show him an error message */
          request.flash('error', 'The article\'s title already exist in the database.')
          response.redirect('back')
        }
      } catch (error) {
        console.log(error)
      }
    }())
  },
  // }}}
  // articleCategoryTitleExist {{{
  /**
   * Checks if the written article's category title doesn't already exist
   *
   * @param {HTTP} request
   * @param {HTTP} response
   * @param {HTTP} next
   */
  articleCategoryTitleExist: (request, response, next) => {
    /**
     * Returns the amount of article matching the written title
     * Converted to url
     *
     * @async
     * @returns {Promise} Promise containing the article count
     * @see Mongoose
     * @see slug
     */
    async function countArticleCategory (title) {
      return ArticleCategory.count({ title: title }).exec()
    }

    /**
     * Asynchronous code execution
     *
     * @async
     * @throws Will throw an error to the console if it catches one
     */
    (async function () {
      try {
        const title = request.body.title

        /** We then use it to see if it exists */
        const count = await countArticleCategory(title)

        /** If it does not already exist, we can pass */
        if (count === 0) {
          next()
        } else {
          /** Else, we redirect the user back and show him an error message */
          request.flash('error', 'The article\'s category title already exist in the database.')
          response.redirect('back')
        }
      } catch (error) {
        console.log(error)
      }
    }())
  },
  // }}}
  // articleIdExist {{{
  /**
   * Checks if the given article's id exist
   *
   * @param {HTTP} request
   * @param {HTTP} response
   * @param {HTTP} next
   */
  articleIdExist: function (request, response, next) {
    /**
     * Count the number of article matching the given ID
     * It's either 1 or 0 since IDs cannot be duplicated
     *
     * @async
     * @param {ObjectID} id ObjectID of the article
     * @returns {Promise} Promise containing the count
     * @see Mongoose
     */
    async function countArticle (id) {
      let query = {
        _id: id
      }

      return Article
        .count(query)
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
        let id = request.params.id
        let count = await countArticle(id)

        /**
         * If the article exist (isn't equal to 0)
         * Else, we block the request and return an error
         */
        if (count !== 0) {
          next()
        } else {
          /** If it doesn't exist, redirect the user back and flash him an error message */
          request.flash('error', 'The provided article\'s id doesn\'t exist in the database.')
          response.redirect('back')
        }
      } catch (error) {
        console.log(error)
      }
    }())
  },
  // }}}
  // isAuth {{{
  /**
   * Checks if the user is authenticated as an admin
   *
   * @param {HTTP} request
   * @param {HTTP} response
   * @param {HTTP} next
   */
  isAuth: function (request, response, next) {
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
      let path = request.url

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
     * @async
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
