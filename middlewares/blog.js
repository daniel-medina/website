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

/** GET */
export const get = {
  // Middleware: articleExist {{{
  /**
   * Checks if the article do exist
   *
   * @async
   * @param {HTTP} request
   * @param {HTTP} response
   * @param {HTTP} next
   */
  articleExist: async (request, response, next) => {
    try {
      // Function: getCount {{{
      /**
       * Gets the amount of article matching the given URL
       *
       * @param {String} url Url given by the user
       * @returns {Promise} Promise containg the amount of article
       * @see Mongoose
       */
      const getCount = url => Article.count({ url: url }).exec()
      // }}}

      /** We get the article's URL given by the user */
      const url = request.params.url

      /** We get the number of article matching the URL */
      const count = await getCount(url)

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
  },
  // }}}
  // Middleware: views {{{
  /**
   * Manages the view count of an article
   *
   * @async
   * @param {HTTP} request
   * @param {HTTP} response
   * @param {HTTP} next
   */
  views: async (request, response, next) => {
    try {
      /** We get the user's remote address (ip) */
      const remoteAddress = request.connection.remoteAddress

      // Function: getArticle {{{
      /**
       * Get the current article's info
       *
       * @returns {Promise} Promise containing the article's info
       * @see Mongoose
       */
      const getArticle = url => {
        return Article
          .findOne({ url: url })
          .exec()
      }
      // }}}
      // Function: updateViews {{{
      /**
       * Update the view amount for the current article
       *
       * @param {Object} article Object containing all information of the current article
       * @returns {Promise} Promise containing the current article's update function
       * @see Mongoose
       */
      const updateViews = article => {
      /** If the views object inside the article doesn't have the user's remote address */
        if (!article.views.ip.includes(remoteAddress)) {
        /** We push the new remote address, while updating the views object */
          article.views.ip.push(remoteAddress)
        }

        /** We return the views array, whether an ip has been pushed inside or not */
        return {
          ip: article.views.ip
        }
      }
      // }}}
      // Function: updateArticle {{{
      /**
       * Update the current article with the new view array
       *
       * @param {ObjectID} id ObjectID of the article to update
       * @param {Array} view Updated view array
       * @returns {Promise} Promise containing the update query
       * @see Mongoose
       */
      const updateArticle = (id, view) => {
        const query = {
          _id: id
        }
        const update = {
          views: view
        }

        return Article.findOneAndUpdate(query, update)
      }
      // }}}

      /** We get the URL provided by the user */
      const url = request.params.url

      /** We get the article matching the uRL */
      const article = await getArticle(url)

      /** We then see if we update the article's views object */
      const updatedViews = await updateViews(article)

      /** This is to be tested; might cause issues */
      /** If the views object has been updated, we update the article */
      if (updatedViews.ip.length > 0) {
        await updateArticle(article.id, updatedViews)
      }

      next()
    } catch (error) {
      console.log(error)
    }
  },
  // }}}
  // Middleware: archivePageCheck {{{
  /**
   * Ensure that the user doesn't go to a page that does not exist, at the archive
   *
   * @async
   * @param {HTTP} request
   * @param {HTTP} response
   * @param {HTTP} next
   */
  archivePageCheck: async (request, response, next) => {
    try {
      // Function: getAmount {{{
      /**
       * Get the total amount of existing article
       *
       * @returns {Promise} Promise containing the total count of article
       * @see Mongoose
       */
      const getAmount = () => {
        return Article.count({}).exec()
      }
      // }}}

      /**
       * If the page given by the user is superior to one
       * We set it as it's one value; else, we set it to 1
       * Thus avoiding the access to a page 0, and empty page value
       */
      const page = (request.params.page > 1) ? request.params.page : 1

      /** We get the Promise's awaited value containing the total amount of existing article */
      const amount = await getAmount()

      /** To get the maximum number of page, we divide the total amount by the chosen item per page */
      const maxPage = Math.ceil(amount / archiveItemPerPage)

      /**
         * If the current page is inferior or equal to the last page, we can pass
         * Thus avoiding access to a non existing page
         */
      if (page <= maxPage && maxPage > 1) {
        next()
      } else {
        response.redirect('/')
      }
    } catch (error) {
      console.log(error)
    }
  }
  // }}}
}
