/** Middleware - admin - blog */

/** Importing models */
import Article from '../../models/article'

/** Importing model's children */
import {ArticleCategory} from '../../models/refs/articleCategory'

/** Importing modules */
import assert from 'assert'
import slug from 'slug'

/** Setting slug mode */
slug.defaults.mode = 'rfc3986'

module.exports = {
  /** Verify the form sent by the user for creating an article */
  postArticle: (request, response, next) => {
    // let url = request.body.url
    let title = request.body.title
    // let content = request.body.content

    if (title.length > 5) {
      next()
    } else {
      request.flash('error', 'The title\'s length isn\'t long enough.')
      response.redirect('back')
    }
  },
  /** Checking for the existence of the selected article's category */
  articleCategoryExist: (request, response, next) => {
    let category = request.body.category

    ArticleCategory.count({ _id: category }).exec((error, amount) => {
      assert.equal(null, error)

      if (amount !== 0) {
        next()
      } else {
        request.flash('error', 'The selected category doesn\'t exist.')
        response.redirect('back')
      }
    })
  },
  /** Checking for the existence of the article's title in the database
    * Since article's title are also the url, it has to be unique
    */
  articleTitleExist: (request, response, next) => {
    /** We used the url which is the article's title converted to slug */
    let url = slug(request.body.title)

    Article.count({ url: url }).exec((error, amount) => {
      assert.equal(null, error)

      if (amount === 0) {
        next()
      } else {
        request.flash('error', 'The article\'s title already exist in the database.')
        response.redirect('back')
      }
    })
  }
}
