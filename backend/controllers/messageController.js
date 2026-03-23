const { Conversation, Message } = require('../models/Message');
const Pet  = require('../models/Pet');
const User = require('../models/User');

// ── CONVERSATIONS ─────────────────────────────────────────────────────────────

// GET all conversations for the logged-in user (adopter or rehomer)
exports.getMyConversations = async (req, res) => {
  try {
    const userId = req.user._id;
    const role   = req.user.role;

    const filter = role === 'adopter' ? { adopter: userId } : { rehomer: userId };

    const conversations = await Conversation.find(filter)
      .populate('pet',     'name breed primaryImage status')
      .populate('adopter', 'name profileImage')
      .populate('rehomer', 'name profileImage')
      .sort({ lastMessageAt: -1 });

    res.status(200).json({ success: true, data: conversations });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// POST start or get existing conversation (adopter initiates about a pet)
exports.getOrCreateConversation = async (req, res) => {
  try {
    const { petId } = req.body;
    const adopterId = req.user._id;

    const pet = await Pet.findById(petId).populate('rehomer', 'name profileImage');
    if (!pet) return res.status(404).json({ success: false, error: 'Pet not found' });

    if (req.user.role !== 'adopter') {
      return res.status(403).json({ success: false, error: 'Only adopters can start conversations' });
    }

    // Prevent messaging own pet
    if (pet.rehomer._id.toString() === adopterId.toString()) {
      return res.status(400).json({ success: false, error: 'You cannot message yourself' });
    }

    let convo = await Conversation.findOne({
      pet:     petId,
      adopter: adopterId,
      rehomer: pet.rehomer._id,
    })
      .populate('pet',     'name breed primaryImage status')
      .populate('adopter', 'name profileImage')
      .populate('rehomer', 'name profileImage');

    if (!convo) {
      convo = await Conversation.create({
        pet:     petId,
        adopter: adopterId,
        rehomer: pet.rehomer._id,
      });
      await convo.populate([
        { path: 'pet',     select: 'name breed primaryImage status' },
        { path: 'adopter', select: 'name profileImage' },
        { path: 'rehomer', select: 'name profileImage' },
      ]);
    }

    res.status(200).json({ success: true, data: convo });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// POST start or get existing conversation (rehomer initiates with an adopter about a pet)
exports.startConversationAsRehomer = async (req, res) => {
  try {
    const { petId, adopterId } = req.body;
    const rehomerId = req.user._id;

    const pet = await Pet.findById(petId);
    if (!pet) return res.status(404).json({ success: false, error: 'Pet not found' });
    if (pet.rehomer.toString() !== rehomerId.toString()) {
      return res.status(403).json({ success: false, error: 'You do not own this pet listing' });
    }

    const adopter = await User.findById(adopterId);
    if (!adopter) return res.status(404).json({ success: false, error: 'Adopter not found' });

    let convo = await Conversation.findOne({
      pet: petId,
      adopter: adopterId,
      rehomer: rehomerId,
    })
      .populate('pet',     'name breed primaryImage status')
      .populate('adopter', 'name profileImage')
      .populate('rehomer', 'name profileImage');

    if (!convo) {
      convo = await Conversation.create({
        pet: petId,
        adopter: adopterId,
        rehomer: rehomerId,
      });
      await convo.populate([
        { path: 'pet',     select: 'name breed primaryImage status' },
        { path: 'adopter', select: 'name profileImage' },
        { path: 'rehomer', select: 'name profileImage' },
      ]);
    }

    res.status(200).json({ success: true, data: convo });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── MESSAGES ──────────────────────────────────────────────────────────────────

// GET messages in a conversation
exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id;
    const role   = req.user.role;

    // Verify user is a participant
    const convo = await Conversation.findById(conversationId);
    if (!convo) return res.status(404).json({ success: false, error: 'Conversation not found' });

    const isParticipant =
      convo.adopter.toString() === userId.toString() ||
      convo.rehomer.toString() === userId.toString();

    if (!isParticipant) {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }

    // Mark incoming messages as read and reset unread count
    await Message.updateMany(
      { conversation: conversationId, sender: { $ne: userId }, readAt: null },
      { readAt: new Date() }
    );

    if (role === 'adopter') await Conversation.findByIdAndUpdate(conversationId, { unreadAdopter: 0 });
    if (role === 'rehomer') await Conversation.findByIdAndUpdate(conversationId, { unreadRehomer: 0 });

    const messages = await Message.find({ conversation: conversationId })
      .populate('sender', 'name profileImage role')
      .sort({ createdAt: 1 });

    res.status(200).json({ success: true, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// POST send a message
exports.sendMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { text } = req.body;
    const userId = req.user._id;
    const role   = req.user.role;

    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, error: 'Message text is required' });
    }

    const convo = await Conversation.findById(conversationId);
    if (!convo) return res.status(404).json({ success: false, error: 'Conversation not found' });

    const isParticipant =
      convo.adopter.toString() === userId.toString() ||
      convo.rehomer.toString() === userId.toString();

    if (!isParticipant) {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }

    const message = await Message.create({
      conversation: conversationId,
      sender:       userId,
      senderRole:   role,
      text:         text.trim(),
    });

    // Update conversation preview and unread count for the OTHER party
    const unreadUpdate =
      role === 'adopter'
        ? { unreadRehomer: convo.unreadRehomer + 1 }
        : { unreadAdopter: convo.unreadAdopter + 1 };

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage:   text.trim(),
      lastMessageAt: new Date(),
      ...unreadUpdate,
    });

    await message.populate('sender', 'name profileImage role');
    res.status(201).json({ success: true, data: message });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// DELETE a message — sender only, within 10 minutes
exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);
    if (!message) return res.status(404).json({ success: false, error: 'Message not found' });

    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: 'Not authorised' });
    }

    const ageMs = Date.now() - new Date(message.createdAt).getTime();
    if (ageMs > 10 * 60 * 1000) {
      return res.status(400).json({ success: false, error: 'Messages can only be deleted within 10 minutes of sending' });
    }

    await message.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// DELETE a conversation
exports.deleteConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id;

    const convo = await Conversation.findById(conversationId);
    if (!convo) return res.status(404).json({ success: false, error: 'Conversation not found' });

    const isParticipant =
      convo.adopter.toString() === userId.toString() ||
      convo.rehomer.toString() === userId.toString();

    if (!isParticipant) {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }

    await Message.deleteMany({ conversation: conversationId });
    await convo.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};