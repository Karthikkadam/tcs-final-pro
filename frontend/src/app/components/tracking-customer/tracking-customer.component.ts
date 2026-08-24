import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Booking } from '../../models/models';

@Component({
  selector: 'app-tracking-customer',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  template: `
    <div class="page-container">
      <app-navbar></app-navbar>
      <div class="main-content">
        <div class="page-header"><h1>Track Your Parcel</h1><p>Enter your booking ID to track the delivery status</p></div>

        <div class="glass-card search-card">
          <div class="search-row">
            <input type="text" class="form-control" [(ngModel)]="bookingId" placeholder="Enter Booking ID (e.g. BKG00001)">
            <button class="btn btn-primary" (click)="search()">🔍 Track</button>
          </div>
        </div>

        <div *ngIf="errorMessage" class="alert alert-error">❌ {{ errorMessage }}</div>

        <div *ngIf="booking" class="glass-card result-card" style="margin-top: 20px;">
          <div class="table-container">
            <table>
              <thead><tr><th>Booking ID</th><th>Receiver Name</th><th>Receiver Address</th><th>Date of Booking</th><th>Status</th></tr></thead>
              <tbody>
                <tr>
                  <td><strong>{{ booking.bookingId }}</strong></td>
                  <td>{{ booking.receiverName }}</td>
                  <td>{{ booking.receiverAddress }}</td>
                  <td>{{ booking.bookingDate }}</td>
                  <td><span class="badge" [ngClass]="'badge-' + booking.status.toLowerCase().replace(' ','')">{{ booking.status }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="status-timeline" style="margin-top: 24px;">
            <div class="timeline-item" *ngFor="let s of statuses" [class.active]="isStatusReached(s)" [class.current]="booking.status === s">
              <div class="timeline-dot"></div>
              <span>{{ s }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .search-card { margin-bottom: 16px; }
    .search-row { display: flex; gap: 12px; }
    .search-row input { flex: 1; }
    .status-timeline { display: flex; gap: 0; overflow-x: auto; padding: 16px 0; }
    .timeline-item { display: flex; flex-direction: column; align-items: center; flex: 1; position: relative; font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; }
    .timeline-dot { width: 16px; height: 16px; border-radius: 50%; background: rgba(255,255,255,0.1); border: 2px solid rgba(255,255,255,0.15); margin-bottom: 8px; transition: all 0.3s; }
    .timeline-item.active .timeline-dot { background: #667eea; border-color: #667eea; }
    .timeline-item.current .timeline-dot { background: #00d4aa; border-color: #00d4aa; box-shadow: 0 0 12px rgba(0,212,170,0.5); }
    .timeline-item.active { color: #a0a3bd; }
    .timeline-item.current { color: #00d4aa; font-weight: 700; }
  `]
})
export class TrackingCustomerComponent {
  bookingId = '';
  booking: Booking | null = null;
  errorMessage = '';
  statuses = ['New', 'Scheduled', 'PickedUp', 'Assigned', 'Booked', 'InTransit', 'Delivered'];

  constructor(private apiService: ApiService, private authService: AuthService) {}

  search(): void {
    this.errorMessage = '';
    this.booking = null;
    if (!this.bookingId.trim()) { this.errorMessage = 'Please enter a Booking ID'; return; }
    this.apiService.getBooking(this.bookingId).subscribe({
      next: (b) => {
        if (b.customerId === this.authService.getCustomerId()) { this.booking = b; }
        else { this.errorMessage = 'Booking not found for your account'; }
      },
      error: () => { this.errorMessage = 'Booking not found'; }
    });
  }

  isStatusReached(status: string): boolean {
    if (!this.booking) return false;
    if (this.booking.status === 'Cancelled') return status === 'Cancelled';
    return this.statuses.indexOf(status) <= this.statuses.indexOf(this.booking.status);
  }
}
