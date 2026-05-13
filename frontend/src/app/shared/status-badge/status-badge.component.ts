import { Component, computed, input } from '@angular/core';
import { TagModule } from 'primeng/tag';

import { PatientStatus } from '../../models/patient.model';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [TagModule],
  template: `
    <p-tag
      [value]="status()"
      [severity]="severity()"
    />
  `
})
export class StatusBadgeComponent {
  status = input.required<PatientStatus>();

  severity = computed(() => {
    switch (this.status()) {
      case 'active':
        return 'success';
      case 'pending':
        return 'warn';
      case 'inactive':
        return 'danger';
    }
  });
}