/** Blog controller */

/** Importing configuration */
import {archiveItemPerPage} from '../config/blog'

/** Importing models */
import Article from '../models/article'

/** Importing modules */
import assert from 'assert'
import marked from 'marked'

/** Exporting the controller */
module.exports = {
  /** HTTP REQUEST - GET */
  /** ------------------ */
  getIndex: (request, response) => {
    let recent = {
      limit: 2,
      sort: {
        _id: -1
      }
    }
    let old = {
      limit: 10,
      sort: recent.sort,
      skip: recent.limit
    }

    /** Fetching recent article's list
      * To be displayed in the main part of the index
      */
    Article
      .find()
      .populate('category', 'title')
      .limit(recent.limit)
      .sort(recent.sort)
      .exec((error, articles) => {
        assert.equal(null, error)

        /** Fetching old article's list */
        Article
          .find()
          .populate('category', 'title')
          .sort(old.sort)
          .skip(old.skip)
          .exec((error, old) => {
            assert.equal(null, error)

            response.render('blog/index', {
              title: 'Blog',
              articles: articles,
              old: old,
              marked: marked
            })
          })
      })
  },
  getArticle: (request, response) => {
    let url = request.params.url

    Article
      .findOne({url: url})
      .populate('category', 'title')
      .exec((error, item) => {
        assert.equal(null, error)

        response.render('blog/article', {
          title: item.title,
          article: item
        })
      })
  },
  getArchive: (request, response) => {
    /** Getting the total amount of article in the database */
    async function getAmount () {
      /** Returning model's Promise execution */
      return Article
        .count({})
        .exec()
    }

    /** Getting the articles from the database */
    async function getArticle (page) {
      /** Getting all required variables for the query */
      let rawSkip = Math.floor(page * archiveItemPerPage)
      let skip = Math.floor(rawSkip - archiveItemPerPage)
      let query = {
        limit: archiveItemPerPage,
        skip: skip,
        sort: {
          _id: -1
        }
      }

      /** Returning model's Promise execution */
      return Article
        .find({})
        .populate('category', 'title')
        .limit(query.limit)
        .sort(query.sort)
        .skip(query.skip)
        .exec()
    }

    /** Executing the controller's content asynchronously */
    (async function () {
      try {
        /* If the current page is superior to 1, we use the url's parameter, else we set it to 1 */
        let page = Number((request.params.page > 1) ? request.params.page : 1)
        let amount = await getAmount()
        let articles = await getArticle(page)
        let maxPage = Math.ceil(amount / archiveItemPerPage)

        response.render('blog/archive', {
          title: 'Archive',
          articles: articles,
          amount: amount,
          page: page,
          maxPage: maxPage
        })
      } catch (error) {
        console.log(error)
      }
    }())
  }
}
