import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { ApiService } from '../../services/api.service';
import { Booking } from '../../models/models';

@Component({
  selector: 'app-tracking-officer',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, RouterLink],
  template: `
    <div class="page-container">
      <app-navbar></app-navbar>

      <main class="main-content">
        <div class="page-header">
          <div>
            <div class="role-badge role-officer" style="margin-bottom: 8px;">Global Search</div>
            <h1>Track Any Parcel (Officer)</h1>
            <p>Look up full telemetry and dispatch status for any shipment in the system</p>
          </div>
        </div>

        <!-- Search Card -->
        <div class="card search-card">
          <div class="search-input-group">
            <div class="input-with-icon">
              <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
              </svg>
              <input 
                type="text" 
                class="form-control track-input" 
                [(ngModel)]="bookingId" 
                placeholder="Enter any Booking ID (e.g. BKG00001)..." 
                (keyup.enter)="search()"
              />
            </div>
            <button class="btn btn-primary btn-lg" (click)="search()" [disabled]="searching">
              <span *ngIf="searching" class="spinner-sm"></span>
              <span>{{ searching ? 'Querying...' : 'Lookup Booking' }}</span>
            </button>
          </div>
        </div>

        <div *ngIf="errorMessage" class="alert alert-error" style="margin-top: 16px;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          <span>{{ errorMessage }}</span>
        </div>

        <!-- Result Overview -->
        <div *ngIf="booking" class="tracking-result-wrap" style="margin-top: 20px;">
          <div class="card status-overview-card">
            <div class="overview-header">
              <div>
                <span class="tracking-num-label">System Booking Reference</span>
                <h2 class="font-mono tracking-id">{{ booking.bookingId }}</h2>
              </div>
              <div class="status-badge-wrap">
                <span class="badge" [ngClass]="'badge-' + booking.status.toLowerCase().replace(' ', '')">
                  {{ booking.status }}
                </span>
              </div>
            </div>

            <!-- Route Strip -->
            <div class="route-strip">
              <div class="route-point">
                <div class="route-dot origin"></div>
                <div class="route-details">
                  <span class="route-lbl">Sender / Customer Account</span>
                  <strong>{{ booking.senderName }} ({{ booking.customerId }})</strong>
                  <span class="route-addr">{{ booking.senderAddress }} | {{ booking.senderContact }}</span>
                </div>
              </div>

              <div class="route-connector">
                <div class="connector-line"></div>
                <span class="transport-badge">{{ booking.parcelDeliveryType }}</span>
              </div>

              <div class="route-point">
                <div class="route-dot destination"></div>
                <div class="route-details">
                  <span class="route-lbl">Recipient Destination</span>
                  <strong>{{ booking.receiverName }}</strong>
                  <span class="route-addr">{{ booking.receiverAddress }} (PIN: {{ booking.receiverPin }})</span>
                </div>
              </div>
            </div>

            <!-- Specifications Table -->
            <div class="spec-grid" style="margin-top: 20px;">
              <div class="spec-item">
                <span class="spec-label">Weight</span>
                <strong>{{ booking.parcelWeightInGram }}g</strong>
              </div>
              <div class="spec-item">
                <span class="spec-label">Contents</span>
                <strong>{{ booking.parcelContentsDescription }}</strong>
              </div>
              <div class="spec-item">
                <span class="spec-label">Packing</span>
                <strong>{{ booking.parcelPackingPreference }}</strong>
              </div>
              <div class="spec-item">
                <span class="spec-label">Pickup Time</span>
                <strong>{{ booking.parcelPickupTime || '-' }}</strong>
              </div>
              <div class="spec-item">
                <span class="spec-label">Drop-off Time</span>
                <strong>{{ booking.parcelDropoffTime || '-' }}</strong>
              </div>
              <div class="spec-item">
                <span class="spec-label">Service Cost</span>
                <strong class="text-success">₹{{ booking.parcelServiceCost }}</strong>
              </div>
            </div>

            <!-- Officer Action Buttons -->
            <div class="officer-actions-row">
              <a routerLink="/officer/delivery-status" class="btn btn-primary btn-sm">
                🚚 Update Status
              </a>
              <a routerLink="/officer/pickup-schedule" class="btn btn-secondary btn-sm">
                📅 Update Schedule
              </a>
              <a [routerLink]="'/officer/invoice/' + booking.bookingId" class="btn btn-secondary btn-sm">
                📄 View Invoice
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .search-card { padding: 20px; }
    .search-input-group { display: flex; gap: 12px; }
    .input-with-icon { flex: 1; position: relative; display: flex; align-items: center; }
    .search-icon { position: absolute; left: 14px; color: var(--text-muted); }
    .track-input { padding-left: 42px; font-size: 14.5px; }
    .status-overview-card { padding: 28px; }
    .overview-header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 20px; border-bottom: 1px solid var(--border-subtle); flex-wrap: wrap; gap: 12px; }
    .tracking-num-label { font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
    .tracking-id { font-size: 22px; font-weight: 800; color: var(--text-primary); }
    .route-strip { display: flex; justify-content: space-between; align-items: center; padding: 24px 0; border-bottom: 1px solid var(--border-subtle); gap: 20px; flex-wrap: wrap; }
    .route-point { display: flex; align-items: flex-start; gap: 12px; max-width: 340px; }
    .route-dot { width: 12px; height: 12px; border-radius: 50%; margin-top: 4px; flex-shrink: 0; }
    .route-dot.origin { background: var(--primary); box-shadow: 0 0 10px rgba(37, 99, 235, 0.6); }
    .route-dot.destination { background: var(--success); box-shadow: 0 0 10px rgba(16, 185, 129, 0.6); }
    .route-details { display: flex; flex-direction: column; gap: 2px; }
    .route-lbl { font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; }
    .route-details strong { font-size: 14px; color: var(--text-primary); }
    .route-addr { font-size: 12px; color: var(--text-secondary); line-height: 1.4; }
    .route-connector { flex: 1; display: flex; flex-direction: column; align-items: center; min-width: 120px; }
    .connector-line { width: 100%; height: 2px; border-top: 2px dashed var(--border-hover); }
    .transport-badge { font-size: 11px; font-weight: 600; color: var(--primary); background: var(--primary-subtle); padding: 2px 10px; border-radius: var(--radius-full); margin-top: 8px; }
    .spec-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
    .spec-item { background: var(--bg-input); border: 1px solid var(--border-default); border-radius: var(--radius-md); padding: 12px 14px; }
    .spec-label { display: block; font-size: 11px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; margin-bottom: 2px; }
    .spec-item strong { font-size: 13.5px; color: var(--text-primary); }
    .officer-actions-row { display: flex; gap: 10px; margin-top: 24px; padding-top: 18px; border-top: 1px solid var(--border-subtle); flex-wrap: wrap; }
    .spinner-sm { display: inline-block; width: 14px; height: 14px; border: 2px solid rgba(255, 255, 255, 0.2); border-top-color: #fff; border-radius: 50%; animation: spin 0.75s linear infinite; }
    @media (max-width: 768px) {
      .route-strip { flex-direction: column; align-items: flex-start; }
      .route-connector { width: 100%; align-items: flex-start; }
      .spec-grid { grid-template-columns: 1fr; }
      .search-input-group { flex-direction: column; }
    }
  `]
})
export class TrackingOfficerComponent {
  bookingId = '';
  booking: Booking | null = null;
  searching = false;
  errorMessage = '';

  constructor(private apiService: ApiService) {}

  search(): void {
    this.errorMessage = '';
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
      },
      error: () => {
        this.searching = false;
        this.errorMessage = 'No booking found matching this ID in the system.';
      }
    });
  }
}
