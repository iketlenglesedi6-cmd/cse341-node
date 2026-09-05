# CSE 341 Contacts API

Week 01 Contacts project for CSE 341. The API connects to MongoDB and provides the Part 1 GET endpoints.

## Setup

1. Install Node.js 18 or newer.
2. Copy `.env.example` to `.env`.
3. Set `MONGODB_URI` and `MONGODB_DATABASE` in `.env`.
4. Create a MongoDB collection named `contacts` with at least three documents. Each document should include `firstName`, `lastName`, `email`, `favoriteColor`, and `birthday`.
5. Start the server with `npm run dev` or `npm start`.

The API runs at `http://localhost:3000` by default. Use `requests.rest` with the VS Code REST Client extension to test it.

## Routes

- `GET /` returns a health check.
- `GET /contacts` returns all contacts.
- `GET /contacts?id=<id>` returns one contact by MongoDB ObjectId.
- `GET /contacts/:id` returns one contact by MongoDB ObjectId.

## Render

Use `npm install` as the build command and `npm start` as the start command. Add `MONGODB_URI`, `MONGODB_DATABASE`, and optionally `PORT` under Render environment variables. Never commit `.env` or database credentials.
