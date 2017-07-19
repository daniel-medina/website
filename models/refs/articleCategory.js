/** articleCategory belongs to article */

import {url} from '../../config/database'

import mongoose from 'mongoose'

const Schema = mongoose.Schema
const connection = mongoose.createConnection(url)
mongoose.Promise = global.Promise
const ArticleCategorySchema = new Schema({
  title: String
}, {
  collection: 'articleCategory'
})
const ArticleCategory = connection.model('ArticleCategory', ArticleCategorySchema)

export { ArticleCategorySchema, ArticleCategory }
