/**
 * Language Model
 * Languages used on portfolio's projects
 *
 * @see Portfolio
 * @author Daniel Medina
 * Date: 10/07/2017
 */

/** Configs imports */
import {url} from '../../config/database'

/** Modules imports */
import mongoose from 'mongoose'

/** Models imports */

/** Libs imports */

const Schema = mongoose.Schema
const connection = mongoose.createConnection(url)

mongoose.Promise = global.Promise

const LanguageSchema = new Schema({
  created: Date,
  name: String,
  color: { type: String, enum: ['black', 'grey', 'green', 'red', 'orange', 'pink'] }
}, {
  collection: 'language'
})

const Language = connection.model('Language', LanguageSchema)

export { LanguageSchema, Language }
