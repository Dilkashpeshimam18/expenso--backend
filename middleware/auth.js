const jwt = require('jsonwebtoken')
const User = require('../models/User')
const mongoose = require('mongoose');

const authenticate = (req, res, next) => {
  try {
    const token = req.header('Authorization')
    const user = jwt.verify(token, process.env.TOKEN_SECRET) //dcrypting token
    if (!mongoose.Types.ObjectId.isValid(user.userId)) {
      throw new Error("Invalid user ID format.");
  }

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