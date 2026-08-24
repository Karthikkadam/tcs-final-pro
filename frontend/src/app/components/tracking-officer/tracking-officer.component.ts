import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { ApiService } from '../../services/api.service';
import { Booking } from '../../models/models';

@Component({
  selector: 'app-tracking-officer',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  template: `
    <div class="page-container">
      <app-navbar></app-navbar>
      <div class="main-content">
        <div class="page-header"><h1>Track Parcel (Officer)</h1><p>Track any booking by ID from the entire system</p></div>

        <div class="glass-card"><div class="search-row"><input type="text" class="form-control" [(ngModel)]="bookingId" placeholder="Enter Booking ID"><button class="btn btn-primary" (click)="search()">🔍 Track</button></div></div>

        <div *ngIf="errorMessage" class="alert alert-error" style="margin-top: 16px;">❌ {{ errorMessage }}</div>

        <div *ngIf="booking" class="glass-card" style="margin-top: 20px;">
          <div class="table-container">
            <table>
              <thead><tr><th>Booking ID</th><th>Full Name</th><th>Address</th><th>Receiver</th><th>Receiver Address</th><th>Date</th><th>Status</th></tr></thead>
              <tbody>
                <tr>
                  <td><strong>{{ booking.bookingId }}</strong></td>
                  <td>{{ booking.senderName }}</td>
                  <td>{{ booking.senderAddress }}</td>
                  <td>{{ booking.receiverName }}</td>
                  <td>{{ booking.receiverAddress }}</td>
                  <td>{{ booking.bookingDate }}</td>
                  <td><span class="badge" [ngClass]="'badge-' + booking.status.toLowerCase().replace(' ','')">{{ booking.status }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`.search-row { display: flex; gap: 12px; } .search-row input { flex: 1; }`]
})
export class TrackingOfficerComponent {
  bookingId = '';
  booking: Booking | null = null;
  errorMessage = '';

  constructor(private apiService: ApiService) {}

  search(): void {
    this.errorMessage = ''; this.booking = null;
    if (!this.bookingId.trim()) { this.errorMessage = 'Please enter a Booking ID'; return; }
    this.apiService.getBooking(this.bookingId).subscribe({
      next: (b) => { this.booking = b; },
      error: () => { this.errorMessage = 'Booking not found'; }
    });
  }
}
