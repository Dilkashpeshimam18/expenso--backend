const jwt = require('jsonwebtoken')
const User = require('../models/User')

const authenticate = (req, res, next) => {
  try {
    const token = req.header('Authorization')
    const user = jwt.verify(token, process.env.TOKEN_SECRET) //dcrypting token

    User.findOne({ _id: user.userId }).then((user) => {
      req.user = user
      next()
    }).catch((err) => { throw new Error(err) })

  } catch (err) {
    console.log(err)
    return res.status(401).json({ success: false })
  }
}

module.exports = { authenticate }