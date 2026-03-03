require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Subscription = require('../models/Subscription');

async function ensureIndexes() {
  try {
    const dbName = process.env.DATABASE_NAME || 'mail_sub_db';
    const baseUrl = process.env.DATABASE_URL;
    
    const connectionUrl = baseUrl.includes('?') 
      ? baseUrl.replace('?', `${dbName}?`)
      : `${baseUrl}/${dbName}`;

    await mongoose.connect(connectionUrl, {
      serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
      },
      dbName: dbName
    });

    console.log('Connected to MongoDB');
    console.log('Creating indexes...');

    await User.createIndexes();
    console.log('✓ User indexes created (email: unique)');

    await Subscription.createIndexes();
    console.log('✓ Subscription indexes created (userId + senderEmail: unique)');

    console.log('\nAll indexes created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error creating indexes:', error);
    process.exit(1);
  }
}

ensureIndexes();
