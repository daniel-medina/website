/** Importing configurations */
import {url} from '../config/database'

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
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
  title: String,
  content: String,
  views: {
    ip: []
  }
}, {
  collection: 'article'
})

/** Exporting the schema, to make it usable */
module.exports = connection.model('Article', ArticleSchema)
