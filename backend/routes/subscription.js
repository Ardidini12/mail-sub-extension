const express = require('express');
const router = express.Router();
const Subscription = require('../models/Subscription');
const ScanHistory = require('../models/ScanHistory');
const { protect } = require('../middleware/auth');

router.post('/', protect, async (req, res, next) => {
  try {
    const { subscriptions, emailsScanned, provider } = req.body;

    if (!Array.isArray(subscriptions)) {
      return res.status(400).json({
        success: false,
        message: 'Subscriptions must be an array'
      });
    }

    const savedSubscriptions = [];
    
    for (const sub of subscriptions) {
      try {
        const existingSub = await Subscription.findOne({
          userId: req.user._id,
          senderEmail: sub.email
        });

        if (existingSub) {
          savedSubscriptions.push(existingSub);
        } else {
          const newSub = await Subscription.create({
            userId: req.user._id,
            senderName: sub.name,
            senderEmail: sub.email,
            subject: sub.subject,
            unsubscribeLink: sub.unsubLink,
            provider: sub.provider || provider || 'gmail'
          });
          savedSubscriptions.push(newSub);
        }
      } catch (err) {
        console.error('Error saving subscription:', err);
      }
    }

    await ScanHistory.create({
      userId: req.user._id,
      provider: provider || 'gmail',
      emailsScanned: emailsScanned || 0,
      subscriptionsFound: subscriptions.length
    });

    res.status(201).json({
      success: true,
      count: savedSubscriptions.length,
      subscriptions: savedSubscriptions
    });
  } catch (error) {
    next(error);
  }
});

router.get('/', protect, async (req, res, next) => {
  try {
    const subscriptions = await Subscription.find({
      userId: req.user._id,
      isUnsubscribed: false
    }).sort({ scannedAt: -1 });

    res.status(200).json({
      success: true,
      count: subscriptions.length,
      subscriptions
    });
  } catch (error) {
    next(error);
  }
});

router.get('/history', protect, async (req, res, next) => {
  try {
    const history = await ScanHistory.find({
      userId: req.user._id
    }).sort({ scannedAt: -1 }).limit(10);

    const totalEmailsScanned = await ScanHistory.aggregate([
      { $match: { userId: req.user._id } },
      { $group: { _id: null, total: { $sum: '$emailsScanned' } } }
    ]);

    res.status(200).json({
      success: true,
      history,
      totalEmailsScanned: totalEmailsScanned[0]?.total || 0
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', protect, async (req, res, next) => {
  try {
    const subscription = await Subscription.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }

    subscription.isUnsubscribed = true;
    subscription.unsubscribedAt = new Date();
    await subscription.save();

    res.status(200).json({
      success: true,
      message: 'Subscription marked as unsubscribed'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
