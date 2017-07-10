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
  },
  /** Adds views to an article */
  views: (request, response, next) => {
    let url = request.params.url
    let selfIp = request.connection.remoteAddress

    Article.findOne({ url: url }).exec((error, article) => {
      assert.equal(null, error)

      let views = article.views
      /** If the user's ip address doesn't exist inside the article's views array, insert it */
      if (!views.ip.includes(selfIp)) {
        /** We modify the view's object and its ip array */
        let viewsUpdated = {
          ip: views.ip.push(selfIp)
        }

        /** We now update the database with the updated view's array */
        Article.update({ _id: article._id }, { $set: { views: viewsUpdated } }, (error, result) => {
          assert.equal(null, error)
        })
      }
    })

    next()
  }
}
