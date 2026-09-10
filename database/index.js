const { MongoClient } = require('mongodb')

let database

async function initDb() {
  if (database) {
    return database
  }

  if (!process.env.MONGODB_URI || !process.env.MONGODB_DATABASE) {
    throw new Error('MONGODB_URI and MONGODB_DATABASE must be set')
  }

  const client = new MongoClient(process.env.MONGODB_URI, {
    tls: true,
    serverSelectionTimeoutMS: 30000
  })
  await client.connect()
  database = client.db(process.env.MONGODB_DATABASE)
  console.log('Connected to MongoDB')
  return database
}

function getDb() {
  if (!database) {
    throw new Error('The database has not been initialized')
  }
  return database
}

module.exports = { initDb, getDb }
