/**
 * Portfolio Model
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
const PortfolioSchema = new Schema({
  created: Date,
  url: String,
  title: String,
  description: String,
  images: Array,
  tags: Array
}, {
  collection: 'portfolio'
})

module.exports = connection.model('Portfolio', PortfolioSchema)
