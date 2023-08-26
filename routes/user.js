const express=require('express')
const router=express.Router()
const {authenticate}=require('../middleware/auth.js')
const userController=require('../controllers/user.js')

router.get('/get-userDetail',authenticate,userController.getUserDetail)
router.get('/userInfo',authenticate,userController.getUserInfo)
router.post('/update-userInfo',authenticate,userController.updateUserInfo)

module.exports=router