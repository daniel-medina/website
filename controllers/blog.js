/**
 * Blog Controller
 * Handles the whole blog
 *
 * @author Daniel Medina
 * Date: 07/08/2017
 */

/** Configs imports */
import {archiveItemPerPage} from '../config/blog'

/** Modules imports */
import marked from 'marked'

/** Models imports */
import Article from '../models/article'

/** Libs imports */

/** Exporting the controller */
module.exports = {
  // getIndex {{{
  /**
   * Handles the index of the blog
   *
   * @param {HTTP} request
   * @param {HTTP} response
   */
  getIndex: function (request, response) {
    /** Defines query variables to use with recent and old articles */
    let limit = 2
    let sort = {
      _id: -1
    }

    /**
     * Get the recent articles
     *
     * @async
     * @returns {Promise} Promise containing the recent articles
     * @see Mongoose
     */
    async function getArticles () {
      let query = {
        limit: limit,
        sort: sort
      }

      return Article
        .find({})
        .limit(query.limit)
        .sort(query.sort)
        .exec()
    }

    /**
     * The the old articles
     *
     * @async
     * @returns {Promise} Promise containing the old articles
     */
    async function getOldArticles () {
      let query = {
        limit: 10,
        sort: sort,
        skip: limit
      }

      return Article
        .find({})
        .populate('category', 'title')
        .sort(query.sort)
        .skip(query.skip)
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
        let articles = await getArticles()
        let oldArticles = await getOldArticles()

        response.render('blog/index', {
          title: 'Blog',
          articles: articles,
          old: oldArticles,
          marked: marked
        })
      } catch (error) {
        console.log(error)
      }
    }())
  },
  // }}}
  // getArticle {{{
  /**
   * Handles the view of an article
   *
   * @param {HTTP} request
   * @param {HTTP} response
   */
  getArticle: function (request, response) {
    /**
     * Get the article matching the given URL
     *
     * @async
     * @returns {Promise} Promise containing the article
     */
    async function getArticle () {
      let url = request.params.url

      return Article
        .findOne({ url: url })
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
        let article = await getArticle()

        response.render('blog/article', {
          title: article.title,
          article: article
        })
      } catch (error) {
        console.log(error)
      }
    }())
  },
  // }}}
  // getArchive {{{
  /**
   * Handles the archive index view
   *
   * @param {HTTP} request
   * @param {HTTP} response
   */
  getArchive: function (request, response) {
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
     * Get all existing article, relative to the current page
     *
     * @async
     * @param {Number} page Current page
     * @returns {Promise} Promise containing all the article, relative to the current page
     * @see Mongoose
     * @see Pagination
     */
    async function getArticle (page) {
      let rawSkip = Math.floor(page * archiveItemPerPage)
      let skip = Math.floor(rawSkip - archiveItemPerPage)
      let query = {
        limit: archiveItemPerPage,
        skip: skip,
        sort: {
          _id: -1
        }
      }

      return Article
        .find({})
        .populate('category', 'title')
        .limit(query.limit)
        .sort(query.sort)
        .skip(query.skip)
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
        /** If the current page is superior to 1, we use the url's parameter, else we set it to 1 */
        let page = Number((request.params.page > 1) ? request.params.page : 1)
        let amount = await getAmount()
        let articles = await getArticle(page)
        let maxPage = Math.ceil(amount / archiveItemPerPage)
        let pagination = await response.locals.pagination.links(amount, page, maxPage, archiveItemPerPage)

        response.render('blog/archive', {
          title: 'Archive',
          articles: articles,
          amount: amount,
          page: page,
          maxPage: maxPage,
          pagination: pagination
        })
      } catch (error) {
        console.log(error)
      }
    }())
  }
  // }}}
}
