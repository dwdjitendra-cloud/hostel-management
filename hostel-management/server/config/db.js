const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Verify environment variable exists
    if (!process.env.MONGO_URI) {
      throw new Error('MongoDB URI not found in environment variables');
    }

    // Connection with robust settings
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
      socketTimeoutMS: 45000, // Close idle connections after 45s
      maxPoolSize: 10, // Maximum number of connections
      retryWrites: true,
      w: 'majority'
    });

    console.log(`✅ MongoDB Connected to: ${conn.connection.host}`);
    console.log(`📊 Database Name: ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:', error.message);
    console.log('🔍 Troubleshooting Tips:');
    console.log('1. Verify your MongoDB Atlas IP whitelist');
    console.log('2. Check your username/password');
    console.log('3. Ensure network connectivity');
    process.exit(1);
  }
};

// Connection event handlers
mongoose.connection.on('connecting', () => {
  console.log('🔗 Attempting MongoDB connection...');
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected!');
});

module.exports = connectDB;