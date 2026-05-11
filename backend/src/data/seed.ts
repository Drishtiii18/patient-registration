import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Patient } from '../models/patient.model';

dotenv.config();

const MONGO_URI: string = process.env.MONGO_URI || '';

const samplePatients = [
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john1@example.com',
    dateOfBirth: '1990-01-15',
    status: 'active'
  },
  {
    firstName: 'Sarah',
    lastName: 'Smith',
    email: 'sarah2@example.com',
    dateOfBirth: '1988-03-22',
    status: 'pending'
  },
  {
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'michael3@example.com',
    dateOfBirth: '1995-07-11',
    status: 'inactive'
  },
  {
    firstName: 'Emma',
    lastName: 'Wilson',
    email: 'emma4@example.com',
    dateOfBirth: '1999-09-10',
    status: 'active'
  },
  {
    firstName: 'David',
    lastName: 'Taylor',
    email: 'david5@example.com',
    dateOfBirth: '1992-04-18',
    status: 'pending'
  },
  {
    firstName: 'Olivia',
    lastName: 'Anderson',
    email: 'olivia6@example.com',
    dateOfBirth: '1997-12-05',
    status: 'active'
  },
  {
    firstName: 'James',
    lastName: 'Thomas',
    email: 'james7@example.com',
    dateOfBirth: '1985-06-30',
    status: 'inactive'
  },
  {
    firstName: 'Sophia',
    lastName: 'Jackson',
    email: 'sophia8@example.com',
    dateOfBirth: '1993-08-14',
    status: 'pending'
  },
  {
    firstName: 'Daniel',
    lastName: 'White',
    email: 'daniel9@example.com',
    dateOfBirth: '1991-11-02',
    status: 'active'
  },
  {
    firstName: 'Mia',
    lastName: 'Harris',
    email: 'mia10@example.com',
    dateOfBirth: '1998-02-20',
    status: 'inactive'
  },
  {
    firstName: 'Noah',
    lastName: 'Martin',
    email: 'noah11@example.com',
    dateOfBirth: '1994-05-27',
    status: 'active'
  },
  {
    firstName: 'Charlotte',
    lastName: 'Thompson',
    email: 'charlotte12@example.com',
    dateOfBirth: '1996-10-09',
    status: 'pending'
  },
  {
    firstName: 'Liam',
    lastName: 'Garcia',
    email: 'liam13@example.com',
    dateOfBirth: '1989-03-03',
    status: 'inactive'
  },
  {
    firstName: 'Amelia',
    lastName: 'Martinez',
    email: 'amelia14@example.com',
    dateOfBirth: '2000-01-01',
    status: 'active'
  },
  {
    firstName: 'Benjamin',
    lastName: 'Robinson',
    email: 'benjamin15@example.com',
    dateOfBirth: '1992-07-16',
    status: 'pending'
  },
  {
    firstName: 'Harper',
    lastName: 'Clark',
    email: 'harper16@example.com',
    dateOfBirth: '1997-04-07',
    status: 'inactive'
  },
  {
    firstName: 'Lucas',
    lastName: 'Rodriguez',
    email: 'lucas17@example.com',
    dateOfBirth: '1986-09-19',
    status: 'active'
  },
  {
    firstName: 'Evelyn',
    lastName: 'Lewis',
    email: 'evelyn18@example.com',
    dateOfBirth: '1995-12-25',
    status: 'pending'
  },
  {
    firstName: 'Henry',
    lastName: 'Lee',
    email: 'henry19@example.com',
    dateOfBirth: '1993-06-12',
    status: 'inactive'
  },
  {
    firstName: 'Ella',
    lastName: 'Walker',
    email: 'ella20@example.com',
    dateOfBirth: '1998-08-08',
    status: 'active'
  }
];

const seedDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGO_URI);

    console.log('MongoDB Connected');

    await Patient.deleteMany();

    console.log('Old patients removed');

    await Patient.insertMany(samplePatients);

    console.log('20 sample patients inserted');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();