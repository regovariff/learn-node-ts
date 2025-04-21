import express, { Application } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes';
// import userRoutes from './routes/userRoutes';
// import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || '';

// 1. Connect to MongoDB
mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log('MongoDB connected');
        // 4. Start the server only after DB connection is successful
        app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
    })
    .catch((err) => {
        console.error('MongoDB connection failed:', err);
        process.exit(1); // Exit if DB fails to connect
    });

// 2. Middleware
app.use(express.json()); // Parses JSON bodies

app.get('/', (_req, res) => {
    res.send('API is running');
});

// 3. Routes
app.use('/', authRoutes);
// app.use('/api/users', userRoutes);

// Optional: error handling middleware
// app.use(errorHandler);
