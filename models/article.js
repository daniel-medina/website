/** Importing configurations */
import {url} from '../config/database'

/** Importing refs */
import ArticleCategorySchema from './refs/articleCategory'

/** Importing Mongoose */
import mongoose from 'mongoose'

/** Connection to the MongoDB database */
const connection = mongoose.createConnection(url)

/** Setting up the Schema variable */
const Schema = mongoose.Schema

/** Defining the collection's schema */
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

/** Registering ref's schemas */
connection.model('ArticleCategory', ArticleCategorySchema)

/** Exporting the schema, to make it usable */
module.exports = connection.model('Article', ArticleSchema)
