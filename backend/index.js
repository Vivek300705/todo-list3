import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
// import path from 'path';
import router from './routes/userRouter.js';
import todorouter from './routes/todoRouter.js';

dotenv.config(); // Load environment variables

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000", // Use frontend URL from environment variables
    credentials: true, // Include credentials if using cookies or authentication headers
  })
);
app.use(express.json());

// Basic route for API
app.get('/', (req, res) => {
  res.status(200).send('Welcome to the Todoist API!');
});



// API Routes
app.use('/api', router); // User-related routes
app.use('/api', todorouter); // Todo-related routes

// MongoDB Connection
mongoose
  .connect(process.env.Mongodb_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connection successful'))
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1); // Exit the app if the database connection fails
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

// Start the Server
const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
