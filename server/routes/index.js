const express=require('express')
const Register = require('../controllers/RegisterUser')
const checkEmail = require('../controllers/checkEmail')
const checkPassword=require('../controllers/checkPassword')
const userDetails=require('../controllers/userDetails')
const Logout=require('../controllers/Logout')
const updateUserDetails = require('../controllers/updateUserDetails')
const searchUser=require('../controllers/searchUser')
const router=express.Router()

router.post('/register',Register)
router.post('/email',checkEmail)
router.post('/password',checkPassword)
router.get('/user-details',userDetails)
router.get('/logout',Logout)
router.post('/update-details',updateUserDetails)
router.post('/search-user',searchUser)

module.exports=router