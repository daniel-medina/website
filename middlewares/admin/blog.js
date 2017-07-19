/** Middleware - admin */

import Article from '../../models/article'
import {ArticleCategory} from '../../models/refs/articleCategory'

import slug from 'slug'

/** Setting slug mode */
slug.defaults.mode = 'rfc3986'

module.exports = {
  // postArticle {{{
  postArticle: (request, response, next) => {
    let title = request.body.title

    if (title.length > 5) {
      next()
    } else {
      request.flash('error', 'The title\'s length isn\'t long enough.')
      response.redirect('back')
    }
  },
  // }}}
  // articleCategoryExist {{{
  articleCategoryExist: (request, response, next) => {
    async function countCategory (category) {
      return ArticleCategory.count({ _id: category }).exec()
    }

    (async function () {
      try {
        let category = request.body.category
        let count = await countCategory(category)

        if (count !== 0) {
          next()
        } else {
          request.flash('error', 'The selected category doesn\'t exist.')
          response.redirect('back')
        }
      } catch (error) {
        console.log(error)
      }
    }())
  },
  // }}}
  // articleTitleExist {{{
  articleTitleExist: (request, response, next) => {
    async function countArticle (url) {
      return Article.count({ url: url }).exec()
    }

    (async function () {
      try {
        let url = slug(request.body.title)
        let count = await countArticle(url)

        if (count === 0) {
          next()
        } else {
          request.flash('error', 'The article\'s title already exist in the database.')
          response.redirect('back')
        }
      } catch (error) {
        console.log(error)
      }
    }())
  }
  // }}}
}
