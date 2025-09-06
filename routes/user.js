const express=require('express');
const router=express.Router();
const User=require('../models/user');
const catchAsync=require('../utils/catchAsync');
const passport = require('passport');
const {storeReturnTo}=require('../middleware');
const Users=require('../controllers/user')



router.get('/register',Users.getRegisterUserPage);
router.get('/login',Users.getLoginUserPage);
router.get('/logout',Users.logoutUser); 
router.post('/register',Users.registerNewUser);

router.post('/reg',storeReturnTo, passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}) , Users.returnPage)














module.exports=router;