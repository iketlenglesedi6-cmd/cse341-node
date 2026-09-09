const test = require('node:test')
const assert = require('node:assert/strict')
const contactsRouter = require('../routes/contacts')

test('contacts router exposes CRUD endpoints', () => {
  const found = {
    getAll: false,
    getById: false,
    post: false,
    put: false,
    delete: false
  }

  contactsRouter.stack.forEach((layer) => {
    if (!layer.route) {
      return
    }

    const methods = Object.keys(layer.route.methods)
    const path = layer.route.path

    if (path === '/' && methods.includes('get')) {
      found.getAll = true
    }

    if (path === '/:id' && methods.includes('get')) {
      found.getById = true
    }

    if (path === '/' && methods.includes('post')) {
      found.post = true
    }

    if (path === '/:id' && methods.includes('put')) {
      found.put = true
    }

    if (path === '/:id' && methods.includes('delete')) {
      found.delete = true
    }
  })

  assert.equal(found.getAll, true)
  assert.equal(found.getById, true)
  assert.equal(found.post, true)
  assert.equal(found.put, true)
  assert.equal(found.delete, true)
})
