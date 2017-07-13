/** Blog controller */

/** Importing models */
import Article from '../../models/article'
import {ArticleCategory} from '../../models/refs/articleCategory'

/** Importing modules */
import slug from 'slug'
import assert from 'assert'
// import moment from 'moment'

/** Setting slug mode */
slug.defaults.mode = 'rfc3986'

/** Exporting the controller */
module.exports = {
  /** HTTP REQUEST - GET */
  /** ------------------ */
  getIndex: (request, response) => {
    response.render('admin/index', {
      title: 'Administration'
    })
  },
  getBlog: (request, response) => {
    /** We load the categories to be selected at the creation of an article */
    ArticleCategory
      .find({})
      .sort({})
      .exec((error, categories) => {
        assert.equal(null, error)

        response.render('admin/blog/index', {
          title: 'Administration - Blog',
          categories: categories
        })
      })
  },
  /** HTTP REQUEST - POST */
  /** ------------------- */
  postBlog: (request, response) => {
    /** Getting request's sent post variables */
    let created = new Date()
    let title = request.body.title
    let url = slug(title)
    let category = request.body.category
    let content = request.body.content
    let query = {
      created: created,
      url: url,
      category: category,
      title: title,
      content: content
    }

    Article.create(query, (error, result) => {
      assert.equal(null, error)

      request.flash('success', 'The article was successfully created.')
      response.redirect('back')
    })
  }
}
