import express, { Request, Response, Router } from 'express';
import mongoose from 'mongoose';
import { Patient, IPatient, PatientStatus, PaginatedResponse } from '../models/patient.model';

const router: Router = express.Router();

interface PatientQuery {
  search?: string;
  status?: PatientStatus;
  page?: string;
  pageSize?: string;
}

interface CreatePatientBody {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  status?: PatientStatus;
}

interface UpdatePatientStatusBody {
  status: PatientStatus;
}

// GET /api/patients?search=&status=&page=&pageSize=
router.get('/', async (req: Request<{}, {}, {}, PatientQuery>, res: Response) => {
  try {
    const { search, status } = req.query;

    const page = Math.max(Number(req.query.page) || 1, 1);
    const pageSize = Math.max(Number(req.query.pageSize) || 10, 1);

    const filter: Record<string, unknown> = {};

    if (status) {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await Patient.countDocuments(filter);

    const patients = await Patient.find(filter)
      .sort({ registeredDate: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    const response: PaginatedResponse<IPatient> = {
      data: patients,
      total,
      page,
      pageSize
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch patients'
    });
  }
});

// GET /api/patients/:id
router.get('/:id', async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: 'Invalid patient ID' });
      return;
    }

    const patient = await Patient.findById(id);

    if (!patient) {
      res.status(404).json({ error: 'Patient not found' });
      return;
    }

    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch patient'
    });
  }
});

// POST /api/patients
router.post('/', async (req: Request<{}, {}, CreatePatientBody>, res: Response) => {
  try {
    const { firstName, lastName, email, dateOfBirth, status } = req.body;

    if (!firstName || !lastName || !email || !dateOfBirth) {
      res.status(400).json({
        error: 'firstName, lastName, email, and dateOfBirth are required'
      });
      return;
    }

    const newPatient = await Patient.create({
      firstName,
      lastName,
      email,
      dateOfBirth,
      status
    });

    res.status(201).json(newPatient);
  } catch (error: unknown) {
  if (
    error instanceof Error &&
    'code' in error &&
    error.code === 11000
  ) {
    res.status(400).json({
      error: 'Email already exists'
    });
    return;
  }

  res.status(500).json({
    error: 'Failed to create patient'
  });
}
});

// PUT /api/patients/:id
router.put('/:id', async (req: Request<{ id: string }, {}, UpdatePatientStatusBody>, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: 'Invalid patient ID' });
      return;
    }

    if (!['active', 'pending', 'inactive'].includes(status)) {
      res.status(400).json({
        error: 'Status must be active, pending, or inactive'
      });
      return;
    }

    const updatedPatient = await Patient.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedPatient) {
      res.status(404).json({ error: 'Patient not found' });
      return;
    }

    res.status(200).json(updatedPatient);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to update patient'
    });
  }
});

export default router;