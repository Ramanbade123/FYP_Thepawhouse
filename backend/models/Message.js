const mongoose = require('mongoose');

// Each conversation is between one adopter and one rehomer about one pet
const conversationSchema = new mongoose.Schema(
  {
    pet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pet',
      required: true,
    },
    adopter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rehomer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Last message preview for inbox list
    lastMessage: { type: String, default: '' },
    lastMessageAt: { type: Date, default: Date.now },
    // Unread counts per participant
    unreadAdopter: { type: Number, default: 0 },
    unreadRehomer: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Only one conversation per (pet, adopter, rehomer) trio
conversationSchema.index({ pet: 1, adopter: 1, rehomer: 1 }, { unique: true });
conversationSchema.index({ adopter: 1, lastMessageAt: -1 });
conversationSchema.index({ rehomer: 1, lastMessageAt: -1 });

const messageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    senderRole: {
      type: String,
      enum: ['adopter', 'rehomer'],
      required: true,
    },
    text: {
      type: String,
      required: [true, 'Message cannot be empty'],
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
      trim: true,
    },
    readAt: { type: Date, default: null },
  },
  { timestamps: true }
);

messageSchema.index({ conversation: 1, createdAt: 1 });

const Conversation = mongoose.model('Conversation', conversationSchema);
const Message      = mongoose.model('Message', messageSchema);

module.exports = { Conversation, Message };