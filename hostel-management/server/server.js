// Load environment variables FIRST
const dotenv = require('dotenv');
const path = require('path');

// Configure dotenv with explicit path and debug
dotenv.config({
  path: path.resolve(__dirname, '.env'),
  debug: process.env.NODE_ENV !== 'production'
});

// Debug environment loading
console.log('Environment Variables Loaded:');
console.log('MONGO_URI:', process.env.MONGO_URI ? '***loaded***' : 'NOT FOUND');
console.log('PORT:', process.env.PORT || 'NOT FOUND');

// Core dependencies
const express = require('express');
const cors = require('cors');  // Use require, not import
const mongoose = require('mongoose');
const errorHandler = require('./middlewares/error');

// Initialize Express app FIRST
const app = express();

// Database connection
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MongoDB URI not configured in .env file');
    }
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    });
    console.log('✅ MongoDB Connected Successfully');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  }
};

// Middlewares (AFTER app declaration)
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://hostel-ui.vercel.app",
    "https://hms-opal.vercel.app" 
  ],
  credentials: true
}));

app.use(express.json());

// Route imports
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const hostelRoutes = require('./routes/hostelRoutes');
const roomRoutes = require('./routes/roomRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const studentRoutes = require('./routes/studentRoutes');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/hostels', hostelRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/student', studentRoutes);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Hostel Management API is running!' });
});

// Error Handling
app.use(errorHandler);

// Server Configuration
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Connect to database first, then start server
connectDB().then(() => {
  console.log('🔗 Database connection established');
  
  // Start Server
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running in ${NODE_ENV} mode on port ${PORT}`);
    console.log(`📡 MongoDB URI: ${process.env.MONGO_URI ? 'Configured' : 'Missing'}`);
  });

  // Handle shutdown gracefully
  process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
      console.log('💤 Server terminated');
      process.exit(0);
    });
  });

  process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    server.close(() => process.exit(1));
  });
});
