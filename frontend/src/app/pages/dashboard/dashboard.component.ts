import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { SelectModule} from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule, TablePageEvent } from 'primeng/table';
import { MessageModule } from 'primeng/message';

import { PatientService } from '../../shared/services/patient.service';
import { DashboardStats, Patient, PatientStatus } from '../../models/patient.model';
import { StatusBadgeComponent } from '../../shared/status-badge/status-badge.component';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    ChartModule,
    SelectModule,
    InputTextModule,
    TableModule,
    MessageModule,
    StatusBadgeComponent,
    SpinnerComponent
  ],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  private patientService = inject(PatientService);
  private router = inject(Router);

  patients = signal<Patient[]>([]);
  stats = signal<DashboardStats | null>(null);
  loading = signal<boolean>(false);
  error = signal<string>('');

  searchText = signal<string>('');
  selectedStatus = signal<PatientStatus | ''>('');
  page = signal<number>(1);
  pageSize = signal<number>(10);
  totalRecords = signal<number>(0);

  statusOptions = [
    { label: 'All', value: '' },
    { label: 'Active', value: 'active' },
    { label: 'Pending', value: 'pending' },
    { label: 'Inactive', value: 'inactive' }
  ];

  chartData = computed(() => {
    const currentStats = this.stats();

    return {
      labels: ['Active', 'Pending', 'Inactive'],
      datasets: [
        {
          data: [
            currentStats?.active ?? 0,
            currentStats?.pending ?? 0,
            currentStats?.inactive ?? 0
          ]
        }
      ]
    };
  });

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loadPatients();
    this.loadStats();
  }

  loadPatients(): void {
    this.loading.set(true);
    this.error.set('');

    this.patientService
      .getPatients(
        this.searchText(),
        this.selectedStatus(),
        this.page(),
        this.pageSize()
      )
      .subscribe({
        next: (response) => {
          this.patients.set(response.data);
          this.totalRecords.set(response.total);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Failed to load patients');
          this.loading.set(false);
        }
      });
  }

  loadStats(): void {
    this.patientService.getStats().subscribe({
      next: (response) => {
        this.stats.set(response);
      },
      error: () => {
        this.error.set('Failed to load statistics');
      }
    });
  }

  onSearch(): void {
    this.page.set(1);
    this.loadPatients();
  }

  onStatusChange(): void {
    this.page.set(1);
    this.loadPatients();
  }

  onPageChange(event: TablePageEvent): void {
    const first = event.first ?? 0;
    const rows = event.rows ?? 10;

    this.page.set(first / rows + 1);
    this.pageSize.set(rows);
    this.loadPatients();
  }

  goToAddPatient(): void {
    this.router.navigate(['/patients/new']);
  }

  goToPatientDetail(id: string): void {
    this.router.navigate(['/patients', id]);
  }
}