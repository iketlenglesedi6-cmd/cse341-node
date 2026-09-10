require('dotenv').config()

const express = require('express')
const swaggerUi = require('swagger-ui-express')
const swaggerJSDoc = require('swagger-jsdoc')
const contactsRouter = require('./routes/contacts')
const database = require('./database')

const app = express()
const port = process.env.PORT || 3000

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Contacts API',
    version: '1.0.0',
    description: 'A CRUD API for managing a contacts collection in MongoDB.'
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local development server'
    },
    {
      url: 'https://cse341-node-au0q.onrender.com',
      description: 'Production Render server'
    }
  ]
}

const swaggerOptions = {
  definition: swaggerDefinition,
  apis: ['./routes/contacts.js']
}

const swaggerSpec = swaggerJSDoc(swaggerOptions)

app.use(express.json())
app.get('/', (request, response) => {
  response.json({ message: 'Contacts API is running. Visit /api-docs for documentation.' })
})
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
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
