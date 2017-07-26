/**
 * Blog Middleware
 * Protects the blog
 *
 * @author Daniel Medina
 * Date: 07/15/2017
 */

/** Configs imports */
import {archiveItemPerPage} from '../config/blog'

/** Modules imports */

/** Models imports */
import Article from '../models/article'

/** Libs imports */

/** Exporting the middleware */
module.exports = {
  // articleExist {{{
  /**
   * Checks if the article do exist
   *
   * @param {HTTP} request
   * @param {HTTP} response
   * @param {HTTP} next
   */
  articleExist: function (request, response, next) {
    /**
     * Gets the amount of article matching the given URL
     *
     * @async
     * @param {String} url Url given by the user
     * @returns {Promise} Promise containg the amount of article
     * @see Mongoose
     */
    async function getCount (url) {
      /** The returned count can only be 1 or 0, because there can be no URL duplication */
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
        /** We get the article's URL given by the user */
        let url = request.params.url

        /** We get the number of article matching the URL */
        let count = await getCount(url)

        /** If there is no article matching the URL, return an error */
        if (count === 0) {
          response.status('404')
            .render('error/404', { title: 'ERROR' })
        } else {
          /** Else, he may pass */
          next()
        }
      } catch (error) {
        console.log(error)
      }
    }())
  },
  // }}}
  // views {{{
  /**
   * Manages the view count of an article
   *
   * @param {HTTP} request
   * @param {HTTP} response
   * @param {HTTP} next
   */
  views: function (request, response, next) {
    /** We get the user's remote address (ip) */
    let remoteAddress = request.connection.remoteAddress

    /**
     * Get the current article's info
     *
     * @async
     * @returns {Promise} Promise containing the article's info
     * @see Mongoose
     */
    async function getArticle (url) {
      return Article
        .findOne({ url: url })
        .exec()
    }

    /**
     * Update the view amount for the current article
     *
     * @async
     * @param {Object} article Object containing all information of the current article
     * @returns {Promise} Promise containing the current article's update function
     * @see Mongoose
     */
    async function updateViews (article) {
      /** If the views object inside the article doesn't have the user's remote address */
      if (!article.views.ip.includes(remoteAddress)) {
        /** We push the new remote address, while updating the views object */
        return {
          ip: article.views.ip.push(remoteAddress)
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
        /** We get the URL provided by the user */
        let url = request.params.url

        /** We get the article matching the uRL */
        let article = await getArticle(url)

        /** We then see if we update the article's views object */
        let updatedViews = await updateViews(article)

        /** This is to be tested; might cause issues */
        /** If the views object has been updated, we update the article */
        if (updatedViews.length > 0) Article.update({ _id: article._id }, { $set: { views: updatedViews } })

        next()
      } catch (error) {
        console.log(error)
      }
    }())
  },
  // }}}
  // archivePageCheck {{{
  /**
   * Ensure that the user doesn't go to a page that does not exist, at the archive
   *
   * @param {HTTP} request
   * @param {HTTP} response
   * @param {HTTP} next
   */
  archivePageCheck: function (request, response, next) {
    /**
     * Get the total amount of existing article
     *
     * @async
     * @returns {Promise} Promise containing the total count of article
     * @see Mongoose
     */
    async function getAmount () {
      return Article.count({}).exec()
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
         * If the page given by the user is superior to one
         * We set it as it's one value; else, we set it to 1
         * Thus avoiding the access to a page 0, and empty page value
         */
        let page = (request.params.page > 1) ? request.params.page : 1

        /** We get the Promise's awaited value containing the total amount of existing article */
        let amount = await getAmount()

        /** To get the maximum number of page, we divide the total amount by the chosen item per page */
        let maxPage = Math.ceil(amount / archiveItemPerPage)

        /**
         * If the current page is inferior or equal to the last page, we can pass
         * Thus avoiding access to a non existing page
         */
        if (page <= maxPage) {
          next()
        } else {
          response.redirect('/archive')
        }
      } catch (error) {
        console.log(error)
      }
    }())
  }
  // }}}
}
