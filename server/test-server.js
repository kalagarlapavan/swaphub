import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Mount routes
app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'UP',
    services: {
      server: 'UP',
      database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    }
  });
});

const startTestServer = async () => {
  try {
    const mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    console.log(`\n[Test DB] Connected to In-Memory MongoDB: ${uri}`);

    const server = app.listen(5001, () => {
      console.log('[Test Server] Listening on http://localhost:5001');
    });

    // Handle shutdown
    process.on('SIGTERM', async () => {
      console.log('Shutting down test server...');
      await mongoose.disconnect();
      await mongoServer.stop();
      server.close(() => {
        console.log('Test server stopped.');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('Failed to start test server:', error);
    process.exit(1);
  }
};

startTestServer();
