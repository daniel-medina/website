/** Importing configurations */
import {client, url} from '../config/database.js'

/** Importing used NodeJS modules */
import assert from 'assert'
import express from 'express'

/** Declaring the router */
const router = express.Router()

/* >>>>>>>>>>>>>>>>>>>> GET <<<<<<<<<<<<<<<<<<<< */

/** Index - url : '/' */
router.get('/', (request, resource) => {
  client.connect(url, (error, database) => {
    assert.equal(null, error)

    console.log('Successfully connected to the database.')
    database.close()
  })

  resource.render('blog/index', {
    title: 'Blog'
  })
})

/** Article - url : '/article' */
router.get('/article', (request, resource) => {
  resource.render('blog/article', {
    title: 'Article'
  })
})

/** Archive - url : '/archive' */
router.get('/archive', (request, resource) => {
  resource.render('blog/archive', {
    title: 'Archive'
  })
})

/** Administration - url : '/admin' */
router.get('/admin', (request, resource) => {
  resource.render('admin/index', {
    title: 'Administration'
  })
})

/** Blog administration - url : '/admin/blog' */
router.get('/admin/blog', (request, resource) => {
  resource.render('admin/blog', {
    title: 'Blog administration'
  })
})

/** Now exporting the routes */
export default router
