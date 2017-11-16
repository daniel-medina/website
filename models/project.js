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
import { FrameworkSchema } from './refs/framework'
import { LanguageSchema } from './refs/language'

const connection = mongoose.createConnection(url)
mongoose.Promise = global.Promise
const Schema = mongoose.Schema
const ProjectSchema = new Schema({
  created: Date,
  title: String,
  description: String,
  frameworks: [{ type: String, ref: 'Framework' }],
  languages: [{ type: String, ref: 'Language' }],
  images: Array,
  tags: Array,
  url: String,
  visibility: { type: String, enum: ['public', 'private'] }
}, {
  collection: 'project'
})

connection.model('Framework', FrameworkSchema)
connection.model('Language', LanguageSchema)

module.exports = connection.model('Project', ProjectSchema)
