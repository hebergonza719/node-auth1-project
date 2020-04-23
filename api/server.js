// express-session manages session data in a store, and controls inbound and outbound cookies related to the session. This info can be stored in a db or memory.
// this info is stored so that when future requests come in with a cookie that has a session ID in it, the session manager can find the session data and make it availalble.
// express-session automatically creates a req.session for every inbound request.
const session = require('express-session');

// this requires the session above from express-session
// this allows express-session to use knex.
const knexSessionStore = require('connect-session-knex')(session);
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const restricted = require('../auth/restricted-middleware.js');
const usersRouter = require('../users/users-router.js');
const authRouter = require('../auth/auth-router.js');

const server = express();

// this is the config object for express-session. This is passed on to session when it is set up as global middleware.

const sessionConfig = {
  name: 'oatmeal',
  secret: 'myDogCanSpeak',
  cookie: {
    maxAge: 3600 * 1000,
    secure: false, // this should be true in production
    httpOnly: true
  },
  resave: false,
  saveUninitialized: false,

  store: new knexSessionStore(
    {
      knex: require('../database/dbConfig.js'),
      tablename: 'sessions',
      sidfieldname: 'sid',
      createtable: true,
      clearInterval: 3600 * 1000
    }
  )
}

// globla middleware
server.use(helmet());
server.use(express.json());
server.use(cors());

// this is a function that returns a middleware function
// since we're not including a url, it is being used on every request.
// This middleware will basically manage cookie processing and sending, and
// related session data in the store.
server.use(session(sessionConfig));

// restricted is a middleware to protect usersRouter
server.use("/api/users", restricted, usersRouter);
// server.use("/api/auth", authRouter);
server.use("/api", authRouter);



module.exports = server;