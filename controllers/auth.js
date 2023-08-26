const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const User = require('../models/User')

function isValidString(string) {
  if (string == undefined || string === 0) {
    return true
  } else {
    return false
  }
}

exports.postSignup = async (req, res) => {
  try {

    const { name, email, password } = req.body

    if (name == undefined || name.length === 0 || email == undefined || email.length === 0 || password == undefined || password.length === 0) {
      return res.status(500).json({ err: 'Something is missing!' })
    }

    const saltRounds = 10;
    await bcrypt.hash(password, saltRounds, async (err, hash) => {

      //saving in mongodb
      const user = new User({
        name,
        email,
        password: hash
      })

      await user.save()

      res.status(200).json({ success: true, user: 'Successfully created user!' })

    });

  } catch (err) {
    console.log(err)
    res.status(500).json({ success: false, message: err })

  }
}

const generateToken = (id, email) => {
  return jwt.sign({ userId: id, userEmail: email }, process.env.TOKEN_SECRET)
}

exports.postLogin = async (req, res) => {

  try {
    const { email, password } = req.body

    const authUser = await User.find({ email: email })

    if (authUser && password != null) {
      const userPassword = authUser[0].password
      const userEmail = authUser[0].email
      const userId = authUser[0]._id

      bcrypt.compare(password, userPassword, (err, result) => {
        if (err) {
          throw new Error('Something went wrong.')
        }
        if (authUser && result == true) {
          return res.status(200).json({ data: generateToken(userId, userEmail) })

        } else {
          return res.status(401).json('Password donot match!')

        }
      })
    } else {
      return res.status(404).json('User not found!')

    }


  } catch (err) {
    console.log(err)
    res.status(500).json({ success: false, message: err })
  }
}