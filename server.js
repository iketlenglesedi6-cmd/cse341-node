require('dotenv').config()

const express = require('express')
const contactsRouter = require('./routes/contacts')
const database = require('./database')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.get('/', (request, response) => {
  response.json({ message: 'Contacts API is running' })
})
app.use('/contacts', contactsRouter)

async function startServer() {
  try {
    await database.initDb()
    app.listen(port, () => {
      console.log(`Contacts API listening on port ${port}`)
    })
  } catch (error) {
    console.error('Unable to start the server:', error.message)
    process.exit(1)
  }
}

startServer()
