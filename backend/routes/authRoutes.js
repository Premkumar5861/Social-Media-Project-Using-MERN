const express = require('express')
const {signup,login,enableTwoFactorAuth} = require('../controllers/authController')
const router  = express.Router();
const {protect} = require('../middleware/authMiddleware')


router.post('/signup',signup);
router.post('/login',login);
router.post('/enable-2fa',protect,enableTwoFactorAuth);

module.exports=router;