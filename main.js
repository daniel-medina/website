/** Importing configurations */
import {port} from './config/server.js'

/** Importing used NodeJS modules */
import path from 'path'
import express from 'express'
import http from 'http'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import flash from 'connect-flash'
import session from 'express-session'

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

/** Applying stuff to the website
  * Including setting up pug view engine */
app.set('view engine', 'pug')
app.use(bodyParser())
app.use(cookieParser())
app.use(session({
  secret: '(...) ? ... : ...',
  cookie: { maxAge: 60000 },
  resave: false,
  saveUninitialized: false
}))
app.use(flash())

/** Middleware setting up response.locals */
app.use(require('./middlewares/locals.js').set)

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
