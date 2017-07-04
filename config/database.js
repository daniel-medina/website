/** Importing used NodeJS modules */
import mongodb from 'mongodb'

/** Exporting database configuration */
export const client = mongodb.MongoClient
export const url = 'mongodb://localhost/website'
