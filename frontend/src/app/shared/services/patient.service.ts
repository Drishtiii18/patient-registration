import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  DashboardStats,
  PaginatedResponse,
  Patient,
  PatientStatus
} from '../../models/patient.model';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:5000/api';

  getPatients(
    search: string = '',
    status: string = '',
    page: number = 1,
    pageSize: number = 10
  ): Observable<PaginatedResponse<Patient>> {
    let params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize);

    if (search) {
      params = params.set('search', search);
    }

    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<PaginatedResponse<Patient>>(
      `${this.apiUrl}/patients`,
      { params }
    );
  }

  getPatientById(id: string): Observable<Patient> {
    return this.http.get<Patient>(
      `${this.apiUrl}/patients/${id}`
    );
  }

  createPatient(patient: Partial<Patient>): Observable<Patient> {
    return this.http.post<Patient>(
      `${this.apiUrl}/patients`,
      patient
    );
  }

  updatePatientStatus(
    id: string,
    status: PatientStatus
  ): Observable<Patient> {
    return this.http.put<Patient>(
      `${this.apiUrl}/patients/${id}`,
      { status }
    );
  }

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(
      `${this.apiUrl}/stats`
    );
  }
}