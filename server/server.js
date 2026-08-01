import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import itemRoutes from './routes/itemRoutes.js';
import requestRoutes from './routes/requestRoutes.js';

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/requests', requestRoutes);

// Health Check API Route
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  // readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  const dbStates = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  res.json({
    status: 'UP',
    timestamp: new Date(),
    services: {
      server: 'UP',
      database: dbStates[dbStatus] || 'unknown',
    },
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
