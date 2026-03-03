const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const dbName = process.env.DATABASE_NAME || 'mail_sub_db';
    const baseUrl = process.env.DATABASE_URL;
    
    const connectionUrl = baseUrl.includes('?') 
      ? baseUrl.replace('?', `${dbName}?`)
      : `${baseUrl}/${dbName}`;

    const conn = await mongoose.connect(connectionUrl, {
      serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
      },
      dbName: dbName
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Using Database: ${conn.connection.name}`);
    
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`Database '${dbName}' initialized. Collections: ${collections.length > 0 ? collections.map(c => c.name).join(', ') : 'none (will be created on first insert)'}`);
    
    return conn;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
