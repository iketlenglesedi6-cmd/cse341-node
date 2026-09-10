const express = require('express')
const { ObjectId } = require('mongodb')
const database = require('../database')

const router = express.Router()
const contactFields = ['firstName', 'lastName', 'email', 'favoriteColor', 'birthday']

/**
 * @openapi
 * /contacts:
 *   get:
 *     tags: [Contacts]
 *     summary: Get all contacts
 *     responses:
 *       200:
 *         description: A list of contacts
 *   post:
 *     tags: [Contacts]
 *     summary: Create a new contact
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firstName, lastName, email, favoriteColor, birthday]
 *             properties:
 *               firstName: { type: string }
 *               lastName: { type: string }
 *               email: { type: string }
 *               favoriteColor: { type: string }
 *               birthday: { type: string }
 *     responses:
 *       201:
 *         description: Contact created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [id]
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The MongoDB ObjectId of the new contact
 */

/**
 * @openapi
 * /contacts/{id}:
 *   get:
 *     tags: [Contacts]
 *     summary: Get a single contact by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contact matching the supplied id
 *       400:
 *         description: The supplied id is invalid
 *       404:
 *         description: No contact matches the supplied id
 *   put:
 *     tags: [Contacts]
 *     summary: Update a contact by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firstName, lastName, email, favoriteColor, birthday]
 *             properties:
 *               firstName: { type: string }
 *               lastName: { type: string }
 *               email: { type: string }
 *               favoriteColor: { type: string }
 *               birthday: { type: string }
 *     responses:
 *       204:
 *         description: Contact updated
 *       400:
 *         description: The supplied id or request body is invalid
 *       404:
 *         description: No contact matches the supplied id
 *   delete:
 *     tags: [Contacts]
 *     summary: Delete a contact by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Contact deleted
 *       400:
 *         description: The supplied id is invalid
 *       404:
 *         description: No contact matches the supplied id
 */

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
  const { id } = request.params

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
