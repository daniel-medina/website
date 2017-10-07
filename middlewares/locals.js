/**
 * Locals Middleware
 * Defines locals that can be used anywhere on the website
 *
 * @author Daniel Medina
 * Date: 07/30/2017
 */

/** Configs imports */
import {
  previewStringLength,
  archivePageDisplayAmount
} from '../config/blog'

/** Modules imports */
import marked from 'marked'
import nl2br from 'nl2br'
import escapeHtml from 'escape-html'
import moment from 'moment'

/** Models imports */

/** Libs imports */

const parse = {
  article: {
    // created {{{
    /**
     * Parse the 'created' date of an article
     *
     * @param {Date} date - The raw date of the article
     * @returns {Date} Formated date with moment.js
     */
    created: date => moment(date).format('MMMM Do YYYY, h:mm a'),
    // }}}
    // created2 {{{
    /**
     * Parse the 'created' date of an article - alternative format
     *
     * @param {Date} date - The raw date of the article
     * @returns {Date} Formated date with moment.js
     */
    created2: date => moment(date).format('MM/DD/YYYY'),
    // }}}
    // views {{{
    /**
     * Parse the 'view' element of an article
     *
     * @param {Number} amount - Amount of views
     * @returns {String} String containing the amount of views to display, plural or not
     */
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
  /**
   * Generate a shorten pagination's links as an array
   *
   * @param {Number} amount Amount of items
   * @param {Number} page Current page
   * @param {Number} maxPage Latest page
   * @param {Number} itemPerPage Amount of wanted item per page
   * @returns {Promise} So it can be used in an asynchronous code
   */
  links: (amount, page, maxPage, itemPerPage) => {
    /**
     * Generate an array filled with pages from 1 to maxPage
     *
     * @returns {Array} Pagination to be used to slice in three parts
     */
    async function getPagination () {
      let pagination = []

      for (var currentPage = 1; currentPage <= maxPage; currentPage++) {
        pagination.push(currentPage)
      }

      return pagination
    }

    /**
     * Get the first part of the links
     *
     * @param {Array} pagination - Need to manipulate the original pagination array
     * @returns {Array} Sliced pagination's array
     */
    async function getPart1 (pagination) {
      return pagination.slice(0, archivePageDisplayAmount)
    }

    /**
     * Get the second part of the links
     *
     * @param {Array} pagination - Need to manipulate the original pagination array
     * @returns {Array} Sliced pagination's array
     */
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

    /**
     * Get the third part of the links
     *
     * @param {Array} pagination - Need to manipulate the original pagination array
     * @returns {Array} Sliced pagination's array
     */
    async function getPart3 (pagination) {
      return pagination.slice(pagination.length - archivePageDisplayAmount, pagination.length)
    }

    /**
     * Merge all parts of the pagination links
     *
     * @returns {Array} Array containing the three merged parts
     */
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

    /** Returns the final merged array as a Promise */
    return mergeParts()
  }
  // }}}
}

module.exports = {
  set: (request, response, next) => {
    response.locals = {
      success: request.flash('success'),
      error: request.flash('error'),
      session: request.session,
      path: request.path,
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
