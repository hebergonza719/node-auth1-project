// these routers are used to authenticate users, with register and login

// below is a shorthand for the following:
// const express = require('express');
// router = express.Router();

const router = require('express').Router();

const bcrypt = require('bcryptjs');

// for user model
const Users = require('../users/users-model.js');


// this is for users to REGISTER
router.post('/register', (req, res) => {
  const user = req.body;

  // we have to hash the password, by getting it from the req.body.password
  const hash = bcrypt.hashSync(user.password, 8);
  // then we assigned that hashed password into the user.password again
  user.password = hash;

  // this is from users-model.js
  // we are adding a user to the database
  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

// this is for users to LOGIN
router.post('/login', (req, res) => {
  let { username, password } = req.body;
  // let username = req.body.username;
  // let password = req.body.password;

  // const queryObject = { username: username }
  // Users.findBy(queryObject)
  Users.findBy({ username })
    .first()
    .then(user => {
      // if both conditions return true
      // this password comes from req.body, 
      // and user.password comes from what's stored
      // this is comparing both as hashed passwords
      if (user && bcrypt.compareSync(password, user.password)) {
        // in here, we are authenticated
        // we are adding user to the req.session which was created by the middleware and assigning it with username which comes from the body of the request. This is used to indicate success.
        req.session.user = username;
        res.status(200).json({ message: `Welcome ${user.username}!`});
      } else {
        res.status(401).json({ message: "invalid creds" });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
})

// this is for users to LOGOUT 
// it could be done with a GET or a POST

router.delete('/logout', (req, res) => {
  // this checks to see if there is a req.session
  // which comes from the global middleware
  if (req.session) {
    req.session.destroy((err) => {
      // if there is an error ...
      if (err) {
        res.status(400).json({ message: 'error logging out: ', error: err })
      // if everything is okay ...
      } else {
        res.json({ message: 'logged out' });
      }
    });
  // if there is no req.session, it just ends
  } else {
      res.end();
  }
})

module.exports = router;