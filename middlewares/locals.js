/** Middleware - locals */

/** Importing configuration */
import {previewStringLength} from '../config/blog'

/** Importing models */
// import Article from '../models/article'

/** Importing modules */
// import assert from 'assert'
import marked from 'marked'
import nl2br from 'nl2br'
import escapeHtml from 'escape-html'
import moment from 'moment'

/** Parse Object
  * Functions to parse various part of the website
  */
const parse = {
  article: {
    created: date => {
      return moment(date).format('MMMM Do YYYY, h:mm:ss a')
    },
    created2: date => {
      return moment(date).format('MM/DD/YYYY')
    },
    views: amount => {
      let plural = (amount > 1) ? 'clicks' : 'click'
      let text = amount + ' ' + plural

      return text
    }
  }
}

const pagination = {
  /** Handles the links of the pagination */
  links: (page, maxPage) => {
    let pagination = []
    // let currentPage = 1

    /** do {
      pagination.push(currentPage)

      currentPage++
    } while (pagination.length < maxPage) */

    for (var x = 1; x <= 100; x++) {
      pagination.push(x)
    }

    return pagination
  }
}

module.exports = {
  set: (request, response, next) => {
    response.locals = {
      success: request.flash('success'),
      error: request.flash('error'),
      previewStringLength: previewStringLength,
      marked: marked,
      env: process.env.NODE_ENV,
      nl2br: nl2br,
      escapeHtml: escapeHtml,
      parse: parse,
      pagination: pagination,
      preview: content => {
        if (content.length > previewStringLength) {
          return content.substring(0, previewStringLength) + '...'
        } else {
          return content
        }
      }
    }

    next()
  }
}
