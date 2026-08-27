import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  template: `
    <div class="page-container">
      <app-navbar></app-navbar>

      <main class="main-content">
        <!-- Page Header -->
        <div class="page-header">
          <div>
            <h1>Book Parcel Delivery</h1>
            <p>Schedule doorstep parcel pickup and generate instant delivery quotes</p>
          </div>
        </div>

        <!-- Success/Error Alerts -->
        <div *ngIf="errorMessage" class="alert alert-error">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          <span>{{ errorMessage }}</span>
        </div>

        <!-- Confirmation / Success Screen -->
        <div *ngIf="bookingComplete" class="booking-success-card card">
          <div class="success-icon-badge">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <h2>Parcel Booking Confirmed!</h2>
          <p class="success-subtitle">Your shipment has been assigned with initial status <strong>New</strong>.</p>

          <div class="token-card">
            <div class="token-row">
              <span>Booking Reference ID</span>
              <strong class="font-mono">{{ bookingResult.bookingId }}</strong>
            </div>
            <div class="token-row">
              <span>Receiver Name</span>
              <strong>{{ booking.receiverName }}</strong>
            </div>
            <div class="token-row">
              <span>Delivery Type</span>
              <strong>{{ booking.parcelDeliveryType }}</strong>
            </div>
            <div class="token-row">
              <span>Total Service Cost</span>
              <strong class="text-success" style="font-size: 16px;">₹{{ bookingResult.serviceCost || estimatedCost }}</strong>
            </div>
          </div>

          <div class="success-actions">
            <button class="btn btn-primary btn-lg" (click)="goToPayment()">
              Proceed to Secure Payment →
            </button>
            <button class="btn btn-secondary btn-lg" (click)="resetBooking()">
              Book Another Parcel
            </button>
          </div>
        </div>

        <!-- Booking Form Layout -->
        <form *ngIf="!bookingComplete" class="booking-layout" (ngSubmit)="onSubmit()">
          <div class="form-main-column">
            <!-- 1. Sender (Read-Only) & Receiver Details -->
            <div class="card form-section-card">
              <div class="section-badge-header">
                <span class="step-badge">1</span>
                <h3>Addresses & Contact Information</h3>
              </div>

              <!-- Sender Card Preview -->
              <div class="sender-preview-box">
                <div class="sender-tag">Sender (Account Holder)</div>
                <div class="sender-info-grid">
                  <div><strong>Name:</strong> {{ authService.getName() }}</div>
                  <div><strong>Contact:</strong> {{ authService.getUser()?.mobile }}</div>
                  <div class="span-2"><strong>Address:</strong> {{ authService.getUser()?.address }}</div>
                </div>
              </div>

              <!-- Receiver Inputs -->
              <div class="form-group" style="margin-top: 18px;">
                <label>Receiver Full Name *</label>
                <input 
                  type="text" 
                  class="form-control" 
                  [(ngModel)]="booking.receiverName" 
                  name="receiverName" 
                  placeholder="Full name of the recipient" 
                  required
                />
              </div>

              <div class="form-group">
                <label>Receiver Complete Address *</label>
                <textarea 
                  class="form-control" 
                  [(ngModel)]="booking.receiverAddress" 
                  name="receiverAddress" 
                  placeholder="Flat/Building, Street, Landmark, City, State" 
                  rows="2"
                  required
                ></textarea>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Receiver PIN / Postal Code *</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    [(ngModel)]="booking.receiverPin" 
                    name="receiverPin" 
                    placeholder="6-digit PIN" 
                    maxlength="6" 
                    required
                  />
                </div>

                <div class="form-group">
                  <label>Receiver Mobile Number *</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    [(ngModel)]="booking.receiverMobile" 
                    name="receiverMobile" 
                    placeholder="10-digit mobile" 
                    maxlength="10" 
                    required
                  />
                </div>
              </div>
            </div>

            <!-- 2. Parcel Specifications -->
            <div class="card form-section-card" style="margin-top: 20px;">
              <div class="section-badge-header">
                <span class="step-badge">2</span>
                <h3>Parcel Specifications & Contents</h3>
              </div>

              <div class="form-group">
                <label>Contents Description *</label>
                <input 
                  type="text" 
                  class="form-control" 
                  [(ngModel)]="booking.parcelContentsDescription" 
                  name="contents" 
                  placeholder="e.g. Electronics, Documents, Garments, Gift box" 
                  required
                />
              </div>

              <div class="form-group">
                <label>Estimated Weight (in Grams) *</label>
                <div class="weight-input-wrap">
                  <input 
                    type="number" 
                    class="form-control" 
                    [(ngModel)]="booking.parcelWeightInGram" 
                    name="weight" 
                    placeholder="e.g. 1500" 
                    min="1" 
                    (ngModelChange)="calculateCost()" 
                    required
                  />
                  <span class="input-unit">grams</span>
                </div>

                <!-- Weight Preset Chips -->
                <div class="weight-presets">
                  <span class="preset-label">Quick Presets:</span>
                  <button type="button" class="preset-chip" (click)="setWeight(500)">500g</button>
                  <button type="button" class="preset-chip" (click)="setWeight(1000)">1 kg</button>
                  <button type="button" class="preset-chip" (click)="setWeight(2500)">2.5 kg</button>
                  <button type="button" class="preset-chip" (click)="setWeight(5000)">5 kg</button>
                </div>
              </div>
            </div>

            <!-- 3. Delivery Speed & Packaging -->
            <div class="card form-section-card" style="margin-top: 20px;">
              <div class="section-badge-header">
                <span class="step-badge">3</span>
                <h3>Delivery Speed & Packaging</h3>
              </div>

              <label style="display: block; font-size: 12.5px; font-weight: 600; color: var(--text-secondary); margin-bottom: 8px;">
                Choose Delivery Speed Option *
              </label>
              <div class="selection-grid delivery-grid">
                <div 
                  class="select-card" 
                  [class.selected]="booking.parcelDeliveryType === 'Standard'"
                  (click)="setDeliveryType('Standard')"
                >
                  <div class="select-header">
                    <strong>Standard Delivery</strong>
                    <span class="select-price">₹30</span>
                  </div>
                  <p class="select-desc">Economical standard ground shipping (3–5 days)</p>
                </div>

                <div 
                  class="select-card" 
                  [class.selected]="booking.parcelDeliveryType === 'Express'"
                  (click)="setDeliveryType('Express')"
                >
                  <div class="select-header">
                    <strong>Express Delivery</strong>
                    <span class="select-price">₹80</span>
                  </div>
                  <p class="select-desc">Priority hub routing (1–2 business days)</p>
                </div>

                <div 
                  class="select-card" 
                  [class.selected]="booking.parcelDeliveryType === 'Same-Day'"
                  (click)="setDeliveryType('Same-Day')"
                >
                  <div class="select-header">
                    <strong>Same-Day Dispatch</strong>
                    <span class="select-price">₹150</span>
                  </div>
                  <p class="select-desc">Direct rush courier delivery within 12 hours</p>
                </div>
              </div>

              <label style="display: block; font-size: 12.5px; font-weight: 600; color: var(--text-secondary); margin-top: 18px; margin-bottom: 8px;">
                Choose Packaging Preference *
              </label>
              <div class="selection-grid packing-grid">
                <div 
                  class="select-card" 
                  [class.selected]="booking.parcelPackingPreference === 'Basic'"
                  (click)="setPacking('Basic')"
                >
                  <div class="select-header">
                    <strong>Standard Box</strong>
                    <span class="select-price">₹10</span>
                  </div>
                  <p class="select-desc">Cardboard box with basic seal wrap</p>
                </div>

                <div 
                  class="select-card" 
                  [class.selected]="booking.parcelPackingPreference === 'Premium'"
                  (click)="setPacking('Premium')"
                >
                  <div class="select-header">
                    <strong>Reinforced Bubble Wrap</strong>
                    <span class="select-price">₹30</span>
                  </div>
                  <p class="select-desc">Multi-layer shockproof cushioning + moisture guard</p>
                </div>
              </div>

              <div class="form-row" style="margin-top: 18px;">
                <div class="form-group">
                  <label>Preferred Pickup Window *</label>
                  <input type="datetime-local" class="form-control" [(ngModel)]="booking.parcelPickupTime" name="pickupTime" required>
                </div>
                <div class="form-group">
                  <label>Estimated Drop-off Window *</label>
                  <input type="datetime-local" class="form-control" [(ngModel)]="booking.parcelDropoffTime" name="dropoffTime" required>
                </div>
              </div>
            </div>
          </div>

          <!-- Sticky Sidebar: Live Price Breakdown -->
          <div class="form-sidebar-column">
            <div class="card cost-sidebar">
              <h3>Pricing Summary</h3>
              <p class="cost-subtitle">Real-time dynamic rate computation</p>

              <div class="cost-breakdown-list">
                <div class="cost-item">
                  <span>Base Booking Rate</span>
                  <strong>₹50.00</strong>
                </div>
                <div class="cost-item">
                  <span>Weight Surcharge (₹0.02/g)</span>
                  <strong>₹{{ (0.02 * (booking.parcelWeightInGram || 0)).toFixed(2) }}</strong>
                </div>
                <div class="cost-item">
                  <span>Delivery Speed ({{ booking.parcelDeliveryType }})</span>
                  <strong>₹{{ getDeliveryCharge() }}.00</strong>
                </div>
                <div class="cost-item">
                  <span>Packaging ({{ booking.parcelPackingPreference }})</span>
                  <strong>₹{{ getPackingCharge() }}.00</strong>
                </div>
                <div class="cost-item subtotal">
                  <span>Subtotal</span>
                  <strong>₹{{ getSubtotal().toFixed(2) }}</strong>
                </div>
                <div class="cost-item">
                  <span>GST / Tax (5%)</span>
                  <strong>₹{{ getTax().toFixed(2) }}</strong>
                </div>
                <div class="cost-total-row">
                  <div>
                    <span class="total-label">Total Amount</span>
                    <span class="tax-inclusive">Inclusive of all taxes</span>
                  </div>
                  <span class="total-val">₹{{ estimatedCost.toFixed(2) }}</span>
                </div>
              </div>

              <button type="submit" class="btn btn-primary btn-block btn-lg" [disabled]="loading">
                <span *ngIf="loading" class="spinner-sm"></span>
                <span>{{ loading ? 'Booking...' : 'Confirm & Proceed' }}</span>
              </button>

              <div class="security-guarantee">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <span>Insured & Covered by ParcelSwift Guarantee</span>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  `,
  styles: [`
    .booking-layout {
      display: grid;
      grid-template-columns: 1fr 340px;
      gap: 24px;
      align-items: start;
    }

    .form-section-card {
      padding: 24px;
    }

    .section-badge-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 18px;
      padding-bottom: 14px;
      border-bottom: 1px solid var(--border-subtle);
    }

    .step-badge {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: var(--primary);
      color: #fff;
      font-size: 12px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .section-badge-header h3 {
      font-size: 16px;
      font-weight: 700;
      color: var(--text-primary);
    }

    .sender-preview-box {
      background: var(--bg-input);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-md);
      padding: 14px 16px;
    }

    .sender-tag {
      font-size: 11px;
      font-weight: 700;
      color: var(--primary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 8px;
    }

    .sender-info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px;
      font-size: 12.5px;
      color: var(--text-secondary);
    }

    .sender-info-grid .span-2 {
      grid-column: span 2;
    }

    .sender-info-grid strong {
      color: var(--text-primary);
    }

    .weight-input-wrap {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-unit {
      position: absolute;
      right: 14px;
      color: var(--text-muted);
      font-size: 13px;
      font-weight: 500;
    }

    .weight-presets {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 10px;
      flex-wrap: wrap;
    }

    .preset-label {
      font-size: 12px;
      color: var(--text-muted);
    }

    .preset-chip {
      padding: 3px 10px;
      background: var(--bg-surface-raised);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-sm);
      color: var(--text-secondary);
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .preset-chip:hover {
      background: var(--bg-surface-hover);
      border-color: var(--primary-border);
      color: var(--text-primary);
    }

    /* Option Selection Cards */
    .selection-grid {
      display: grid;
      gap: 12px;
    }

    .delivery-grid {
      grid-template-columns: repeat(3, 1fr);
    }

    .packing-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .select-card {
      background: var(--bg-input);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-md);
      padding: 14px;
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .select-card:hover {
      border-color: var(--border-hover);
      background: var(--bg-surface-raised);
    }

    .select-card.selected {
      border-color: var(--primary);
      background: var(--primary-subtle);
      box-shadow: 0 0 0 1px var(--primary);
    }

    .select-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
    }

    .select-header strong {
      font-size: 13.5px;
      color: var(--text-primary);
    }

    .select-price {
      font-size: 13px;
      font-weight: 700;
      color: #60a5fa;
    }

    .select-desc {
      font-size: 12px;
      color: var(--text-muted);
      line-height: 1.4;
    }

    /* Sidebar Cost Breakdown */
    .cost-sidebar {
      position: sticky;
      top: 32px;
      padding: 24px;
    }

    .cost-sidebar h3 {
      font-size: 17px;
      font-weight: 800;
      color: var(--text-primary);
    }

    .cost-subtitle {
      font-size: 12px;
      color: var(--text-muted);
      margin-bottom: 18px;
    }

    .cost-breakdown-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 20px;
    }

    .cost-item {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      color: var(--text-secondary);
    }

    .cost-item strong {
      color: var(--text-primary);
    }

    .cost-item.subtotal {
      padding-top: 10px;
      border-top: 1px solid var(--border-subtle);
      font-weight: 600;
    }

    .cost-total-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 14px;
      margin-top: 4px;
      border-top: 1px dashed var(--border-default);
    }

    .total-label {
      display: block;
      font-size: 13.5px;
      font-weight: 700;
      color: var(--text-primary);
    }

    .tax-inclusive {
      display: block;
      font-size: 11px;
      color: var(--text-muted);
    }

    .total-val {
      font-family: var(--font-heading);
      font-size: 22px;
      font-weight: 800;
      color: var(--success);
    }

    .security-guarantee {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 16px;
      font-size: 11px;
      color: var(--text-muted);
      justify-content: center;
    }

    /* Success Card */
    .booking-success-card {
      max-width: 600px;
      margin: 20px auto;
      text-align: center;
      padding: 40px 32px;
    }

    .success-icon-badge {
      width: 68px;
      height: 68px;
      border-radius: 50%;
      background: var(--success-bg);
      border: 1px solid var(--success-border);
      color: #34d399;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
    }

    .booking-success-card h2 {
      font-size: 22px;
      font-weight: 800;
      color: var(--text-primary);
      margin-bottom: 6px;
    }

    .success-subtitle {
      font-size: 14px;
      color: var(--text-secondary);
      margin-bottom: 24px;
    }

    .token-card {
      background: var(--bg-input);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-md);
      padding: 16px 20px;
      margin-bottom: 28px;
      text-align: left;
    }

    .token-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid var(--border-subtle);
      font-size: 13.5px;
    }

    .token-row:last-child {
      border-bottom: none;
    }

    .token-row span {
      color: var(--text-secondary);
    }

    .token-row strong {
      color: var(--text-primary);
    }

    .success-actions {
      display: flex;
      gap: 12px;
      justify-content: center;
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

    @media (max-width: 992px) {
      .booking-layout {
        grid-template-columns: 1fr;
      }
      .delivery-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class BookingComponent implements OnInit {
  booking: any = {
    parcelWeightInGram: 1000,
    parcelDeliveryType: 'Standard',
    parcelPackingPreference: 'Basic',
    parcelPickupTime: '',
    parcelDropoffTime: '',
    receiverName: '',
    receiverAddress: '',
    receiverPin: '',
    receiverMobile: '',
    parcelContentsDescription: ''
  };

  estimatedCost = 0;
  loading = false;
  errorMessage = '';
  bookingComplete = false;
  bookingResult: any = {};

  constructor(
    private apiService: ApiService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Set default pickup/dropoff times
    const now = new Date();
    now.setHours(now.getHours() + 2);
    this.booking.parcelPickupTime = now.toISOString().slice(0, 16);

    const drop = new Date();
    drop.setDate(drop.getDate() + 3);
    this.booking.parcelDropoffTime = drop.toISOString().slice(0, 16);

    this.calculateCost();
  }

  setWeight(grams: number): void {
    this.booking.parcelWeightInGram = grams;
    this.calculateCost();
  }

  setDeliveryType(type: string): void {
    this.booking.parcelDeliveryType = type;
    this.calculateCost();
  }

  setPacking(pref: string): void {
    this.booking.parcelPackingPreference = pref;
    this.calculateCost();
  }

  getDeliveryCharge(): number {
    return this.booking.parcelDeliveryType === 'Express' ? 80 : this.booking.parcelDeliveryType === 'Same-Day' ? 150 : 30;
  }

  getPackingCharge(): number {
    return this.booking.parcelPackingPreference === 'Premium' ? 30 : 10;
  }

  getSubtotal(): number {
    return 50 + (0.02 * (this.booking.parcelWeightInGram || 0)) + this.getDeliveryCharge() + this.getPackingCharge();
  }

  getTax(): number {
    return this.getSubtotal() * 0.05;
  }

  calculateCost(): void {
    this.estimatedCost = Math.round(this.getSubtotal() * 1.05 * 100) / 100;
  }

  onSubmit(): void {
    this.errorMessage = '';
    if (!this.booking.receiverName || !this.booking.receiverAddress || !this.booking.receiverPin || !this.booking.receiverMobile) {
      this.errorMessage = 'Please complete all recipient fields';
      return;
    }
    if (!this.booking.receiverMobile.match(/^\d{10}$/)) {
      this.errorMessage = 'Receiver mobile number must contain exactly 10 digits';
      return;
    }
    if (!this.booking.receiverPin.match(/^\d{6}$/)) {
      this.errorMessage = 'Receiver PIN code must contain exactly 6 digits';
      return;
    }
    if (!this.booking.parcelContentsDescription.trim()) {
      this.errorMessage = 'Please provide a brief description of the parcel contents';
      return;
    }

    this.loading = true;
    const user = this.authService.getUser();
    const payload = {
      ...this.booking,
      customerId: user.customerId,
      senderName: user.name,
      senderAddress: user.address,
      senderContact: user.mobile
    };

    this.apiService.createCustomerBooking(payload).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.bookingComplete = true;
        this.bookingResult = res;
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Booking submission failed. Please check inputs.';
      }
    });
  }

  goToPayment(): void {
    this.router.navigate(['/customer/payment', this.bookingResult.bookingId]);
  }

  resetBooking(): void {
    this.bookingComplete = false;
    this.booking = {
      parcelWeightInGram: 1000,
      parcelDeliveryType: 'Standard',
      parcelPackingPreference: 'Basic',
      parcelPickupTime: '',
      parcelDropoffTime: '',
      receiverName: '',
      receiverAddress: '',
      receiverPin: '',
      receiverMobile: '',
      parcelContentsDescription: ''
    };
    this.ngOnInit();
  }
}
