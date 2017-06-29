/** Importing configurations */
import {port} from './config/server.js'

/** Importing used NodeJS modules */
import path from 'path'
import express from 'express'
import http from 'http'
// import session from 'express-session'

/** Importing routes */
import router from './routes/index.js'

/** Declaring server variables */
const app = express()
const server = http.createServer(app)

/** Setting up the app :
  * >> Defining the public path
  * >> Using the routes defined in another file
  * >> Defining the view engine as Pug
  * >> Setting fonts public folders
  * >> Handling HTTP errors
  */
app.set('view engine', 'pug')
app.use(express.static(path.join(__dirname, 'public')))
app.use('/', router)
app.use('/font-awesome', express.static('./node_modules/font-awesome/css'))
app.use('/fonts', express.static('./node_modules/font-awesome/fonts'))

/** HTTP ERROR 404 */
app.use((request, resource, next) => {
  resource.status(404)
  resource.render('error/404', { title: 'ERROR' })
})

server.listen(port)
