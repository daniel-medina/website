/** articleCategory belongs to article */

/** Importing configurations */
import {url} from '../../config/database'

/** Importing Mongoose */
import mongoose from 'mongoose'

/** Setting up the Schema variable */
const Schema = mongoose.Schema

/** Connection to the MongoDB database */
const connection = mongoose.createConnection(url)

/** Setting up ES6's promise */
mongoose.Promise = global.Promise

/** Defining the collection's schema */
const ArticleCategorySchema = new Schema({
  title: String
}, {
  collection: 'articleCategory'
})

const ArticleCategory = connection.model('ArticleCategory', ArticleCategorySchema)

/** Exporting the schema and the model
  * This differs from normal models, since both the schema and data must be accessible independently
  * This is to ensure relationship is set up properly inside the parent model
  */
export { ArticleCategorySchema, ArticleCategory }
