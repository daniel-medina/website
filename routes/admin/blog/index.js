/** Importing configurations */
import {client, url} from '../../config/database'

/** Importing used NodeJS modules */
import assert from 'assert'

/** Exporting the route */
export const AdminBlogIndexGet = (request, resource) => {
  client.connect(url, (error, db) => {
    assert.equal(null, error)
  })
}
