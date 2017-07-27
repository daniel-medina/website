/**
 * Admin Controller
 * Controls the admin panel
 *
 * @author Daniel Medina
 * Date: 07/18/2017
 */

/** Configs imports */
import {adminBlogItemPerPage} from '../config/blog'

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
module.exports = {
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
   * Blog's administration index
   *
   * @param {HTTP} request
   * @param {HTTP} response
   */
  getBlog: function (request, response) {
    /**
     * Get the amount of existing article
     *
     * @async
     * @returns {Promise} Promise containing the amount of existing article
     * @see Mongoose
     */
    async function getAmount () {
      return Article
        .count({})
        .exec()
    }

    /**
     * Gets all existing articles
     *
     * @async
     * @returns {Promise} Promise containing all the articles
     * @see Mongoose
     */
    async function getArticles (page) {
      let rawSkip = Math.floor(page * adminBlogItemPerPage)
      let skip = Math.floor(rawSkip - adminBlogItemPerPage)
      let query = {
        limit: adminBlogItemPerPage,
        skip: skip,
        sort: {
          _id: -1
        }
      }

      return Article
        .find({})
        .limit(query.limit)
        .skip(query.skip)
        .sort(query.sort)
        .populate('category', 'title')
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
        /** We get all the article to display them */
        /** If the current page is superior to 1, we use the url's parameter, else we set it to 1 */
        let page = Number((request.params.page > 1) ? request.params.page : 1)
        let amount = await getAmount()
        let articles = await getArticles(page)
        let maxPage = Math.ceil(amount / adminBlogItemPerPage)
        let pagination = await response.locals.pagination.links(amount, page, maxPage, adminBlogItemPerPage)

        /** Rendering the view ... */
        response.render('admin/blog/index', {
          title: 'Blog administration',
          amount: amount,
          page: page,
          maxPage: maxPage,
          pagination: pagination,
          articles: articles
        })
      } catch (error) {
        console.log(error)
      }
    }())
  },
  // }}}
  // getNewArticle {{{
  /**
   * Page form to create a new article
   *
   * @param {HTTP} request
   * @param {HTTP} response
   */
  getNewArticle: function (request, response) {
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

        response.render('admin/article/create', {
          title: 'Create an article',
          categories: categories
        })
      } catch (error) {
        console.log(error)
      }
    }())
  },
  // }}}
  // postNewArticle {{{
  /**
   * Handles the user sent article via the form
   *
   * @param {HTTP} request
   * @param {HTTP} response
   */
  postNewArticle: (request, response) => {
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
  },
  // }}}
  // getEditArticle {{{
  /**
   * Send to the user the form to edit an article
   *
   * @param {HTTP} request
   * @param {HTTP} response
   */
  getEditArticle: function (request, response) {
    /**
     * Get the information of the article
     *
     * @async
     * @param {ObjectID} id ID of the article to edit
     * @returns {Promise} Promise containing the article's information
     * @see Mongoose
     */
    async function getArticle (id) {
      let query = {
        _id: id
      }

      return Article
        .findOne(query)
        .populate('category', 'title')
        .exec()
    }

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
        /**
         * We get the id given by the user on the route, then get the article from it
         * We also get all categories of article
         * The middleware will handle the verifications
         */
        let id = request.params.id
        let article = await getArticle(id)
        let categories = await getCategories()

        /** Now we can return the view to the user, that will comes with the current article's information */
        response.render('admin/article/edit', {
          title: 'Edit an article',
          article: article,
          categories: categories
        })
      } catch (error) {
        console.log(error)
      }
    }())
  },
  // }}}
  // postEditArticle {{{
  /**
   * Handle the information sent by the user in order to
   * Update an article
   *
   * @param {HTTP} request
   * @param {HTTP} response
   */
  postEditArticle: function (request, response) {
    /**
     * Edit the article
     *
     * @async
     * @param {ObjectID} id ID of the article to edit
     * @returns {Promise} Promise containing the update query
     * @see Mongoose
     */
    async function updateArticle (id) {
      let title = request.body.title
      let url = slug(title)
      let category = request.body.category
      let content = request.body.content
      let update = {
        url: url,
        category: category,
        title: title,
        content: content
      }
      let query = {
        _id: id
      }

      /** Apparently, update queries does not need an exec() method */
      return Article
        .findOneAndUpdate(query, update)
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
        /** We execute the asynchronous update query */
        let update = await updateArticle(id) // eslint-disable-line

        /** Then we redirect the user back with a message; middlewares will handle the error and checks */
        request.flash('success', 'The article ' + request.body.title + ' has been updated successfully.')
        response.redirect('back')
      } catch (error) {
        console.log(error)
      }
    }())
  },
  // }}}
  // deleteArticle {{{
  /**
   * Deletes an article
   *
   * @param {HTTP} request
   * @param {HTTP} response
   */
  deleteArticle: function (request, response) {
    /**
     * Deletes the article
     *
     * @async
     * @param {ObjectID} id ID of the article to delete
     * @returns {Promise} Promise containing the removal query of the article
     * @see Mongoose
     */
    async function deleteArticle (id) {
      let query = {
        _id: id
      }

      return Article
        .remove(query)
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
        /**
         * We get the given ID by the user
         * Then we execute the function to delete the article
         * Verifications are done by a middleware
         */
        let id = request.params.id
        let destroy = await deleteArticle(id) // eslint-disable-line

        /** Now that it is done, redirect the user back and show him a confirmation message */
        request.flash('success', 'The article \'' + id + '\' has been deleted successfully.')
        response.redirect('back')
      } catch (error) {
        console.log(error)
      }
    }())
  }
  // }}}
}
