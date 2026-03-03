const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

router.get('/profile', protect, async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        email: req.user.email,
        hasPaid: req.user.hasPaid,
        paymentDate: req.user.paymentDate,
        createdAt: req.user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
});

router.get('/status', protect, async (req, res, next) => {
  try {
    const ScanHistory = require('../models/ScanHistory');
    const Subscription = require('../models/Subscription');

    const scanCount = await ScanHistory.countDocuments({ userId: req.user._id });
    const subscriptionCount = await Subscription.countDocuments({ 
      userId: req.user._id,
      isUnsubscribed: false 
    });

    res.status(200).json({
      success: true,
      hasPaid: req.user.hasPaid,
      scanCount,
      subscriptionCount
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
