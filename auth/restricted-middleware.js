// this is a middleware to check if there is a req.session.user.
// this checks to see if .user exists

// this is placed in server.js as a global middleware

module.exports = (req, res, next) => {
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).json({ message: 'not logged in' });
  }
}