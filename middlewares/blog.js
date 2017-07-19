/** Middleware - blog */

import {archiveItemPerPage} from '../config/blog'

import Article from '../models/article'

// import assert from 'assert'

module.exports = {
  // articleExist {{{
  articleExist: (request, response, next) => {
    async function getCount () {
      return Article.count({ url: request.params.url }).exec()
    }

    (async function () {
      try {
        let count = await getCount()

        if (count === 0) {
          response.status('404')
            .render('error/404', { title: 'ERROR' })
        } else {
          next()
        }
      } catch (error) {
        console.log(error)
      }
    }())
  },
  // }}}
  // views {{{
  views: (request, response, next) => {
    let selfIp = request.connection.remoteAddress

    async function getArticle () {
      let url = request.params.url

      return Article
        .findOne({ url: url })
        .exec()
    }

    async function updateViews (article, views) {
      if (!views.ip.includes(selfIp)) {
        let viewsUpdated = {
          ip: views.ip.push(selfIp)
        }

        return Article.update({ _id: article._id }, { $set: { views: viewsUpdated } })
      }
    }

    (async function () {
      try {
        let article = await getArticle()
        let update = await updateViews(article, article.views) // eslint-disable-line

        next()
      } catch (error) {
        console.log(error)
      }
    }())
  },
  // }}}
  // archivePageCheck {{{
  archivePageCheck: function (request, response, next) {
    async function getAmount () {
      return Article.count({}).exec()
    }

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
  // }}}
}
