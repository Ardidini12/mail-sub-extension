const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwtConfig = require('../config/jwt');
const { validateRegister, validateLogin } = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/register', authLimiter, validateRegister, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'This email is already registered. Please use a different email or login instead.'
      });
    }

    const user = await User.create({
      email,
      password
    });

    const token = jwtConfig.generateToken({ id: user._id });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        hasPaid: user.hasPaid,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'This email is already registered. Please use a different email or login instead.'
      });
    }
    next(error);
  }
});

router.post('/login', authLimiter, validateLogin, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = jwtConfig.generateToken({ id: user._id });

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        hasPaid: user.hasPaid,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
});

router.get('/me', protect, async (req, res, next) => {
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

module.exports = router;
