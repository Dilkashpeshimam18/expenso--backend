const mongoose = require('mongoose')

const yearlyExpenseSchema = mongoose.Schema({
    month: {
        type: String,
        required: true
    },
    expense: {
        type: Number,
        required: true

    },
    userId: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('YearlyExpense', yearlyExpenseSchema)