import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes/userRouter.js';
import todorouter from './routes/todoRouter.js';

dotenv.config(); // Load environment variables

const app = express();

// CORS Configuration
const corsOptions = {
  origin: 'http://localhost:3000', // Frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Basic route for API
app.get('/', (req, res) => {
  res.status(200).send('Welcome to the Todoist API!');
});

// API Routes
app.use('/api', router); 
app.use('/api', todorouter); // Todo-related routes

// MongoDB Connection
mongoose
  .connect(process.env.Mongodb_url)
  .then(() => console.log('MongoDB connection successful'))
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1); 
  });

// Start the server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please try a different port.`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
    process.exit(1);
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  server.close(() => {
    process.exit(1);
  });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong!',
  });
});

// 404 Handler for Unmatched Routes
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
  });
});
