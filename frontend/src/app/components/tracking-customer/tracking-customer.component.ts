import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Booking } from '../../models/models';

@Component({
  selector: 'app-tracking-customer',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, RouterLink],
  template: `
    <div class="page-container">
      <app-navbar></app-navbar>

      <main class="main-content">
        <div class="page-header">
          <div>
            <h1>Live Shipment Tracking</h1>
            <p>Monitor real-time courier milestones, delivery route, and status updates</p>
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
                placeholder="Enter Booking ID (e.g. BKG00001)..." 
                (keyup.enter)="search()"
              />
            </div>
            <button class="btn btn-primary btn-lg" (click)="search()" [disabled]="searching">
              <span *ngIf="searching" class="spinner-sm"></span>
              <span>{{ searching ? 'Searching...' : 'Track Parcel' }}</span>
            </button>
          </div>
        </div>

        <div *ngIf="errorMessage" class="alert alert-error" style="margin-top: 16px;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          <span>{{ errorMessage }}</span>
        </div>

        <!-- Tracking Results View -->
        <div *ngIf="booking" class="tracking-result-wrap" style="margin-top: 20px;">
          <!-- Top Overview Card -->
          <div class="card status-overview-card">
            <div class="overview-header">
              <div>
                <span class="tracking-num-label">Booking Reference</span>
                <h2 class="font-mono tracking-id">{{ booking.bookingId }}</h2>
              </div>
              <div class="status-badge-wrap">
                <span class="badge" [ngClass]="'badge-' + booking.status.toLowerCase().replace(' ', '')">
                  {{ booking.status }}
                </span>
              </div>
            </div>

            <!-- Route Summary Header -->
            <div class="route-strip">
              <div class="route-point">
                <div class="route-dot origin"></div>
                <div class="route-details">
                  <span class="route-lbl">Sender Origin</span>
                  <strong>{{ booking.senderName }}</strong>
                  <span class="route-addr">{{ booking.senderAddress }}</span>
                </div>
              </div>

              <div class="route-connector">
                <div class="connector-line"></div>
                <span class="transport-badge">{{ booking.parcelDeliveryType }}</span>
              </div>

              <div class="route-point">
                <div class="route-dot destination"></div>
                <div class="route-details">
                  <span class="route-lbl">Delivery Destination</span>
                  <strong>{{ booking.receiverName }}</strong>
                  <span class="route-addr">{{ booking.receiverAddress }} (PIN: {{ booking.receiverPin }})</span>
                </div>
              </div>
            </div>

            <!-- Multi-Stage Stepper / Timeline -->
            <div class="stepper-section">
              <div class="stepper-header">Delivery Milestone Progress</div>
              
              <div *ngIf="booking.status === 'Cancelled'" class="cancelled-alert">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                <span>This booking has been cancelled. Refund is in process.</span>
              </div>

              <div *ngIf="booking.status !== 'Cancelled'" class="stepper-track">
                <div 
                  *ngFor="let s of statuses; let idx = index" 
                  class="step-item"
                  [class.completed]="isStatusPassed(s)"
                  [class.current]="booking.status === s"
                >
                  <div class="step-marker">
                    <svg *ngIf="isStatusPassed(s)" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    <span *ngIf="!isStatusPassed(s)">{{ idx + 1 }}</span>
                  </div>
                  <span class="step-name">{{ formatStatusLabel(s) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Package Details Grid -->
          <div class="card details-grid-card" style="margin-top: 20px;">
            <h3>Shipment Specifications</h3>
            
            <div class="spec-grid">
              <div class="spec-item">
                <span class="spec-label">Weight</span>
                <strong>{{ booking.parcelWeightInGram }} grams</strong>
              </div>
              <div class="spec-item">
                <span class="spec-label">Contents</span>
                <strong>{{ booking.parcelContentsDescription }}</strong>
              </div>
              <div class="spec-item">
                <span class="spec-label">Delivery Mode</span>
                <strong>{{ booking.parcelDeliveryType }}</strong>
              </div>
              <div class="spec-item">
                <span class="spec-label">Packaging</span>
                <strong>{{ booking.parcelPackingPreference }}</strong>
              </div>
              <div class="spec-item">
                <span class="spec-label">Booking Date</span>
                <strong>{{ booking.bookingDate }}</strong>
              </div>
              <div class="spec-item">
                <span class="spec-label">Total Amount</span>
                <strong class="text-success">₹{{ booking.parcelServiceCost }}</strong>
              </div>
            </div>

            <!-- Quick Action Links -->
            <div class="tracking-action-bar">
              <a [routerLink]="'/customer/invoice/' + booking.bookingId" class="btn btn-secondary btn-sm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                View Tax Invoice
              </a>

              <a *ngIf="booking.status === 'New'" [routerLink]="'/customer/payment/' + booking.bookingId" class="btn btn-primary btn-sm">
                Pay Now
              </a>

              <a *ngIf="booking.status === 'Booked'" routerLink="/customer/cancel" class="btn btn-outline-danger btn-sm">
                Cancel Shipment
              </a>

              <a *ngIf="booking.status === 'Delivered'" routerLink="/customer/feedback" class="btn btn-success btn-sm">
                Rate & Give Feedback
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .search-card {
      padding: 20px;
    }

    .search-input-group {
      display: flex;
      gap: 12px;
    }

    .input-with-icon {
      flex: 1;
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-icon {
      position: absolute;
      left: 14px;
      color: var(--text-muted);
    }

    .track-input {
      padding-left: 42px;
      font-size: 14.5px;
    }

    .status-overview-card {
      padding: 28px;
    }

    .overview-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--border-subtle);
      flex-wrap: wrap;
      gap: 12px;
    }

    .tracking-num-label {
      font-size: 11px;
      font-weight: 700;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .tracking-id {
      font-size: 22px;
      font-weight: 800;
      color: var(--text-primary);
    }

    /* Route Strip */
    .route-strip {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px 0;
      border-bottom: 1px solid var(--border-subtle);
      gap: 20px;
      flex-wrap: wrap;
    }

    .route-point {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      max-width: 320px;
    }

    .route-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      margin-top: 4px;
      flex-shrink: 0;
    }

    .route-dot.origin {
      background: var(--primary);
      box-shadow: 0 0 10px rgba(37, 99, 235, 0.6);
    }

    .route-dot.destination {
      background: var(--success);
      box-shadow: 0 0 10px rgba(16, 185, 129, 0.6);
    }

    .route-details {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .route-lbl {
      font-size: 11px;
      font-weight: 700;
      color: var(--text-muted);
      text-transform: uppercase;
    }

    .route-details strong {
      font-size: 14px;
      color: var(--text-primary);
    }

    .route-addr {
      font-size: 12px;
      color: var(--text-secondary);
      line-height: 1.4;
    }

    .route-connector {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      min-width: 120px;
    }

    .connector-line {
      width: 100%;
      height: 2px;
      background: dashed var(--border-default);
      position: relative;
      border-top: 2px dashed var(--border-hover);
    }

    .transport-badge {
      font-size: 11px;
      font-weight: 600;
      color: var(--primary);
      background: var(--primary-subtle);
      padding: 2px 10px;
      border-radius: var(--radius-full);
      margin-top: 8px;
    }

    /* Stepper Track */
    .stepper-section {
      padding-top: 24px;
    }

    .stepper-header {
      font-size: 12.5px;
      font-weight: 700;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 20px;
    }

    .stepper-track {
      display: flex;
      justify-content: space-between;
      position: relative;
      overflow-x: auto;
      padding-bottom: 8px;
    }

    .step-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;
      min-width: 75px;
      position: relative;
      text-align: center;
    }

    .step-marker {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: var(--bg-surface-raised);
      border: 2px solid var(--border-default);
      color: var(--text-muted);
      font-size: 11px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 8px;
      z-index: 2;
      transition: all var(--transition-fast);
    }

    .step-item.completed .step-marker {
      background: var(--primary);
      border-color: var(--primary);
      color: #fff;
    }

    .step-item.current .step-marker {
      background: var(--success);
      border-color: var(--success);
      color: #fff;
      box-shadow: 0 0 14px rgba(16, 185, 129, 0.5);
    }

    .step-name {
      font-size: 11.5px;
      font-weight: 600;
      color: var(--text-muted);
      line-height: 1.2;
    }

    .step-item.completed .step-name {
      color: var(--text-secondary);
    }

    .step-item.current .step-name {
      color: #34d399;
      font-weight: 700;
    }

    .cancelled-alert {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 16px;
      background: var(--danger-bg);
      border: 1px solid var(--danger-border);
      border-radius: var(--radius-md);
      color: #f87171;
      font-size: 13.5px;
    }

    /* Specifications Card */
    .details-grid-card {
      padding: 24px;
    }

    .details-grid-card h3 {
      font-size: 15px;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 18px;
    }

    .spec-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }

    .spec-item {
      background: var(--bg-input);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-md);
      padding: 12px 14px;
    }

    .spec-label {
      display: block;
      font-size: 11px;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      margin-bottom: 2px;
    }

    .spec-item strong {
      font-size: 13.5px;
      color: var(--text-primary);
    }

    .tracking-action-bar {
      display: flex;
      gap: 10px;
      margin-top: 20px;
      padding-top: 18px;
      border-top: 1px solid var(--border-subtle);
      flex-wrap: wrap;
    }

    .spinner-sm {
      display: inline-block;
      width: 14px;
      height: 14px;
      border: 2px solid rgba(255, 255, 255, 0.2);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.75s linear infinite;
    }

    @media (max-width: 768px) {
      .route-strip { flex-direction: column; align-items: flex-start; }
      .route-connector { width: 100%; align-items: flex-start; }
      .spec-grid { grid-template-columns: 1fr; }
      .search-input-group { flex-direction: column; }
    }
  `]
})
export class TrackingCustomerComponent implements OnInit {
  bookingId = '';
  booking: Booking | null = null;
  searching = false;
  errorMessage = '';

  statuses = ['New', 'Scheduled', 'PickedUp', 'Assigned', 'Booked', 'InTransit', 'Delivered'];

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Check if passed via query params
    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        this.bookingId = params['id'];
        this.search();
      }
    });
  }

  formatStatusLabel(s: string): string {
    const map: any = {
      New: 'Created',
      Scheduled: 'Scheduled',
      PickedUp: 'Picked Up',
      Assigned: 'Assigned',
      Booked: 'Confirmed',
      InTransit: 'In Transit',
      Delivered: 'Delivered'
    };
    return map[s] || s;
  }

  isStatusPassed(status: string): boolean {
    if (!this.booking) return false;
    const currentIdx = this.statuses.indexOf(this.booking.status);
    const targetIdx = this.statuses.indexOf(status);
    return targetIdx <= currentIdx;
  }

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
        if (b.customerId === this.authService.getCustomerId()) {
          this.booking = b;
        } else {
          this.errorMessage = 'No booking found under your customer account matching this ID.';
        }
      },
      error: () => {
        this.searching = false;
        this.errorMessage = 'Shipment not found. Please verify the Booking ID.';
      }
    });
  }
}
