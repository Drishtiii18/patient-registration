import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SelectModule } from 'primeng/select';
import { MessageModule } from 'primeng/message';

import { PatientService } from '../../shared/services/patient.service';
import { Patient, PatientStatus } from '../../models/patient.model';
import { StatusBadgeComponent } from '../../shared/status-badge/status-badge.component';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-patient-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    SelectModule,
    MessageModule,
    StatusBadgeComponent,
    SpinnerComponent
  ],
  templateUrl: './patient-detail.component.html'
})
export class PatientDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private patientService = inject(PatientService);

  patient = signal<Patient | null>(null);
  loading = signal<boolean>(false);
  updating = signal<boolean>(false);
  error = signal<string>('');
  success = signal<string>('');

  statusOptions: { label: string; value: PatientStatus }[] = [
    { label: 'Active', value: 'active' },
    { label: 'Pending', value: 'pending' },
    { label: 'Inactive', value: 'inactive' }
  ];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error.set('Patient ID is missing');
      return;
    }

    this.loadPatient(id);
  }

  loadPatient(id: string): void {
    this.loading.set(true);
    this.error.set('');

    this.patientService.getPatientById(id).subscribe({
      next: (response) => {
        this.patient.set(response);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load patient details');
        this.loading.set(false);
      }
    });
  }

  onStatusChange(status: PatientStatus): void {
    const currentPatient = this.patient();

    if (!currentPatient) {
      return;
    }

    this.updating.set(true);
    this.error.set('');
    this.success.set('');

    this.patientService.updatePatientStatus(currentPatient._id, status).subscribe({
      next: (updatedPatient) => {
        this.patient.set(updatedPatient);
        this.success.set('Patient status updated successfully');
        this.updating.set(false);
      },
      error: () => {
        this.error.set('Failed to update patient status');
        this.updating.set(false);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}