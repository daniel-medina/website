/** Middleware - blog */
/** Importing configuration */
import {archiveItemPerPage} from '../config/blog'

/** Importing models */
import Article from '../models/article'

/** Importing modules */
import assert from 'assert'

module.exports = {
  /** Checking for the existence of the article in the database */
  articleExist: (request, response, next) => {
    /** Getting the amount of article relative to the provided url */
    async function getCount () {
      return Article.count({ url: request.params.url })
    }

    /** Executing the code asynchronously */
    (async function () {
      try {
        let count = await getCount()

        if (count === 0) {
        /** If the given url doesn't match one existing article, show a 404 error */
          response.status('404')
            .render('error/404', { title: 'ERROR' })
        } else {
        /** If it exist, we go to the next route */
          next()
        }
      } catch (error) {
        console.log(error)
      }
    }())
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
  },
  /** Check if we aren't in an inexisting page in the archive */
  archivePageCheck: function (request, response, next) {
    async function getAmount () {
      return Article.count({}).exec()
    }

    /** Executing the controller's content asynchronously */
    (async function () {
      try {
        let page = (request.params.page > 1) ? request.params.page : 1
        let amount = await getAmount()
        let maxPage = Math.ceil(amount / archiveItemPerPage)

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
}
