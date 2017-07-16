/** Middleware - locals */

/** Importing configuration */
import {
  previewStringLength,
  archivePageDisplayAmount
} from '../config/blog'

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
  links: (amount, page, maxPage, itemPerPage) => {
    async function getPagination () {
      let pagination = []

      for (var currentPage = 1; currentPage <= maxPage; currentPage++) {
        pagination.push(currentPage)
      }

      return pagination
    }

    async function getPart1 (pagination) {
      return pagination.slice(0, archivePageDisplayAmount)
    }

    async function getPart2 (pagination) {
      let part1 = await getPart1(pagination)

      if (page > 1) {
      /** If the next page is inferior or equal to the latest item of part1
        * Then part2 will be equal to part1
        * Thus avoiding having a part1 smaller than it's supposed size as we navigate */
        if (page + 1 <= part1[part1.length - 1]) {
          return part1
        } else {
        /** Page minus 2 is equal to the current page's index minus one */
          return pagination.slice(page - 2, page + 1)
        }
      } else {
      /** If the size of part1 is not long enough, we increase it
        * It can happen if the chosen displayAmount value is too small */
        let length = (part1.length < 2) ? part1.length + 1 : part1.length

        return pagination.slice(0, length)
      }
    }

    async function getPart3 (pagination) {
      return pagination.slice(pagination.length - archivePageDisplayAmount, pagination.length)
    }

    async function mergeParts () {
      let pagination = await getPagination()
      let part1 = await getPart1(pagination)
      let part2 = await getPart2(pagination)
      let part3 = await getPart3(pagination)
      let merge = []

      /** We inject the first part if it's lesser than the first element of part2 */
      for (var x in part1) {
        if (part1[x] < part2[0]) {
          merge.push(part1[x])
        }
      }

      /** We insert the separation if the next element to the last element of part 1
      * is inferior to the first element of part2 */
      if (part1[part1.length - 1] + 1 < part2[0]) {
        merge.push('...')
      }

      /** We insert the second part to the merge array */
      for (var y in part2) {
      /** If the current element is inferior to the first element of part3, we push */
        if (part2[y] < part3[0]) {
          merge.push(part2[y])
        }
      }

      /** We insert the second separation if the element next to the last element of part2
      * is inferior to the first element of part3 */
      if (part2[part2.length - 1] + 1 < part3[0]) {
        merge.push('...')
      }

      /** We insert the last part to the merge array */
      for (var z in part3) {
        merge.push(part3[z])
      }

      /** Now we return the final merged array */
      return merge
    }

    /** We now return the asynchronous function; to be awaited */
    return mergeParts()
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
