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

      <main class="main-content">
        <div class="page-header">
          <div>
            <div class="role-badge" [ngClass]="isOfficer ? 'role-officer' : 'role-customer'" style="margin-bottom: 8px;">
              {{ isOfficer ? 'Officer Refund Desk' : 'Customer Self-Service' }}
            </div>
            <h1>Cancel Parcel Shipment</h1>
            <p>{{ isOfficer ? 'Process customer cancellation requests and initialize automatic refund dispatch' : 'Cancel an unfulfilled parcel booking and initiate a full refund' }}</p>
          </div>
        </div>

        <!-- Success Notification -->
        <div *ngIf="successMessage" class="alert alert-success">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          <div>
            <strong>{{ successMessage }}</strong>
            <div *ngIf="cancelledBookingId" style="margin-top: 4px; font-size: 12.5px;">
              Cancelled Reference: <strong class="font-mono">{{ cancelledBookingId }}</strong>
              <span *ngIf="cancelledAmount"> | Refund Credit: <strong>₹{{ cancelledAmount }}</strong></span>
            </div>
          </div>
        </div>

        <div *ngIf="errorMessage" class="alert alert-error">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          <span>{{ errorMessage }}</span>
        </div>

        <!-- Policy Disclosure Card -->
        <div class="card policy-card">
          <div class="policy-header">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            <strong>Cancellation & Refund Policy Guidelines:</strong>
          </div>
          <p>
            {{ isOfficer 
                ? 'Officers can cancel any booking in New, Scheduled, Picked Up, Assigned, or Booked state. Parcels marked as In Transit or Delivered cannot be cancelled.' 
                : 'Customers can cancel parcels with status "Booked" before transit begins. Cancelled amounts are credited to the original source card within 5 working days.' }}
          </p>
        </div>

        <!-- Search Bar -->
        <div class="card search-card" style="margin-top: 20px;">
          <h3 class="section-title">Lookup Booking to Cancel</h3>
          <div class="search-row">
            <input 
              type="text" 
              class="form-control" 
              [(ngModel)]="searchQuery" 
              [placeholder]="isOfficer ? 'Enter Booking ID, Customer ID, or Sender Name...' : 'Enter your Booking ID (e.g. BKG00001)...'"
              (keyup.enter)="searchBooking()"
            />
            <button class="btn btn-primary btn-lg" (click)="searchBooking()" [disabled]="searching">
              <span *ngIf="searching" class="spinner-sm"></span>
              <span>{{ searching ? 'Searching...' : 'Search Shipment' }}</span>
            </button>
          </div>
        </div>

        <!-- Results Table -->
        <div *ngIf="searchResults.length > 0" class="card table-card" style="margin-top: 20px;">
          <h3 class="section-title">Matching Shipments</h3>
          
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Customer</th>
                  <th>Sender</th>
                  <th>Receiver</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let b of searchResults">
                  <td><strong class="font-mono">{{ b.bookingId }}</strong></td>
                  <td><span class="font-mono text-muted">{{ b.customerId }}</span></td>
                  <td>{{ b.senderName }}</td>
                  <td>{{ b.receiverName }}</td>
                  <td>{{ b.bookingDate }}</td>
                  <td><strong class="text-success">₹{{ b.parcelServiceCost }}</strong></td>
                  <td>
                    <span class="badge" [ngClass]="'badge-' + b.status.toLowerCase().replace(' ', '')">
                      {{ b.status }}
                    </span>
                  </td>
                  <td>
                    <button *ngIf="canCancel(b)" class="btn btn-sm btn-outline-danger" (click)="confirmCancel(b)" [disabled]="cancelling">
                      ✕ Cancel Booking
                    </button>
                    <span *ngIf="!canCancel(b)" class="reason-badge">
                      {{ getCancelDisabledReason(b) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 2-Step Confirmation Modal -->
        <div *ngIf="showConfirmModal" class="modal-overlay" (click)="showConfirmModal = false">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h3 style="color: #f87171;">Confirm Booking Cancellation</h3>
              <button class="btn btn-secondary btn-sm" (click)="showConfirmModal = false">✕</button>
            </div>

            <p style="color: var(--text-secondary); font-size: 13.5px; margin-bottom: 16px;">
              Are you sure you want to cancel booking <strong class="font-mono" style="color: var(--text-primary);">{{ targetBooking?.bookingId }}</strong>?
            </p>

            <div class="cancel-summary-box" *ngIf="targetBooking">
              <div class="cancel-row">
                <span>Receiver:</span>
                <strong>{{ targetBooking.receiverName }}</strong>
              </div>
              <div class="cancel-row">
                <span>Refund Amount:</span>
                <strong class="text-success">₹{{ targetBooking.parcelServiceCost }}</strong>
              </div>
              <div class="cancel-row">
                <span>Refund Timeline:</span>
                <span>Credited to source card within 5 working days</span>
              </div>
            </div>

            <div class="modal-actions">
              <button class="btn btn-secondary" (click)="showConfirmModal = false">Keep Shipment</button>
              <button class="btn btn-danger" (click)="executeCancel()" [disabled]="cancelling">
                <span *ngIf="cancelling" class="spinner-sm"></span>
                <span>{{ cancelling ? 'Cancelling...' : 'Yes, Confirm Cancellation' }}</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .policy-card {
      padding: 16px 20px;
      background: rgba(37, 99, 235, 0.06);
      border: 1px solid var(--primary-border);
    }
    .policy-header {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #60a5fa;
      font-size: 13px;
      margin-bottom: 6px;
    }
    .policy-card p {
      font-size: 12.5px;
      color: var(--text-secondary);
      line-height: 1.5;
    }
    .search-card { padding: 20px; }
    .section-title { font-size: 15px; font-weight: 700; color: var(--text-primary); margin-bottom: 14px; }
    .search-row { display: flex; gap: 12px; }
    .table-card { padding: 20px; }
    .reason-badge { font-size: 11.5px; color: var(--text-muted); font-style: italic; }
    .cancel-summary-box { background: var(--bg-input); border: 1px solid var(--danger-border); border-radius: var(--radius-md); padding: 16px; margin-bottom: 20px; }
    .cancel-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; color: var(--text-secondary); }
    .cancel-row strong { color: var(--text-primary); }
    .spinner-sm { display: inline-block; width: 14px; height: 14px; border: 2px solid rgba(255, 255, 255, 0.2); border-top-color: #fff; border-radius: 50%; animation: spin 0.75s linear infinite; }
    @media (max-width: 640px) { .search-row { flex-direction: column; } }
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
      if (b.status === 'Delivered' || b.status === 'InTransit' || b.status === 'Cancelled') {
        return false;
      }
      return true;
    } else {
      return b.status === 'Booked';
    }
  }

  getCancelDisabledReason(b: Booking): string {
    if (b.status === 'Cancelled') return 'Already Cancelled';
    if (b.status === 'Delivered') return 'Delivered — cannot cancel';
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
