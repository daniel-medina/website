/**
 * Project Model
 *
 * @author Daniel Medina
 * Date: 07/31/2017
 */

/** Configs imports */
import {url} from '../config/database'

/** Modules imports */
import mongoose from 'mongoose'

/** Models imports */

const connection = mongoose.createConnection(url)
mongoose.Promise = global.Promise
const Schema = mongoose.Schema
const ProjectSchema = new Schema({
  created: Date,
  title: String,
  description: String,
  frameworks: { type: String, ref: 'framework' },
  languages: { type: String, ref: 'language' },
  images: Array,
  tags: Array,
  url: String,
  visibility: { type: String, enum: ['public', 'private'] }
}, {
  collection: 'project'
})

module.exports = connection.model('Project', ProjectSchema)
