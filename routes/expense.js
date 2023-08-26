const express = require('express')
const expenseControllers = require('../controllers/expense')
const { authenticate } = require('../middleware/auth')
const router = express.Router()

router.get('/get-expense', authenticate, expenseControllers.getExpense)
router.get('/get-monthlyexpenses', authenticate, expenseControllers.getMontlyExpense)
router.get('/get-yearlyexpense', authenticate, expenseControllers.getYearlyExpense)
router.get('/download-expense', authenticate, expenseControllers.downloadExpense)
router.post('/add-expense', authenticate, expenseControllers.addExpense)
router.post('/add-yealyexpense', authenticate, expenseControllers.addYearlyExpense)
router.put('/update-expense/:id', authenticate, expenseControllers.updateExpense)
router.delete('/delete-expense/:id', authenticate, expenseControllers.deleteExpense)

module.exports = router;