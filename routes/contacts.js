const express = require('express')
const { ObjectId } = require('mongodb')
const database = require('../database')

const router = express.Router()
const contactFields = ['firstName', 'lastName', 'email', 'favoriteColor', 'birthday']

function validateContact(contact) {
  if (!contact || typeof contact !== 'object') {
    return 'A contact object is required'
  }

  for (const field of contactFields) {
    if (typeof contact[field] !== 'string' || contact[field].trim() === '') {
      return `${field} is required`
    }
  }

  return null
}

async function getContact(request, response) {
  const id = request.params.id || request.query.id

  if (!id || !ObjectId.isValid(id)) {
    return response.status(400).json({ error: 'A valid contact id is required' })
  }

  try {
    const contact = await database.getDb().collection('contacts').findOne({ _id: new ObjectId(id) })

    if (!contact) {
      return response.status(404).json({ error: 'Contact not found' })
    }

    response.status(200).json(contact)
  } catch (error) {
    console.error(error)
    response.status(500).json({ error: 'Unable to retrieve contact' })
  }
}

router.get('/', async (request, response) => {
  if (request.query.id) {
    return getContact(request, response)
  }

  try {
    const contacts = await database.getDb().collection('contacts').find().toArray()
    response.status(200).json(contacts)
  } catch (error) {
    console.error(error)
    response.status(500).json({ error: 'Unable to retrieve contacts' })
  }
})

router.get('/:id', getContact)

router.post('/', async (request, response) => {
  const error = validateContact(request.body)

  if (error) {
    return response.status(400).json({ error })
  }

  try {
    const result = await database.getDb().collection('contacts').insertOne(request.body)
    response.status(201).json({ id: result.insertedId.toString() })
  } catch (error) {
    console.error(error)
    response.status(500).json({ error: 'Unable to create contact' })
  }
})

router.put('/:id', async (request, response) => {
  const id = request.params.id

  if (!id || !ObjectId.isValid(id)) {
    return response.status(400).json({ error: 'A valid contact id is required' })
  }

  const error = validateContact(request.body)

  if (error) {
    return response.status(400).json({ error })
  }

  try {
    const collection = database.getDb().collection('contacts')
    const existingContact = await collection.findOne({ _id: new ObjectId(id) })

    if (!existingContact) {
      return response.status(404).json({ error: 'Contact not found' })
    }

    await collection.replaceOne({ _id: new ObjectId(id) }, request.body)
    return response.sendStatus(204)
  } catch (error) {
    console.error(error)
    response.status(500).json({ error: 'Unable to update contact' })
  }
})

router.delete('/:id', async (request, response) => {
  const id = request.params.id

  if (!id || !ObjectId.isValid(id)) {
    return response.status(400).json({ error: 'A valid contact id is required' })
  }

  try {
    const collection = database.getDb().collection('contacts')
    const result = await collection.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return response.status(404).json({ error: 'Contact not found' })
    }

    return response.sendStatus(204)
  } catch (error) {
    console.error(error)
    response.status(500).json({ error: 'Unable to delete contact' })
  }
})

module.exports = router
