const express=require('express');
const { handleRefreshToken } = require('../controllers/refreshTokenController');
const router=express.Router()


//Get route for refresh token
router.get('/',handleRefreshToken);

module.exports=router;