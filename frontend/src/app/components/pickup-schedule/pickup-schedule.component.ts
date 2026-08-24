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
      <div class="main-content">
        <div class="page-header"><h1>Pickup & Drop Schedule</h1><p>Update pickup and drop-off times for bookings</p></div>

        <div class="glass-card"><div class="search-row"><input type="text" class="form-control" [(ngModel)]="bookingId" placeholder="Enter Booking ID"><button class="btn btn-primary" (click)="search()">🔍 Find</button></div></div>

        <div *ngIf="successMessage" class="alert alert-success" style="margin-top: 16px;">✅ {{ successMessage }}</div>
        <div *ngIf="errorMessage" class="alert alert-error" style="margin-top: 16px;">❌ {{ errorMessage }}</div>

        <div *ngIf="booking" class="glass-card" style="margin-top: 20px;">
          <div class="table-container">
            <table>
              <thead><tr><th>Booking ID</th><th>Full Name</th><th>Address</th><th>Receiver</th><th>Receiver Address</th><th>Date</th><th>Status</th><th>Pickup</th><th>Drop-off</th></tr></thead>
              <tbody>
                <tr>
                  <td><strong>{{ booking.bookingId }}</strong></td>
                  <td>{{ booking.senderName }}</td>
                  <td>{{ booking.senderAddress }}</td>
                  <td>{{ booking.receiverName }}</td>
                  <td>{{ booking.receiverAddress }}</td>
                  <td>{{ booking.bookingDate }}</td>
                  <td><span class="badge" [ngClass]="'badge-' + booking.status.toLowerCase().replace(' ','')">{{ booking.status }}</span></td>
                  <td>{{ booking.parcelPickupTime || '-' }}</td>
                  <td>{{ booking.parcelDropoffTime || '-' }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="update-section" style="margin-top: 24px;">
            <h3>Update Schedule</h3>
            <div class="form-row">
              <div class="form-group"><label>New Pickup Time</label><input type="datetime-local" class="form-control" [(ngModel)]="newPickup"></div>
              <div class="form-group"><label>New Drop-off Time</label><input type="datetime-local" class="form-control" [(ngModel)]="newDropoff"></div>
            </div>
            <button class="btn btn-primary" (click)="update()" [disabled]="updating">{{ updating ? 'Updating...' : 'Update Schedule' }}</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`.search-row { display: flex; gap: 12px; } .search-row input { flex: 1; } .update-section h3 { font-size: 16px; margin-bottom: 16px; }`]
})
export class PickupScheduleComponent {
  bookingId = '';
  booking: Booking | null = null;
  newPickup = '';
  newDropoff = '';
  updating = false;
  successMessage = '';
  errorMessage = '';

  constructor(private apiService: ApiService) {}

  search(): void {
    this.errorMessage = ''; this.successMessage = ''; this.booking = null;
    this.apiService.getBooking(this.bookingId).subscribe({
      next: (b) => { this.booking = b; this.newPickup = b.parcelPickupTime || ''; this.newDropoff = b.parcelDropoffTime || ''; },
      error: () => { this.errorMessage = 'Booking not found'; }
    });
  }

  update(): void {
    this.errorMessage = ''; this.successMessage = ''; this.updating = true;
    this.apiService.updateSchedule(this.bookingId, this.newPickup, this.newDropoff).subscribe({
      next: (res: any) => { this.updating = false; this.successMessage = res.message; if (res.booking) this.booking = res.booking; },
      error: (err) => { this.updating = false; this.errorMessage = err.error?.message || 'Update failed'; }
    });
  }
}
