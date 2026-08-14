import dotenv from 'dotenv';
dotenv.config(); // Must be first so environment variables load before anything else!

import express from 'express';
import cors from 'cors';
import dns from 'dns';
import connectDB from './config/db.js';

// Import Cloudinary configuration (now safely has access to process.env)
import './config/cloudinary.js';

// Configure DNS servers
dns.setServers(["8.8.8.8", "8.8.4.4"]);

// Import Routes
import watchRoutes from './routes/watchRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import saleRoutes from './routes/saleRoutes.js';
import watchStrapRoutes from './routes/watchStrapRoutes.js'; 

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Serverless Database Connection Middleware
// Ensures connection is awaited before any API request executes on Vercel
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ success: false, message: 'Database connection failed' });
  }
});

// Routes
app.use('/api/watches', watchRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/watch-straps', watchStrapRoutes);

// Root Route
app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'API is running smoothly!' });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;