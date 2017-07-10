/** articleCategory belongs to article */

/** Importing Mongoose */
import mongoose from 'mongoose'

/** Setting up the Schema variable */
const Schema = mongoose.Schema

/** Defining the collection's schema */
const ArticleCategorySchema = new Schema({
  title: String
}, {
  collection: 'articleCategory'
})

/** Exporting the schema, to make it usable */
module.exports = ArticleCategorySchema
