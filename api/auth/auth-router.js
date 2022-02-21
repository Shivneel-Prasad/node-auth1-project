// Require `checkUsernameFree`, `checkUsernameExists` and `checkPasswordLength`
// middleware functions from `auth-middleware.js`. You will need them here!
const router = require('express').Router()
const { checkUsernameFree, checkUsernameExists, checkPasswordLength } = require('../auth/auth-middleware')
const bcrypt = require('bcryptjs')
const Model = require('../users/users-model')

  router.post('/register', checkUsernameFree, checkPasswordLength, (req, res, next) => {
    const { username, password } = req.body
    const hash = bcrypt.hashSync(password, 8)
    const user = { username, password: hash }
    Model.add(user)
      .then(addUser => {
        res.status(201).json(addUser)
      })
      .catch(next)
  })

router.post('/login', checkUsernameExists, async (req, res) => {
  console.log('login is working!!')
    try {
      const { username, password } = req.body
      const [user] = await Model.findBy({ username })
      if(user && bcrypt.compareSync(password, user.password)) {
        console.log(user);
        req.session.user = user
        res.status(200).json({ 
          status: 200, 
          message: `Welcome ${user.username}`
        })
      } else {
        res.status(401).json({ 
          message: 'Invalid credentials'
        });
      }
    } catch (err) {
      res.status(500).json({ 
        message: "Invalid Credentials", 
        error: err.message 
      })
    }
})

router.get('/logout', async (req, res) => {
  console.log('Logout is working')
    if (req.session.user) {
        req.session.destroy(err => {
            if (err) { 
                res.json({ message: `Unable to log out ${err.message}` })
            } else {
                res.status(200).json({ message: 'Logout Successful' })
            }
        })
    } else {
        res.status(200).json({ status: 200, message: 'No Session' })
    }
})

module.exports = router;