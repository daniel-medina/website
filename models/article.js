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
  url: String,
  title: String,
  content: String
}, {
  collection: 'article'
})

/** Exporting the schema, to make it usable */
module.exports = connection.model('Article', ArticleSchema)
