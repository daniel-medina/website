/** Importing configurations */
import {url} from '../config/database'

/** Importing Mongoose */
import mongoose from 'mongoose'

/** Connection to the MongoDB database */
const connection = mongoose.createConnection(url)

/** Setting up ES6's promise */
mongoose.Promise = global.Promise

/** Setting up the Schema variable */
const Schema = mongoose.Schema

/** Defining the collection's schema */
const AdminSchema = new Schema({
  created: Date,
  username: String,
  password: String
}, {
  collection: 'admin'
})

/** Exporting the schema, to make it usable */
module.exports = connection.model('Admin', AdminSchema)
