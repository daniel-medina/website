/** Blog controller */

/** Imports goes here */
import {archiveItemPerPage} from '../config/blog'
import Article from '../models/article'
import marked from 'marked'

module.exports = {
  // getIndex {{{
  getIndex: (request, response) => {
    let limit = 2
    let sort = {
      _id: -1
    }

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
  getArticle: (request, response) => {
    async function getArticle () {
      let url = request.params.url

      return Article
        .findOne({ url: url })
        .populate('category', 'title')
        .exec()
    }

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
  getArchive: (request, response) => {
    async function getAmount () {
      return Article
        .count({})
        .exec()
    }

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
