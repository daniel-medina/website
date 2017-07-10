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
    let query = {
      limit: 4,
      sort: {
        _id: -1
      }
    }

    Article.find().limit(query.limit).sort(query.sort).exec((error, item) => {
      assert.equal(null, error)

      response.render('blog/index', {
        title: 'Blog',
        articles: item,
        marked: marked
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
          title: 'Blog - ' + item.title,
          article: item
        })
      })
  }
}
