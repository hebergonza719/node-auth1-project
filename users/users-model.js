const db = require("../database/dbConfig.js");

function find() {
  return db('users').select('id', 'username');
}

// an object is being passed to the filter object parameter
function findBy(filter) {
  return db('users').where(filter);
}

// what is this doing?
async function add(user) {
  const [id] = await db('users').insert(user, 'id');

  return findById(id);
}

function findById(id) {
  return db('users')
    .where({ id })
    .first();
}


module.exports = {
  add,
  find,
  findBy,
  findById,
};