import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { MessageModule } from 'primeng/message';

import { PatientService } from '../../shared/services/patient.service';
import { PatientStatus } from '../../models/patient.model';

@Component({
  selector: 'app-patient-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    DatePickerModule,
    SelectModule,
    MessageModule
  ],
  templateUrl: './patient-form.component.html'
})
export class PatientFormComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private patientService = inject(PatientService);

  loading = signal<boolean>(false);
  submitted = signal<boolean>(false);
  error = signal<string>('');

  maxDate = new Date();

  statusOptions: { label: string; value: PatientStatus }[] = [
    { label: 'Active', value: 'active' },
    { label: 'Pending', value: 'pending' },
    { label: 'Inactive', value: 'inactive' }
  ];

  patientForm = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    dateOfBirth: [null as Date | null, Validators.required],
    status: ['pending' as PatientStatus, Validators.required]
  });

  get firstNameInvalid(): boolean {
    const control = this.patientForm.controls.firstName;
    return this.submitted() && control.invalid;
  }

  get lastNameInvalid(): boolean {
    const control = this.patientForm.controls.lastName;
    return this.submitted() && control.invalid;
  }

  get emailInvalid(): boolean {
    const control = this.patientForm.controls.email;
    return this.submitted() && control.invalid;
  }

  get dateOfBirthInvalid(): boolean {
    const control = this.patientForm.controls.dateOfBirth;
    return this.submitted() && control.invalid;
  }

  onSubmit(): void {
    this.submitted.set(true);
    this.error.set('');

    if (this.patientForm.invalid) {
      return;
    }

    const formValue = this.patientForm.getRawValue();

    if (!formValue.dateOfBirth) {
      return;
    }

    const payload = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      dateOfBirth: formValue.dateOfBirth.toISOString().split('T')[0],
      status: formValue.status
    };

    this.loading.set(true);

    this.patientService.createPatient(payload).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/dashboard'], {
          state: {
            successMessage: 'Patient added successfully'
          }
        });
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Failed to add patient. Please check the details and try again.');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}