const express = require('express');
const {protect }= require('../middleware/authMiddleware');
const {accessChat,sendMessage,getChatMessage,getUserChats} =require('../controllers/chatController');
const { route } = require('./authRoutes');

const router = express.Router();


router.route('/').post(protect,accessChat).get(protect,getUserChats);
router.route('/:chatId').get(protect,getChatMessage);
router.route('/:chatId/message').post(protect,sendMessage);

module.exports = router;