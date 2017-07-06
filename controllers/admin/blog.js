/** Blog controller */

/** Importing models */
import Article from '../../models/article'

/** Importing modules */
import slug from 'slug'
import assert from 'assert'

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
    response.render('admin/blog/index', {
      title: 'Administration - Blog'
    })
  },
  /** HTTP REQUEST - POST */
  /** ------------------- */
  postBlog: (request, response) => {
    /** Getting request's sent post variables */
    let title = request.body.title
    let content = request.body.content
    let query = {
      url: slug(title),
      title: title,
      content: content
    }

    Article.create(query, (error, result) => {
      assert.equal(null, error)

      response.redirect('/admin/blog')
    })
  }
}
