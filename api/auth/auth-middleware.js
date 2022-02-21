const Users = require('../users/users-model')

function restricted(req, res, next) {
  console.log('Access restricted auth users only! ')
  const { user } = req.session
  if(!user){
    res.status(401).json({
      status: 401,
      message: 'You shall not pass!'
    })
  } else {
    next()
  }
}

const checkUsernameFree = async (req, res, next) => {
  try {
    const userData = await Users.findBy(req.body)
    console.log(Users.username)
    if (userData.username === req.body) {
      res.status(422).json({ message: 'Username taken' })
    } else {
      next()
    }
  } catch (err) {
    res.status(500).json(`Server error: ${err}`);
  }
}

const checkUsernameExists = async (req, res, next) => {
  try {
    const existing = await Users.findBy(req.body)
      if (!existing) {
        res.status(401).json({
          message: 'Invalid credentials'
        })
      } else {
        req.userData = existing[0]
        next()
      }
  } catch (err) {
    res.status(500).json(`Server error: ${err}`);
  }
}

async function checkPasswordLength(req, res, next) {
  try {
    const { password } = req.body
    if (!password || password.length <= 3) {
      res.status(422).json({
        message: 'Password must be longer than 3 chars'
      })
    } else {
      next()
    }
  } catch (err) {
    res.status(500).json(`Server error: ${err}`);
  }
}

// Don't forget to add these to the `exports` object so they can be required in other modules
module.exports = {
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength
}