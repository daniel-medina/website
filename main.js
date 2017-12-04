/** Importing polyfill for babel */
import 'babel-polyfill'

/** Importing configurations */
import {port} from './config/server'

/** Importing used NodeJS modules */
import path from 'path'
import express from 'express'
import session from 'express-session'
import http from 'http'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import busboy from 'busboy-body-parser'
import flash from 'connect-flash'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import WebpackDashboard from 'webpack-dashboard/plugin'

/** Importing webpack configs */
import webpackConfig from './config/webpack.dev.config.js'

/** Importing routes */
import router from './routes/index'

/** Declaring server variables */
const app = express()
const MemoryStore = require('memorystore')(session)
const server = http.createServer(app)
const compiler = webpack(webpackConfig)

/** Getting the NODE_ENV variable */
const env = process.env.NODE_ENV

/**
 * Setting up the app :
 * >> Defining the public path
 * >> Using the routes defined in another file
 * >> Defining the view engine as Pug
 * >> Setting fonts public folders
 * >> Handling HTTP errors
 * >> Defining global variables/functions for views
 * >> Webpack dev server initialization
 */

/** Applying the webpack dev server - if in development environment */
if (env === 'development') {
  compiler.apply(new WebpackDashboard())

  /** Applying webpack dev server for watching file's modifications */
  app.use(webpackDevMiddleware(compiler, {
    noIntro: true,
    publicPath: webpackConfig.output.publicPath,
    stats: { colors: true }
  }))

  /** Applying hot reload module's middleware */
  app.use(webpackHotMiddleware(compiler))
}

/**
 * Applying stuff to the website
 * Including setting up pug view engine
 */
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))
app.use(cookieParser())
app.use(busboy())
app.use(bodyParser())

/** Session store method MUST be changed for production use */
app.use(session({
  secret: 'e6YoQ9RiQ9WzrNBoPVniT653FG7fHvMK8gyHXmJ4kxUegEz3DyjCK5BHog8KNKce',
  store: new MemoryStore({
    checkPeriod: 86400000
  }),
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

/** Decorating the terminal */
if (env === 'development') {
  /** The server listening is only used in development - in production, the vhost handles it */
  server.listen(port)
  console.log('Website is running on development environment.')
  console.log('Listening to port ' + port + '.')
}

exports.app = app
