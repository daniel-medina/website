import {url} from '../config/database'

import {ArticleCategorySchema} from './refs/articleCategory'

import mongoose from 'mongoose'

const connection = mongoose.createConnection(url)
mongoose.Promise = global.Promise
const Schema = mongoose.Schema
const ArticleSchema = new Schema({
  created: Date,
  url: String,
  category: { type: Schema.Types.ObjectId, ref: 'ArticleCategory' },
  title: String,
  content: String,
  views: {
    ip: []
  }
}, {
  collection: 'article'
})

connection.model('ArticleCategory', ArticleCategorySchema)

module.exports = connection.model('Article', ArticleSchema)
