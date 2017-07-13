/** Blog controller */

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
    let query = {
      limit: 10,
      sort: {
        _id: -1
      }
    }

    Article
      .find({})
      .populate('category', 'title')
      .limit(query.limit)
      .sort(query.sort)
      .exec((error, articles) => {
        assert.equal(null, error)

        Article
          .count({})
          .exec((error, amount) => {
            assert.equal(null, error)

            response.render('blog/archive', {
              title: 'Archive',
              articles: articles,
              amount: amount
            })
          })
      })
  }
}
