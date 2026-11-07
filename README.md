# Chats Backend

Node.js and Express API for a real-time, one-to-one chat app. It pairs with the React client, [chats-web](https://github.com/anishumar/chats-web).

## Features

- Versioned REST API under `/api/v1` for users, chat rooms, and messages
- Users, chat rooms, and messages stored in MongoDB through Mongoose
- Firebase ID tokens verified in middleware for both HTTP requests and socket connections
- Live message delivery and online status over Socket.IO
- User search and username management

## Tech stack

Node.js, Express, MongoDB, Mongoose, Socket.IO, Firebase Admin SDK

## Project structure

```
config/        MongoDB and Firebase setup
controllers/   Request handlers
middlewares/   Token verification for HTTP and sockets
models/        UserProfile, ChatRoom, ChatMessage
routes/v1/     Versioned API routes
index.js       Server and socket setup
```

## Users API

All requests need an `Authorization: Bearer <Firebase ID token>` header.

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/v1/users` | List users, or search with `?search=term` |
| GET | `/api/v1/users/:userId` | Get a user |
| GET | `/api/v1/users/by-username/:username` | Find a user by username |
| PATCH | `/api/v1/users/me/username` | Set your username |
| GET | `/api/v1/usernames/check` | Check username availability |

Chat room and message routes are in `routes/v1/`.

## Running locally

You need Node.js, a MongoDB instance, and a Firebase project.

```bash
cp .env.example .env     # set PORT and MONGO_URI
npm install
npm start
```

Add your Firebase service account key at `config/serviceAccountKey.json`. Never commit this file.
