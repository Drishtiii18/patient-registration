import { Component } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [ProgressSpinnerModule],
  template: `
    <div class="spinner-overlay">
      <p-progress-spinner ariaLabel="loading" />
    </div>
  `,
  styles: [`
    .spinner-overlay {
      position: fixed;
      inset: 0;
      background: rgba(255, 255, 255, 0.65);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999;
    }
  `]
})
export class SpinnerComponent {}