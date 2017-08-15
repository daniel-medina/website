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

/** GET */
export const get = {
  // index {{{
  /**
   * Handles the index of the blog
   *
   * @async
   * @param {HTTP} request
   * @param {HTTP} response
   */
  index: async (request, response) => {
    try {
    /** Defines query variables to use with recent and old articles */
      const limit = 2
      const sort = {
        _id: -1
      }

      // Function: getArticles {{{
      /**
       * Get the recent articles
       *
       * @returns {Promise} Promise containing the recent articles
       * @see Mongoose
       */
      const getArticles = () => {
        const query = {
          limit: limit,
          sort: sort
        }

        return Article
          .find({})
          .populate('category', 'title')
          .limit(query.limit)
          .sort(query.sort)
          .exec()
      }
      // }}}
      // Function: getOldArticles {{{
      /**
       * The the old articles
       *
       * @returns {Promise} Promise containing the old articles
       */
      const getOldArticles = () => {
        const query = {
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
      // }}}

      const articles = await getArticles()
      const oldArticles = await getOldArticles()

      response.render('blog/index', {
        title: 'Blog',
        articles: articles,
        old: oldArticles,
        marked: marked
      })
    } catch (error) {
      console.log(error)
    }
  },
  // }}}
  // article {{{
  /**
   * Handles the view of an article
   *
   * @async
   * @param {HTTP} request
   * @param {HTTP} response
   */
  article: async (request, response) => {
    try {
      // Function: getArticle {{{
      /**
       * Get the article matching the given URL
       *
       * @returns {Promise} Promise containing the article
       */
      const getArticle = () => {
        const url = request.params.url

        return Article
          .findOne({ url: url })
          .populate('category', 'title')
          .exec()
      }
      // }}}

      const article = await getArticle()

      response.render('blog/article', {
        title: article.title,
        article: article
      })
    } catch (error) {
      console.log(error)
    }
  },
  // }}}
  // archive {{{
  /**
   * Handles the archive index view
   *
   * @async
   * @param {HTTP} request
   * @param {HTTP} response
   */
  archive: async (request, response) => {
    try {
      // Function: getAmount {{{
      /**
       * Get the amount of existing article
       *
       * @returns {Promise} Promise containing the amount of existing article
       * @see Mongoose
       */
      const getAmount = () => {
        return Article
          .count({})
          .exec()
      }
      // }}}
      // Function: getArticle {{{
      /**
       * Get all existing article, relative to the current page
       *
       * @param {Number} page Current page
       * @returns {Promise} Promise containing all the article, relative to the current page
       * @see Mongoose
       * @see Pagination
       */
      const getArticle = page => {
        const rawSkip = Math.floor(page * archiveItemPerPage)
        const skip = Math.floor(rawSkip - archiveItemPerPage)
        const query = {
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
      // }}}

      /** If the current page is superior to 1, we use the url's parameter, else we set it to 1 */
      const page = Number((request.params.page > 1) ? request.params.page : 1)
      const amount = await getAmount()
      const articles = await getArticle(page)
      const maxPage = Math.ceil(amount / archiveItemPerPage)
      const pagination = await response.locals.pagination.links(amount, page, maxPage, archiveItemPerPage)

      /** We now render the page */
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
  }
  // }}}
}
