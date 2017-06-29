/** Copyright 2017 (c) Daniel Medina - All rights reserved */

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
  client.connect(url, (error, connection) => {
    assert.equal(null, error)

    console.log('Successfully connected to the database.')
    connection.close()
  })

  resource.render('blog/index', {
    title: 'Blog'
  })
})

/** Now exporting the routes */
export default router
