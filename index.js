// backend/index.js
// Vercel deployment timestamp: ${new Date().toISOString()}
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './src/routes/auth.js';
import progressRoutes from './src/routes/progress.js';
import { errorHandler } from './src/middleware/error.js';

// ES module dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars - searching for .env file in the correct location
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: [
    'https://project-1sbb.vercel.app', // main frontend URL
    'https://frontendl-mauve.vercel.app',
    'https://frontendl-git-main-nitin115s-projects.vercel.app',
    'https://frontendl-22mfkx6kx-nitin115s-projects.vercel.app',
    'http://localhost:5173', // for local development
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Added OPTIONS for preflight
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'], // Explicitly allow headers
  exposedHeaders: ['Content-Range', 'X-Content-Range'] // If you need to expose any headers
}));
app.use(express.json());

// Add OPTIONS handling for preflight requests
app.options('*', cors()); // Enable pre-flight for all routes

// Connect to MongoDB
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/video-progress';
mongoose.connect(mongoURI)
  .then(() => console.log(`MongoDB Connected: ${mongoURI}`))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/progress', progressRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Video Progress Tracking API is running' });
});

// Health check endpoint for Vercel
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is healthy' });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

// Only start the server if not running on Vercel
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

// For Vercel serverless deployment
export default app; 