const express = require('express');
const router  = express.Router();

const {
  getMyConversations,
  getOrCreateConversation,
  getMessages,
  sendMessage,
  deleteMessage,
  deleteConversation,
} = require('../controllers/messageController');

const { protect }  = require('../middleware/authMiddleware');
const { isAdopter } = require('../middleware/roleMiddleware');

// All routes require login
router.use(protect);

// Conversations
router.get('/',          getMyConversations);           // GET  /api/messages
router.post('/start',    isAdopter, getOrCreateConversation); // POST /api/messages/start

// Messages within a conversation
router.get('/:conversationId/messages',           getMessages);   // GET  /api/messages/:id/messages
router.post('/:conversationId/messages',          sendMessage);   // POST /api/messages/:id/messages
router.delete('/:conversationId',                 deleteConversation); // DELETE /api/messages/:id
router.delete('/:conversationId/messages/:messageId', deleteMessage); // DELETE /api/messages/:id/messages/:msgId

module.exports = router;