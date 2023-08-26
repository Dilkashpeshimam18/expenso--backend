const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    paymentId: String,
    orderId: String,
    status: String,
    userId: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Order', orderSchema)