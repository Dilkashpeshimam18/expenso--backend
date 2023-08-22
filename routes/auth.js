const express=require('express')
const authControllers=require('../controllers/auth')
const router=express.Router()

router.post('/signup',authControllers.postSignup)
router.post('/login',authControllers.postLogin)

module.exports=router