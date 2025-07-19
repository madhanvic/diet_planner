import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import errorHandler from './middlewares/errorHandler';
import authRouter from './modules/auth/auth.route';
import userRouter from './modules/users/users.route';

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', authRouter);
app.use('/api/user', userRouter);

// Health Check
app.get('/health-check', (_req, res) => {
  res.send('API is running...');
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Error handling middleware
app.use(errorHandler);

export default app;
