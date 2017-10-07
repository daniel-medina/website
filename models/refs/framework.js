/**
 * Framework Model
 * Frameworks used on portfolio's projects
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

const FrameworkSchema = new Schema({
  created: Date,
  name: String,
  color: { type: String, enum: ['black', 'grey', 'green', 'red', 'orange', 'pink'] }
}, {
  collection: 'framework'
})

const Framework = connection.model('Framework', FrameworkSchema)

export { FrameworkSchema, Framework }
