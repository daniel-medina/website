/** Middleware - locals */

import {
  previewStringLength,
  archivePageDisplayAmount
} from '../config/blog'

import marked from 'marked'
import nl2br from 'nl2br'
import escapeHtml from 'escape-html'
import moment from 'moment'

const parse = {
  article: {
    // created {{{
    created: date => {
      return moment(date).format('MMMM Do YYYY, h:mm:ss a')
    },
    // }}}
    // created2 {{{
    created2: date => {
      return moment(date).format('MM/DD/YYYY')
    },
    // }}}
    // views {{{
    views: amount => {
      let plural = (amount > 1) ? 'views' : 'view'
      let text = amount + ' ' + plural

      return text
    }
    // }}}
  }
}

const pagination = {
  // links {{{
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
        /**
          * If there is no need for a second part
          * The second part will be equal to the first part
          */
        if (page + 1 <= part1[part1.length - 1]) {
          return part1
        } else {
          return pagination.slice(page - 2, page + 1)
        }
      } else {
        /**
          * If the size of the first part is not long enough, we increase it
          * It can happen if the chosen displayAmount value is too small
          */
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

      /** We inject the first part only if it's inferior to the first element of part 2 */
      for (var x in part1) {
        if (part1[x] < part2[0]) {
          merge.push(part1[x])
        }
      }

      /** First separation; if part 1 & part 2 are not close to each other */
      if (part1[part1.length - 1] + 1 < part2[0]) {
        merge.push('...')
      }

      for (var y in part2) {
      /** If the current element is inferior to the first element of part3, we push */
        if (part2[y] < part3[0]) {
          merge.push(part2[y])
        }
      }

      /** Second separation; if part 2 & part 3 are not close to each other */
      if (part2[part2.length - 1] + 1 < part3[0]) {
        merge.push('...')
      }

      for (var z in part3) {
        merge.push(part3[z])
      }

      return merge
    }

    /** Returns a Promise */
    return mergeParts()
  }
  // }}}
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
