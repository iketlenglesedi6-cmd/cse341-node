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
  ],
  paths: {
    '/contacts': {
      get: {
        summary: 'Get all contacts',
        responses: {
          200: { description: 'A list of contacts' }
        }
      },
      post: {
        summary: 'Create a new contact',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['firstName', 'lastName', 'email', 'favoriteColor', 'birthday'],
                properties: {
                  firstName: { type: 'string' },
                  lastName: { type: 'string' },
                  email: { type: 'string' },
                  favoriteColor: { type: 'string' },
                  birthday: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Contact created' }
        }
      }
    },
    '/contacts/{id}': {
      get: {
        summary: 'Get a single contact by id',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          200: { description: 'Contact matching the supplied id' }
        }
      },
      put: {
        summary: 'Update a contact by id',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['firstName', 'lastName', 'email', 'favoriteColor', 'birthday'],
                properties: {
                  firstName: { type: 'string' },
                  lastName: { type: 'string' },
                  email: { type: 'string' },
                  favoriteColor: { type: 'string' },
                  birthday: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          204: { description: 'Contact updated' }
        }
      },
      delete: {
        summary: 'Delete a contact by id',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          204: { description: 'Contact deleted' }
        }
      }
    }
  }
}

const swaggerOptions = {
  definition: swaggerDefinition,
  apis: []
}

const swaggerSpec = swaggerJSDoc(swaggerOptions)

app.use(express.json())
app.get('/', (request, response) => {
  response.json({ message: 'Contacts API is running' })
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
