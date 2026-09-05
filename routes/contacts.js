const express = require('express')
const { ObjectId } = require('mongodb')
const database = require('../database')

const router = express.Router()

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

module.exports = router
