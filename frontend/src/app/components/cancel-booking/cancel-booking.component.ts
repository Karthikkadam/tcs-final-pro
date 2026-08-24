import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Booking } from '../../models/models';

@Component({
  selector: 'app-cancel-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, RouterLink],
  template: `
    <div class="page-container">
      <app-navbar></app-navbar>
      <div class="main-content">
        <div class="page-header">
          <h1>Cancel Booking</h1>
          <p>{{ isOfficer ? 'Officer parcel cancellation & refund initiation' : 'Cancel your booked parcel delivery' }}</p>
        </div>

        <div *ngIf="successMessage" class="alert alert-success">
          <div>
            <strong>✅ {{ successMessage }}</strong>
            <div *ngIf="cancelledBookingId" style="margin-top: 6px; font-size: 13px;">
              Cancelled Booking ID: <strong>{{ cancelledBookingId }}</strong>
              <span *ngIf="cancelledAmount"> | Refund Amount: <strong>₹{{ cancelledAmount }}</strong></span>
            </div>
          </div>
        </div>

        <div *ngIf="errorMessage" class="alert alert-error">❌ {{ errorMessage }}</div>

        <!-- Search Card -->
        <div class="glass-card search-card">
          <h3 class="section-title">🔍 Search Booking to Cancel</h3>
          <div class="search-row">
            <input type="text" class="form-control" [(ngModel)]="searchQuery" 
                   [placeholder]="isOfficer ? 'Enter Booking ID, Customer ID, or Sender Name' : 'Enter Booking ID (e.g. BKG00001)'">
            <button class="btn btn-primary" (click)="searchBooking()" [disabled]="searching">
              {{ searching ? 'Searching...' : 'Search' }}
            </button>
          </div>
        </div>

        <!-- Search Results / Selected Booking -->
        <div *ngIf="searchResults.length > 0" class="glass-card result-card" style="margin-top: 20px;">
          <h3 class="section-title">📋 Matching Bookings</h3>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Customer ID</th>
                  <th>Sender</th>
                  <th>Receiver</th>
                  <th>Booking Date</th>
                  <th>Amount</th>
                  <th>Current Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let b of searchResults">
                  <td><strong>{{ b.bookingId }}</strong></td>
                  <td>{{ b.customerId }}</td>
                  <td>{{ b.senderName }}</td>
                  <td>{{ b.receiverName }}</td>
                  <td>{{ b.bookingDate }}</td>
                  <td>₹{{ b.parcelServiceCost }}</td>
                  <td>
                    <span class="badge" [ngClass]="'badge-' + b.status.toLowerCase().replace(' ', '')">{{ b.status }}</span>
                  </td>
                  <td>
                    <button *ngIf="canCancel(b)" class="btn btn-sm btn-danger" (click)="confirmCancel(b)" [disabled]="cancelling">
                      ✕ Cancel Booking
                    </button>
                    <span *ngIf="!canCancel(b)" class="text-muted" style="font-size: 12px;">
                      {{ getCancelDisabledReason(b) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Cancellation Confirmation Modal -->
        <div *ngIf="showConfirmModal" class="modal-overlay" (click)="showConfirmModal = false">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h3 style="color: #ff6b6b;">⚠️ Confirm Cancellation</h3>
              <button class="btn btn-sm btn-secondary" (click)="showConfirmModal = false">✕</button>
            </div>

            <p style="color: #a0a3bd; font-size: 14px; margin-bottom: 16px;">
              Are you sure you want to cancel booking <strong>{{ targetBooking?.bookingId }}</strong>?
            </p>

            <div class="details-summary" *ngIf="targetBooking">
              <div class="summary-row"><span>Receiver:</span><strong>{{ targetBooking.receiverName }}</strong></div>
              <div class="summary-row"><span>Amount:</span><strong>₹{{ targetBooking.parcelServiceCost }}</strong></div>
              <div class="summary-row"><span>Delivery Type:</span><strong>{{ targetBooking.parcelDeliveryType }}</strong></div>
              <div class="summary-row" *ngIf="isOfficer"><span style="color: #00d4aa;">Refund Policy:</span><span>Refund processed within 5 working days</span></div>
            </div>

            <div class="modal-actions">
              <button class="btn btn-secondary" (click)="showConfirmModal = false">No, Keep It</button>
              <button class="btn btn-danger" (click)="executeCancel()" [disabled]="cancelling">
                {{ cancelling ? 'Cancelling...' : 'Yes, Cancel Booking' }}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .section-title { font-size: 16px; margin-bottom: 16px; }
    .search-row { display: flex; gap: 12px; }
    .search-row input { flex: 1; }
    .details-summary { background: rgba(255, 107, 107, 0.05); border: 1px solid rgba(255, 107, 107, 0.2); border-radius: 10px; padding: 16px; margin-bottom: 20px; }
    .summary-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; color: #a0a3bd; }
    .summary-row strong { color: #fff; }
  `]
})
export class CancelBookingComponent implements OnInit {
  searchQuery = '';
  searchResults: Booking[] = [];
  targetBooking: Booking | null = null;
  showConfirmModal = false;

  searching = false;
  cancelling = false;
  successMessage = '';
  errorMessage = '';
  cancelledBookingId = '';
  cancelledAmount: number | null = null;

  isOfficer = false;

  constructor(private apiService: ApiService, public authService: AuthService) {}

  ngOnInit(): void {
    this.isOfficer = this.authService.getRole() === 'OFFICER';
  }

  searchBooking(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.searchResults = [];
    const query = this.searchQuery.trim().toLowerCase();

    if (!query) {
      this.errorMessage = 'Please enter a search value';
      return;
    }

    this.searching = true;
    if (this.isOfficer) {
      this.apiService.getAllBookings().subscribe({
        next: (all) => {
          this.searching = false;
          this.searchResults = all.filter(b => 
            b.bookingId.toLowerCase().includes(query) ||
            b.customerId.toLowerCase().includes(query) ||
            b.senderName.toLowerCase().includes(query)
          );
          if (this.searchResults.length === 0) {
            this.errorMessage = 'Booking cancel failed. No matching bookings found.';
          }
        },
        error: () => {
          this.searching = false;
          this.errorMessage = 'Booking cancel failed';
        }
      });
    } else {
      const custId = this.authService.getCustomerId();
      this.apiService.getCustomerBookings(custId).subscribe({
        next: (userBookings) => {
          this.searching = false;
          this.searchResults = userBookings.filter(b => b.bookingId.toLowerCase() === query);
          if (this.searchResults.length === 0) {
            this.errorMessage = 'Booking cancel failed, incorrect Booking ID';
          }
        },
        error: () => {
          this.searching = false;
          this.errorMessage = 'Booking cancel failed, incorrect Booking ID';
        }
      });
    }
  }

  canCancel(b: Booking): boolean {
    if (this.isOfficer) {
      // Officer cannot cancel Delivered or InTransit
      if (b.status === 'Delivered' || b.status === 'InTransit' || b.status === 'Cancelled') {
        return false;
      }
      return true;
    } else {
      // Customer can only cancel 'Booked' status
      return b.status === 'Booked';
    }
  }

  getCancelDisabledReason(b: Booking): string {
    if (b.status === 'Cancelled') return 'Already Cancelled';
    if (b.status === 'Delivered') return 'Cannot cancel delivered parcel';
    if (b.status === 'InTransit') return 'In Transit — cannot cancel';
    if (!this.isOfficer && b.status !== 'Booked') return `Status is ${b.status} (only Booked can be cancelled)`;
    return 'Not cancellable';
  }

  confirmCancel(b: Booking): void {
    this.targetBooking = b;
    this.showConfirmModal = true;
  }

  executeCancel(): void {
    if (!this.targetBooking) return;

    this.cancelling = true;
    this.errorMessage = '';
    this.successMessage = '';

    const role = this.authService.getRole();
    const custId = this.authService.getCustomerId();

    this.apiService.cancelBooking(this.targetBooking.bookingId, custId, role).subscribe({
      next: (res: any) => {
        this.cancelling = false;
        this.showConfirmModal = false;
        this.cancelledBookingId = res.bookingId || this.targetBooking?.bookingId || '';
        this.cancelledAmount = res.amount || this.targetBooking?.parcelServiceCost || null;
        this.successMessage = res.message || 'Booking cancelled successfully';
        if (this.targetBooking) {
          this.targetBooking.status = 'Cancelled';
        }
      },
      error: (err) => {
        this.cancelling = false;
        this.showConfirmModal = false;
        this.errorMessage = err.error?.message || (this.isOfficer ? 'Booking cancel failed' : 'Booking cancel failed, incorrect Booking ID');
      }
    });
  }
}
