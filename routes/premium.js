const express=require('express')
const premiumController=require('../controllers/premium')
const { authenticate } = require('../middleware/auth')


const router=express.Router()

router.get('/show-leaderboard',authenticate,premiumController.showLeaderboard)

module.exports=router;