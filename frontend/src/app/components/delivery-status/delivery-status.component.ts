import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { ApiService } from '../../services/api.service';
import { Booking } from '../../models/models';

@Component({
  selector: 'app-delivery-status',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  template: `
    <div class="page-container">
      <app-navbar></app-navbar>
      <div class="main-content">
        <div class="page-header"><h1>Delivery Status</h1><p>Update the delivery status of parcels</p></div>

        <div class="glass-card"><div class="search-row"><input type="text" class="form-control" [(ngModel)]="bookingId" placeholder="Enter Booking ID"><button class="btn btn-primary" (click)="search()">🔍 Find</button></div></div>

        <div *ngIf="successMessage" class="alert alert-success" style="margin-top: 16px;">✅ {{ successMessage }}</div>
        <div *ngIf="errorMessage" class="alert alert-error" style="margin-top: 16px;">❌ {{ errorMessage }}</div>

        <div *ngIf="booking" class="glass-card" style="margin-top: 20px;">
          <div class="table-container">
            <table>
              <thead><tr><th>Booking ID</th><th>Full Name</th><th>Address</th><th>Receiver</th><th>Receiver Address</th><th>Date</th><th>Current Status</th></tr></thead>
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

          <div class="update-section" style="margin-top: 24px;">
            <h3>Update Status</h3>
            <div class="status-grid">
              <button *ngFor="let s of statuses" class="status-btn" [class.active]="newStatus === s" [class.current]="booking.status === s" (click)="newStatus = s">
                {{ getStatusIcon(s) }} {{ s }}
              </button>
            </div>
            <button class="btn btn-primary" style="margin-top: 16px;" (click)="update()" [disabled]="updating || !newStatus">{{ updating ? 'Updating...' : 'Update Status' }}</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .search-row { display: flex; gap: 12px; } .search-row input { flex: 1; }
    .update-section h3 { font-size: 16px; margin-bottom: 16px; }
    .status-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
    .status-btn {
      padding: 12px; border: 1px solid rgba(255,255,255,0.1); border-radius: 10px;
      background: rgba(255,255,255,0.03); color: #a0a3bd; cursor: pointer; font-size: 13px;
      transition: all 0.2s; text-align: center;
    }
    .status-btn:hover { background: rgba(102,126,234,0.1); border-color: rgba(102,126,234,0.3); color: #fff; }
    .status-btn.active { background: rgba(102,126,234,0.2); border-color: #667eea; color: #fff; }
    .status-btn.current { border-color: #00d4aa; color: #00d4aa; }
  `]
})
export class DeliveryStatusComponent {
  bookingId = '';
  booking: Booking | null = null;
  newStatus = '';
  updating = false;
  successMessage = '';
  errorMessage = '';
  statuses = ['New', 'Scheduled', 'PickedUp', 'Assigned', 'Booked', 'InTransit', 'Delivered', 'Cancelled'];

  constructor(private apiService: ApiService) {}

  getStatusIcon(s: string): string {
    const icons: any = { New: '🆕', Scheduled: '📅', PickedUp: '📤', Assigned: '📋', Booked: '✅', InTransit: '🚚', Delivered: '🎉', Cancelled: '❌' };
    return icons[s] || '📦';
  }

  search(): void {
    this.errorMessage = ''; this.successMessage = ''; this.booking = null;
    this.apiService.getBooking(this.bookingId).subscribe({
      next: (b) => { this.booking = b; this.newStatus = b.status; },
      error: () => { this.errorMessage = 'Booking not found'; }
    });
  }

  update(): void {
    this.errorMessage = ''; this.successMessage = ''; this.updating = true;
    this.apiService.updateStatus(this.bookingId, this.newStatus).subscribe({
      next: (res: any) => { this.updating = false; this.successMessage = res.message; if (res.booking) this.booking = res.booking; },
      error: (err) => { this.updating = false; this.errorMessage = err.error?.message || 'Update failed'; }
    });
  }
}
