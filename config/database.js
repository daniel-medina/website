/** Copyright 2017 (c) Daniel Medina - All rights reserved */

/** Importing used NodeJS modules */
import mongodb from 'mongodb'

/** Exporting database configuration */
export const client = mongodb.MongoClient
export const url = 'mongodb://188.166.16.248:27017/website'
