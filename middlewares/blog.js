/** Middleware - blog */

/** Importing models */
import Article from '../models/article'

/** Importing modules */
import assert from 'assert'

module.exports = {
  /** Checking for the existence of the article in the database */
  articleExist: (request, response, next) => {
    let url = request.params.url

    Article.count({url: url}, (error, count) => {
      assert.equal(null, error)

      if (count === 0) {
        /** If the given url doesn't match one existing article, show a 404 error */
        response.status('404')
          .render('error/404', { title: 'ERROR' })
      } else {
        /** If it exist, we go to the next route */
        next()
      }
    })
  }
}
