const express=require('express');
const { handleLogout } = require('../controllers/logoutController');
const router=express.Router()


//Get route for refresh token
router.get('/',handleLogout);

module.exports=router;