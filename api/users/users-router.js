// Require the `restricted` middleware from `auth-middleware.js`. You will need it here!
const router = require('express').Router()
const Model = require('./users-model')
const mw = require('../auth/auth-middleware')

router.get('/', mw.restricted, (req, res) => {
  console.log('List of all users in the database')
  Model.find()
    .then(allUsers => {
      res.status(200).json(allUsers)
    })
    .catch(err => {
      res.status(401).json({
        status: 401,
        message: 'You shall not pass!',
        error: err.message,
      })
    })
})

// Don't forget to add the router to the `exports` object so it can be required in other modules
module.exports = router