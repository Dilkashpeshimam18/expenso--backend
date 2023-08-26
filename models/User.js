const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,

    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/

    },
    password: {
        type: String,
        required: true,

    },

    photoUrl: {
        type: String,
    },
    isPremiumUser: {
        type: Boolean,
        default: false
    },
    total_expense: {
        type: Number,
        default: 0
    },
    total_income: {
        type: Number,
        default: 0
    },
    remaining_balance: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model('User', userSchema)