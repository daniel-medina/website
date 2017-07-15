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
    let merge = []
    let part1 = []
    let part2 = []
    let part3 = []
    let displayAmount = 5

    for (var currentPage = 1; currentPage <= maxPage; currentPage++) {
      pagination.push(currentPage)
    }

    /** After the array is filled, we slice it */
    let slice1 = page + 1
    let slice2 = pagination.length - displayAmount

    /** If the current page is superior to displayAmount, we show only one page
      * Else, if the current page is outside the first slice */
    part1 = pagination.slice(0, displayAmount)

    /** if the current page minus displayAmount is superior to 0,
      * we slice it normally; else we only grab from the beginning of the array
      */
    if (page > 1) {
      /** page - 2 is equal to the index converted page minus 1 */
      part2 = pagination.slice(page - 2, slice1)
    } else {
      /** If the size of part1 is not long enough, we increase it
        * It can happen if the chosen displayAmount value is too small */
      let length = (part1.length < 2) ? part1.length + 1 : part1.length

      part2 = pagination.slice(0, length)
    }

    /** The last part needs no modification */
    part3 = pagination.slice(slice2, pagination.length)

    // merge.push(part1)
    // merge.push(part2)
    // merge.push(part3)

    for (var x in part1) {
      if (part1[x] < part2[0]) {
        merge.push(part1[x])
      }
    }

    /** We insert the separation if it has to */
    if (part1[part1.length - 1] + 1 < part2[0]) {
      merge.push('...')
    }

    /** We now inject the sliced parts to the merge array */
    for (var y in part2) {
      /** If the current item plus 1 is inferior to the first item of the second part
        * And if there is less item than the chosen displayAmount value, we push */
      if (part2[y] < part3[0]) {
        merge.push(part2[y])
      }
    }

    /** If the actual page plus displayAmount is inferior to the first index of part2 minus one (to avoid unnecessary repetitions), we can insert a separation
      * The minus 1 is necessary to `convert` the length of the array to an index */
    if (part2[part2.length - 1] + 1 < part3[0]) {
      merge.push('...')
    }

    /** We inject the second sliced part to the merge array */
    for (var z in part3) {
      merge.push(part3[z])
    }

    /** Now we return the final merged array */
    return merge
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
