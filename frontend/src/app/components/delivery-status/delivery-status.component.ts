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

      <main class="main-content">
        <div class="page-header">
          <div>
            <div class="role-badge role-officer" style="margin-bottom: 8px;">Dispatch Operations</div>
            <h1>Update Delivery Status</h1>
            <p>Advance or adjust the shipment milestone for any booked parcel</p>
          </div>
        </div>

        <!-- Search Card -->
        <div class="card search-card">
          <div class="search-input-group">
            <input 
              type="text" 
              class="form-control" 
              [(ngModel)]="bookingId" 
              placeholder="Enter Booking ID to update (e.g. BKG00001)..."
              (keyup.enter)="search()"
            />
            <button class="btn btn-primary btn-lg" (click)="search()" [disabled]="searching">
              <span *ngIf="searching" class="spinner-sm"></span>
              <span>{{ searching ? 'Finding...' : 'Find Shipment' }}</span>
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

        <!-- Booking Details & Status Selector -->
        <div *ngIf="booking" class="card status-editor-card" style="margin-top: 20px;">
          <div class="card-header-bar">
            <div>
              <span class="booking-label">Current Shipment</span>
              <h2 class="font-mono">{{ booking.bookingId }}</h2>
            </div>
            <div>
              <span class="badge" [ngClass]="'badge-' + booking.status.toLowerCase().replace(' ', '')">
                Current: {{ booking.status }}
              </span>
            </div>
          </div>

          <div class="table-container" style="margin: 18px 0 24px;">
            <table>
              <thead>
                <tr>
                  <th>Customer ID</th>
                  <th>Sender</th>
                  <th>Receiver</th>
                  <th>Delivery Address</th>
                  <th>Date</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{{ booking.customerId }}</td>
                  <td>{{ booking.senderName }}</td>
                  <td>{{ booking.receiverName }}</td>
                  <td>{{ booking.receiverAddress }}</td>
                  <td>{{ booking.bookingDate }}</td>
                  <td><strong class="text-success">₹{{ booking.parcelServiceCost }}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Status Selector Grid -->
          <div class="status-selection-section">
            <label class="section-sublabel">Select New Milestone Status:</label>
            
            <div class="status-cards-grid">
              <div 
                *ngFor="let s of statuses" 
                class="status-choice-card"
                [class.selected]="newStatus === s"
                [class.current]="booking.status === s"
                (click)="newStatus = s"
              >
                <div class="status-choice-indicator"></div>
                <div class="status-choice-text">
                  <strong>{{ s }}</strong>
                  <span *ngIf="booking.status === s" class="current-tag">Current Status</span>
                </div>
              </div>
            </div>

            <div class="update-action-row">
              <button 
                class="btn btn-primary btn-lg" 
                (click)="update()" 
                [disabled]="updating || !newStatus || newStatus === booking.status"
              >
                <span *ngIf="updating" class="spinner-sm"></span>
                <span>{{ updating ? 'Updating Status...' : 'Apply Status Update' }}</span>
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
    .status-editor-card { padding: 24px; }
    .card-header-bar { display: flex; justify-content: space-between; align-items: center; padding-bottom: 16px; border-bottom: 1px solid var(--border-subtle); flex-wrap: wrap; gap: 12px; }
    .booking-label { font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; }
    .card-header-bar h2 { font-size: 20px; font-weight: 800; color: var(--text-primary); }
    .section-sublabel { display: block; font-size: 13px; font-weight: 700; color: var(--text-secondary); margin-bottom: 12px; }
    .status-cards-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
    .status-choice-card {
      background: var(--bg-input);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-md);
      padding: 14px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 12px;
      transition: all var(--transition-fast);
    }
    .status-choice-card:hover { background: var(--bg-surface-raised); border-color: var(--border-hover); }
    .status-choice-card.selected { border-color: var(--primary); background: var(--primary-subtle); box-shadow: 0 0 0 1px var(--primary); }
    .status-choice-card.current { border-color: var(--success-border); }
    .status-choice-indicator { width: 10px; height: 10px; border-radius: 50%; background: var(--border-default); }
    .status-choice-card.selected .status-choice-indicator { background: var(--primary); box-shadow: 0 0 8px var(--primary); }
    .status-choice-card.current .status-choice-indicator { background: var(--success); }
    .status-choice-text strong { display: block; font-size: 13px; color: var(--text-primary); }
    .current-tag { font-size: 10.5px; color: #34d399; font-weight: 600; }
    .update-action-row { display: flex; justify-content: flex-end; }
    .spinner-sm { display: inline-block; width: 14px; height: 14px; border: 2px solid rgba(255, 255, 255, 0.2); border-top-color: #fff; border-radius: 50%; animation: spin 0.75s linear infinite; }
    @media (max-width: 992px) { .status-cards-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 640px) { .status-cards-grid { grid-template-columns: 1fr; } .search-input-group { flex-direction: column; } }
  `]
})
export class DeliveryStatusComponent {
  bookingId = '';
  booking: Booking | null = null;
  newStatus = '';
  searching = false;
  updating = false;
  successMessage = '';
  errorMessage = '';

  statuses = ['New', 'Scheduled', 'PickedUp', 'Assigned', 'Booked', 'InTransit', 'Delivered', 'Cancelled'];

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
        this.newStatus = b.status;
      },
      error: () => {
        this.searching = false;
        this.errorMessage = 'Booking not found. Please verify the ID.';
      }
    });
  }

  update(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.updating = true;

    this.apiService.updateStatus(this.bookingId, this.newStatus).subscribe({
      next: (res: any) => {
        this.updating = false;
        this.successMessage = res.message || 'Status successfully updated!';
        if (res.booking) {
          this.booking = res.booking;
        } else if (this.booking) {
          this.booking.status = this.newStatus;
        }
      },
      error: (err) => {
        this.updating = false;
        this.errorMessage = err.error?.message || 'Status update failed';
      }
    });
  }
}
