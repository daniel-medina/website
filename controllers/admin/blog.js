/** Admin's blog controller */

/** Importing models */
import Article from '../../models/article'
import {ArticleCategory} from '../../models/refs/articleCategory'

/** Importing modules */
import slug from 'slug'
// import moment from 'moment'

/** Setting slug mode */
slug.defaults.mode = 'rfc3986'

/** Exporting the controller */
module.exports = {
  // getIndex {{{
  getIndex: (request, response) => {
    async function getCategories () {
      return ArticleCategory
        .find({})
        .exec()
    }

    (async function () {
      try {
        let categories = await getCategories()

        response.render('admin/blog/index', {
          title: 'Blog management',
          categories: categories
        })
      } catch (error) {
        console.log(error)
      }
    }())
  },
  // }}}
  // postBlog {{{
  postBlog: (request, response) => {
    async function createArticle () {
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

      return Article.create(query)
    }

    (async function () {
      try {
        let create = await createArticle() // eslint-disable-line

        request.flash('success', 'The article was successfully created.')
        response.redirect('back')
      } catch (error) {
        console.log(error)
      }
    }())
  }
  // }}}
}
