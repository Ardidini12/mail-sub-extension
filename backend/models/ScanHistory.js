const mongoose = require('mongoose');

const scanHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  provider: {
    type: String,
    enum: ['gmail', 'outlook', 'yahoo'],
    default: 'gmail'
  },
  emailsScanned: {
    type: Number,
    required: true,
    default: 0
  },
  subscriptionsFound: {
    type: Number,
    required: true,
    default: 0
  },
  scannedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ScanHistory', scanHistorySchema);
