import {url} from '../config/database'

import mongoose from 'mongoose'

const connection = mongoose.createConnection(url)
mongoose.Promise = global.Promise
const Schema = mongoose.Schema
const AdminSchema = new Schema({
  created: Date,
  username: String,
  password: String
}, {
  collection: 'admin'
})

module.exports = connection.model('Admin', AdminSchema)
