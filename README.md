# CSE 341 Contacts API

Week 02 Contacts project for CSE 341. The API connects to MongoDB and provides a CRUD interface for a `contacts` collection.

## Setup

1. Install Node.js 18 or newer.
2. Copy `.env.example` to `.env`.
3. Set `MONGODB_URI` and `MONGODB_DATABASE` in `.env`.
4. Create a MongoDB collection named `contacts` with at least three documents. Each document should include `firstName`, `lastName`, `email`, `favoriteColor`, and `birthday`.
5. Start the server with `npm run dev` or `npm start`.

The API runs at `http://localhost:3000` by default. Use `requests.rest` with the VS Code REST Client extension to test it.

## Routes

- `GET /` returns an API status message.
- `GET /contacts` returns all contacts.
- `GET /contacts/:id` returns one contact by MongoDB ObjectId.
- `POST /contacts` creates a contact. All five contact fields are required; the response includes the new id.
- `PUT /contacts/:id` replaces a contact. All five contact fields are required.
- `DELETE /contacts/:id` deletes a contact.
- `GET /api-docs` opens the interactive Swagger documentation.

Each contact has `firstName`, `lastName`, `email`, `favoriteColor`, and `birthday` string fields. Successful reads return `200`; creation returns `201`; successful updates and deletes return `204`. Invalid ids or request bodies return `400`, and missing contacts return `404`.

## Render

Use `npm install` as the build command and `npm start` as the start command. Add `MONGODB_URI`, `MONGODB_DATABASE`, and optionally `PORT` under Render environment variables. Never commit `.env` or database credentials.
