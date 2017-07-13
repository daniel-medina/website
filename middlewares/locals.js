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

module.exports = {
  set: (request, response, next) => {
    response.locals = {
      success: request.flash('success'),
      error: request.flash('error'),
      previewStringLength: previewStringLength,
      marked: marked,
      nl2br: nl2br,
      escapeHtml: escapeHtml,
      parse: parse,
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
