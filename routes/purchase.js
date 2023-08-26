const express = require('express')
const purchaseControllers = require('../controllers/purchase')
const { authenticate } = require('../middleware/auth')

const router = express.Router()

router.get('/premiummembership', authenticate, purchaseControllers.purchasePremium)
router.post('/updatetransactionstatus', authenticate, purchaseControllers.updateTransaction)
router.get('/checkpremium',authenticate,purchaseControllers.checkPremium)


module.exports = router;