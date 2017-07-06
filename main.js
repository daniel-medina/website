/** Importing configurations */
import {port} from './config/server.js'
import {previewStringLength} from './config/blog'

/** Importing used NodeJS modules */
import path from 'path'
import express from 'express'
import http from 'http'
import bodyParser from 'body-parser'
import marked from 'marked'
import nl2br from 'nl2br'
import escapeHtml from 'escape-html'
// import session from 'express-session'

/** Importing routes */
import router from './routes/index'

/** Declaring server variables */
const app = express()
const server = http.createServer(app)

/** Setting up the app :
  * >> Defining the public path
  * >> Using the routes defined in another file
  * >> Defining the view engine as Pug
  * >> Setting fonts public folders
  * >> Handling HTTP errors
  * >> Defining global variables/functions for views
  */

/** Middleware to set response locals
  * Its purpose is to define global variables/functions
  */
app.use((request, response, next) => {
  response.locals = {
    previewStringLength: previewStringLength,
    marked: marked,
    nl2br: nl2br,
    escapeHtml: escapeHtml,
    preview: content => {
      if (content.length > previewStringLength) {
        return content.substring(0, previewStringLength) + '...'
      } else {
        return content
      }
    }
  }

  next()
})

/** Applying stuff to the website
  * Including setting up pug view engine */
app.set('view engine', 'pug')
app.use(bodyParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use('/', router)
app.use('/font-awesome', express.static('./node_modules/font-awesome/css'))
app.use('/fonts', express.static('./node_modules/font-awesome/fonts'))

/** HTTP ERROR 404 */
app.use((request, response, next) => {
  response.status(404)
  response.render('error/404', { title: 'ERROR' })
})

server.listen(port)
