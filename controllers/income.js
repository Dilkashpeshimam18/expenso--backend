const User = require('../models/User')
exports.addIncome = async (req, res) => {
  try {
    const { income } = req.body
    const id = req.user._id

    await User.findByIdAndUpdate(id, {
      total_income: income,
      remaining_balance: income
    })
    res.status(200).json({ message: 'Added Income Successfully' })

  } catch (err) {
    console.log(err)
    return res.status(403).json({ err, success: false })

  }
}

exports.editUserIncome = async (req, res) => {
  try {
    const { income } = req.body
    const user = req.user
    const id = req.user._id

    const updatedBalance = Number(income) - Number(user.total_expense)

    await User.findByIdAndUpdate(id, {
      total_income: income,
      remaining_balance: updatedBalance
    })
    const updatedData = {
      updatedBalance: user.remaining_balance,
      updatedIncome: user.total_income
    }

    res.status(200).json({ success: true, data: updatedData })

  } catch (err) {
    console.log(err)
    return res.status(403).json({ err, success: false })

  }
}