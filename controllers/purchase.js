const Razorpay = require('razorpay')
const Orders = require('../models/Orders')
const User = require('../models/User')

exports.purchasePremium = async (req, res, next) => {
  const userId = req.user._id

  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    })

    const amount = 2500
    razorpay.orders.create({ amount: amount, currency: 'INR' }, async (err, order) => {
      if (err) {
        console.log(err)
        throw new Error(JSON.stringify(err))
      }

      const orders = new Orders({
        orderId: order.id,
        status: 'PENDING',
        userId
      })

      await orders.save()
      return res.status(200).json({ order, key_id: razorpay.key_id })
    })

  } catch (err) {
    console.log(err)
    res.status(403).json({ success: false, error: err })
  }

}

exports.updateTransaction = async (req, res) => {

  try {
    const { orderId, paymentId, status } = req.body

    if (orderId && status == 'failed') {

      const paymentDetail = await Orders.findOne({ orderId: orderId });

      if (paymentDetail) {
        paymentDetail.status = 'FAILED';
        await paymentDetail.save();
      } else {
        console.log('Order not found.');
        return res.status(500).json({ success: false, error: 'Order not found.' })

      }
      return res.status(500).json({ success: false, error: 'Transaction Fail' })
    }

    const promise1 = Orders.findOneAndUpdate(
      { orderId: orderId },
      { paymentId: paymentId, status: 'SUCCESSFUL' }
    ).exec();

    const promise2 = User.findOneAndUpdate(
      { _id: req.user._id },
      { isPremiumUser: true }
    ).exec();

    await Promise.all([promise1, promise2]);

    return res.status(200).json({ success: true, message: 'Transcation Successful' })

  } catch (err) {

    console.log(err)
    res.status(500).json({ success: false, err })
  }

}

exports.checkPremium = (req, res) => {
  try {
    const user = req.user

    if (user.isPremiumUser == true) {

      return res.status(200).json({ success: true, isPremium: true })

    } else {

      return res.status(200).json({ success: true, isPremium: false })

    }

  } catch (err) {
    console.log(err)
    res.status(500).json({ success: false, err })
  }

}