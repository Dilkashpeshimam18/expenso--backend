const User = require('../models/User')

exports.getUserDetail = async (req, res) => {
  try {
    const user = req.user
    const data = {
      total_income: user.total_income,
      total_expense: user.total_expense,
      remaining_balance: user.remaining_balance
    }
    res.status(200).json({ data: data })
  } catch (err) {
    return res.status(403).json({ err, success: false })

  }
}

exports.getUserInfo = async (req, res) => {
  try {
    const user = req.user
    const data = {
      name: user.name,
      photoUrl: user.photoUrl
    }

    res.status(200).json({ data, success: true })

  } catch (err) {
    console.log(err)
    return res.status(403).json({ err, success: false })

  }
}

exports.updateUserInfo = async (req, res) => {
  try {
    const { name, photoUrl } = req.body
    const userId = req.user._id
    await User.findByIdAndUpdate(userId, {
      name,
      photoUrl
    })
    res.status(200).json({ success: true })

  } catch (err) {
    console.log(err)
    return res.status(403).json({ err, success: false })

  }
}