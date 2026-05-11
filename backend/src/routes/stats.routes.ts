import express, { Request, Response, Router } from 'express';
import { Patient, DashboardStats } from '../models/patient.model';

const router: Router = express.Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const total = await Patient.countDocuments();
    const active = await Patient.countDocuments({ status: 'active' });
    const pending = await Patient.countDocuments({ status: 'pending' });
    const inactive = await Patient.countDocuments({ status: 'inactive' });

    const stats: DashboardStats = {
      total,
      active,
      pending,
      inactive
    };

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch dashboard statistics'
    });
  }
});

export default router;