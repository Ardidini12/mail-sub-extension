const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  senderName: {
    type: String,
    required: true
  },
  senderEmail: {
    type: String,
    required: true
  },
  subject: {
    type: String
  },
  unsubscribeLink: {
    type: String
  },
  provider: {
    type: String,
    enum: ['gmail', 'outlook', 'yahoo'],
    default: 'gmail'
  },
  isUnsubscribed: {
    type: Boolean,
    default: false
  },
  unsubscribedAt: {
    type: Date
  },
  scannedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

subscriptionSchema.index({ userId: 1, senderEmail: 1 }, { unique: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);
