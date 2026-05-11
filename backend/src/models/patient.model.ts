import { Schema, model, Document } from 'mongoose';

export type PatientStatus = 'active' | 'pending' | 'inactive';

export interface IPatient extends Document {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  status: PatientStatus;
  registeredDate: string;
}

const PatientSchema = new Schema<IPatient>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    dateOfBirth: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['active', 'pending', 'inactive'],
      default: 'pending'
    },
    registeredDate: {
      type: String,
      default: () => new Date().toISOString()
    }
  },
  {
    timestamps: true
  }
);

export const Patient = model<IPatient>('Patient', PatientSchema);

export interface DashboardStats {
  total: number;
  active: number;
  pending: number;
  inactive: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}