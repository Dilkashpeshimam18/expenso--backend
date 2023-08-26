const express=require('express')
const router=express.Router()
const {authenticate}=require('../middleware/auth.js')
const incomeController=require('../controllers/income.js')

router.post('/add-income',authenticate,incomeController.addIncome)
router.post('/edit-income',authenticate,incomeController.editUserIncome)

module.exports=router
