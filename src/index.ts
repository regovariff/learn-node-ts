import express, { Application } from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import cors from 'cors';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = ['http://localhost:5000', 'http://localhost:5173'];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
    }),
);

// Middleware
app.use(express.json());

// Health check route
app.get('/', (_req, res) => {
    res.send('API is running');
});

// Routes
app.use('/', authRoutes);

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
