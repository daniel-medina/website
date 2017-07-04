/** Importing used NodeJS modules */
import express from 'express'

/** Declaring the router */
const router = express.Router()

/* >>>>>>>>>>>>>>>>>>>> GET <<<<<<<<<<<<<<<<<<<< */
router.get('/', require('./blog/index').get)

router.get('/article', (request, resource) => {
  resource.render('blog/article', {
    title: 'Article'
  })
})

router.get('/archive', (request, resource) => {
  resource.render('blog/archive', {
    title: 'Archive'
  })
})

router.get('/admin', (request, resource) => {
  resource.render('admin/index', {
    title: 'Administration'
  })
})

router.get('/admin/blog', (request, resource) => {
  resource.render('admin/blog', {
    title: 'Blog administration'
  })
})

/** Now exporting the routes */
export default router
