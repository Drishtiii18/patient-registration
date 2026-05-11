import express, { Application, Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Routes
import patientRoutes from './routes/patients.routes';
import statsRoutes from './routes/stats.routes';

dotenv.config();

const app: Application = express();

// Environment variables
const PORT: number = Number(process.env.PORT) || 5000;
const MONGO_URI: string = process.env.MONGO_URI || '';

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'Patient Registration API is running'
  });
});

// API routes
app.use('/api/patients', patientRoutes);
app.use('/api/stats', statsRoutes);

// MongoDB connection + server start
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });
  //route not found
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    error: 'Route not found'
  });
});