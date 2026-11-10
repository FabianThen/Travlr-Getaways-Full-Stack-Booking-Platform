# Travlr Getaways: Full-Stack MEAN Travel Booking Platform

A full-stack travel-booking application built on MongoDB, Express, Angular, and Node.js. Customers browse available trips on a public site, and an authenticated admin manages trips through an Angular single-page app backed by a JWT-secured REST API.

Built as part of my B.S. in Computer Science at Southern New Hampshire University.

## Features

- Public, server-rendered trip listings (Handlebars)
- Angular admin SPA: log in, add, edit, and delete trips
- REST API with full CRUD for trips
- JWT authentication: register and log in to receive a token; write endpoints require it
- MongoDB persistence with Mongoose models and seed data

## Architecture

| Folder | Purpose |
|---|---|
| `app_api/` | Express REST API: routes, controllers, Mongoose models, JWT auth (Passport) |
| `app_admin/` | Angular admin single-page application (trip management, login) |
| `app_server/` | Handlebars-rendered public-facing site |
| `data/` | Seed data (`trips.json`) |

## API

| Method | Endpoint | Auth |
|---|---|---|
| GET | `/api/trips` | Public |
| GET | `/api/trips/:tripCode` | Public |
| POST | `/api/trips` | JWT required |
| PUT | `/api/trips/:tripCode` | JWT required |
| DELETE | `/api/trips/:tripCode` | JWT required |
| POST | `/api/register` | Public |
| POST | `/api/login` | Public |

I tested every endpoint's CRUD behavior with Postman.

## Run it locally

Requirements: Node.js and a local MongoDB instance.

1. Install dependencies: `npm install`
2. Create a `.env` file with `JWT_SECRET=<a long random string>` (optionally `DB_HOST`, which defaults to `127.0.0.1`)
3. Seed the database using the data in `data/trips.json` (see `app_api/models/seed.js`)
4. Start the server: `node app.js` (runs on http://localhost:3000)
5. For the admin app: `cd app_admin && npm install && npm start`

## Tech stack

MongoDB, Mongoose, Express, Node.js, Angular, TypeScript, Passport, JSON Web Tokens

## What I'd improve next

- Automated API tests (the project was tested manually with Postman)
- Rate limiting and input validation on all write endpoints
- Deployment with Docker and a CI pipeline
