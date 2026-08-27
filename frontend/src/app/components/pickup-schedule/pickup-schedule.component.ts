import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { ApiService } from '../../services/api.service';
import { Booking } from '../../models/models';

@Component({
  selector: 'app-pickup-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  template: `
    <div class="page-container">
      <app-navbar></app-navbar>

      <main class="main-content">
        <div class="page-header">
          <div>
            <div class="role-badge role-officer" style="margin-bottom: 8px;">Logistics Dispatch</div>
            <h1>Pickup & Drop-off Schedule</h1>
            <p>Update and synchronize courier collection windows and delivery schedules</p>
          </div>
        </div>

        <!-- Search Card -->
        <div class="card search-card">
          <div class="search-input-group">
            <input 
              type="text" 
              class="form-control" 
              [(ngModel)]="bookingId" 
              placeholder="Enter Booking ID to reschedule (e.g. BKG00001)..."
              (keyup.enter)="search()"
            />
            <button class="btn btn-primary btn-lg" (click)="search()" [disabled]="searching">
              <span *ngIf="searching" class="spinner-sm"></span>
              <span>{{ searching ? 'Querying...' : 'Find Shipment' }}</span>
            </button>
          </div>
        </div>

        <div *ngIf="successMessage" class="alert alert-success" style="margin-top: 16px;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          <span>{{ successMessage }}</span>
        </div>

        <div *ngIf="errorMessage" class="alert alert-error" style="margin-top: 16px;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          <span>{{ errorMessage }}</span>
        </div>

        <!-- Booking Details & Schedule Editor -->
        <div *ngIf="booking" class="card schedule-editor-card" style="margin-top: 20px;">
          <div class="card-header-bar">
            <div>
              <span class="booking-label">Booking Reference</span>
              <h2 class="font-mono">{{ booking.bookingId }}</h2>
            </div>
            <span class="badge" [ngClass]="'badge-' + booking.status.toLowerCase().replace(' ', '')">
              {{ booking.status }}
            </span>
          </div>

          <div class="table-container" style="margin: 18px 0 24px;">
            <table>
              <thead>
                <tr>
                  <th>Sender</th>
                  <th>Pickup Address</th>
                  <th>Receiver</th>
                  <th>Delivery Address</th>
                  <th>Current Pickup</th>
                  <th>Current Drop-off</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{{ booking.senderName }}</td>
                  <td>{{ booking.senderAddress }}</td>
                  <td>{{ booking.receiverName }}</td>
                  <td>{{ booking.receiverAddress }}</td>
                  <td><strong style="color: #60a5fa;">{{ booking.parcelPickupTime || 'Not Set' }}</strong></td>
                  <td><strong style="color: #34d399;">{{ booking.parcelDropoffTime || 'Not Set' }}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Schedule Editor Form -->
          <div class="schedule-inputs-box">
            <h3 class="section-subtitle">Set Adjusted Courier Windows</h3>
            
            <div class="form-row">
              <div class="form-group">
                <label>New Courier Pickup Window *</label>
                <input type="datetime-local" class="form-control" [(ngModel)]="newPickup" name="pickup">
              </div>

              <div class="form-group">
                <label>New Estimated Drop-off Window *</label>
                <input type="datetime-local" class="form-control" [(ngModel)]="newDropoff" name="dropoff">
              </div>
            </div>

            <div class="update-action-row">
              <button class="btn btn-primary btn-lg" (click)="update()" [disabled]="updating || !newPickup">
                <span *ngIf="updating" class="spinner-sm"></span>
                <span>{{ updating ? 'Saving Schedule...' : 'Save Updated Schedule' }}</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .search-card { padding: 20px; }
    .search-input-group { display: flex; gap: 12px; }
    .schedule-editor-card { padding: 24px; }
    .card-header-bar { display: flex; justify-content: space-between; align-items: center; padding-bottom: 16px; border-bottom: 1px solid var(--border-subtle); flex-wrap: wrap; gap: 12px; }
    .booking-label { font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; }
    .card-header-bar h2 { font-size: 20px; font-weight: 800; color: var(--text-primary); }
    .section-subtitle { font-size: 14px; font-weight: 700; color: var(--text-primary); margin-bottom: 14px; }
    .schedule-inputs-box { background: var(--bg-input); border: 1px solid var(--border-default); border-radius: var(--radius-md); padding: 20px; }
    .update-action-row { display: flex; justify-content: flex-end; margin-top: 14px; }
    .spinner-sm { display: inline-block; width: 14px; height: 14px; border: 2px solid rgba(255, 255, 255, 0.2); border-top-color: #fff; border-radius: 50%; animation: spin 0.75s linear infinite; }
    @media (max-width: 640px) { .search-input-group { flex-direction: column; } }
  `]
})
export class PickupScheduleComponent {
  bookingId = '';
  booking: Booking | null = null;
  newPickup = '';
  newDropoff = '';
  searching = false;
  updating = false;
  successMessage = '';
  errorMessage = '';

  constructor(private apiService: ApiService) {}

  search(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.booking = null;
    const q = this.bookingId.trim();

    if (!q) {
      this.errorMessage = 'Please enter a Booking Reference ID';
      return;
    }

    this.searching = true;
    this.apiService.getBooking(q).subscribe({
      next: (b) => {
        this.searching = false;
        this.booking = b;
        this.newPickup = b.parcelPickupTime || '';
        this.newDropoff = b.parcelDropoffTime || '';
      },
      error: () => {
        this.searching = false;
        this.errorMessage = 'Booking not found';
      }
    });
  }

  update(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.updating = true;

    this.apiService.updateSchedule(this.bookingId, this.newPickup, this.newDropoff).subscribe({
      next: (res: any) => {
        this.updating = false;
        this.successMessage = res.message || 'Schedule updated successfully!';
        if (res.booking) {
          this.booking = res.booking;
        } else if (this.booking) {
          this.booking.parcelPickupTime = this.newPickup;
          this.booking.parcelDropoffTime = this.newDropoff;
        }
      },
      error: (err) => {
        this.updating = false;
        this.errorMessage = err.error?.message || 'Schedule update failed';
      }
    });
  }
}
