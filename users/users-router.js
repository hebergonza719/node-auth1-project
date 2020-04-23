// this is already protected by the restricted middleware.

const router = require('express').Router();

const Users = require('./users-model.js');

// /api/users
// this returns all users
router.get('/', (req, res) => {
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

module.exports = router;