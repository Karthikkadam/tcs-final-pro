import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/models';

@Component({
  selector: 'app-officer-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  template: `
    <div class="page-container">
      <app-navbar></app-navbar>

      <main class="main-content">
        <div class="page-header">
          <div>
            <div class="role-badge role-officer" style="margin-bottom: 8px;">
              Officer Assistance Desk
            </div>
            <h1>Book Parcel for Customer</h1>
            <p>Initiate parcel booking on behalf of a registered customer (₹50 Administrative Fee applies)</p>
          </div>
        </div>

        <div *ngIf="errorMessage" class="alert alert-error">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          <span>{{ errorMessage }}</span>
        </div>

        <!-- Booking Created Acknowledgment -->
        <div *ngIf="bookingComplete" class="card ack-card">
          <div class="ack-icon-badge">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <h2>Booking Registered Successfully</h2>
          <p class="ack-desc">Status has been initialized to <strong>Assigned</strong> (pending in-office customer payment).</p>

          <div class="ack-summary-box">
            <div class="ack-row">
              <span>Booking Reference ID</span>
              <strong class="font-mono">{{ bookingResult.bookingId }}</strong>
            </div>
            <div class="ack-row">
              <span>Customer ID / Sender</span>
              <strong>{{ selectedCustomer?.customerId }} — {{ selectedCustomer?.name }}</strong>
            </div>
            <div class="ack-row">
              <span>Recipient</span>
              <strong>{{ booking.receiverName }}</strong>
            </div>
            <div class="ack-row">
              <span>Total Service Cost (inc. Admin Fee)</span>
              <strong class="text-success" style="font-size: 16px;">₹{{ bookingResult.serviceCost || estimatedCost }}</strong>
            </div>
          </div>

          <div class="ack-actions">
            <button class="btn btn-primary" (click)="resetBooking()">
              Create Another Customer Booking
            </button>
          </div>
        </div>

        <!-- Form Layout -->
        <form *ngIf="!bookingComplete" class="booking-layout" (ngSubmit)="onSubmit()">
          <div class="form-main-column">
            <!-- 1. Customer Selection -->
            <div class="card form-section-card">
              <div class="section-badge-header">
                <span class="step-badge">1</span>
                <h3>Select Registered Customer</h3>
              </div>

              <div class="form-group">
                <label>Select Customer Profile *</label>
                <select class="form-control" [(ngModel)]="selectedCustomerId" name="customer" (ngModelChange)="onCustomerSelect()" required>
                  <option value="">-- Choose a registered customer account --</option>
                  <option *ngFor="let c of customers" [value]="c.customerId">
                    {{ c.customerId }} — {{ c.name }} ({{ c.email }})
                  </option>
                </select>
              </div>

              <div *ngIf="selectedCustomer" class="customer-preview-box">
                <div class="preview-header">
                  <span class="preview-badge">Verified Customer</span>
                  <span class="font-mono">{{ selectedCustomer.customerId }}</span>
                </div>
                <div class="customer-info-grid">
                  <div><span>Name:</span> <strong>{{ selectedCustomer.name }}</strong></div>
                  <div><span>Contact:</span> <strong>{{ selectedCustomer.countryCode }} {{ selectedCustomer.mobile }}</strong></div>
                  <div class="span-2"><span>Address:</span> <strong>{{ selectedCustomer.address }}</strong></div>
                </div>
              </div>
            </div>

            <!-- 2. Receiver Details -->
            <div class="card form-section-card" style="margin-top: 20px;">
              <div class="section-badge-header">
                <span class="step-badge">2</span>
                <h3>Recipient Information</h3>
              </div>

              <div class="form-group">
                <label>Receiver Full Name *</label>
                <input type="text" class="form-control" [(ngModel)]="booking.receiverName" name="rn" placeholder="Recipient's legal name" required>
              </div>

              <div class="form-group">
                <label>Receiver Delivery Address *</label>
                <textarea class="form-control" [(ngModel)]="booking.receiverAddress" name="ra" placeholder="Full postal delivery address" rows="2" required></textarea>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Receiver PIN Code *</label>
                  <input type="text" class="form-control" [(ngModel)]="booking.receiverPin" name="rp" placeholder="6-digit PIN" maxlength="6" required>
                </div>
                <div class="form-group">
                  <label>Receiver Mobile Number *</label>
                  <input type="text" class="form-control" [(ngModel)]="booking.receiverMobile" name="rm" placeholder="10-digit mobile" maxlength="10" required>
                </div>
              </div>
            </div>

            <!-- 3. Parcel Details -->
            <div class="card form-section-card" style="margin-top: 20px;">
              <div class="section-badge-header">
                <span class="step-badge">3</span>
                <h3>Parcel Specifications & Timings</h3>
              </div>

              <div class="form-group">
                <label>Contents Description *</label>
                <input type="text" class="form-control" [(ngModel)]="booking.parcelContentsDescription" name="cd" placeholder="Contents description" required>
              </div>

              <div class="form-group">
                <label>Parcel Weight (Grams) *</label>
                <input type="number" class="form-control" [(ngModel)]="booking.parcelWeightInGram" name="w" min="1" (ngModelChange)="calculateCost()" required>
                
                <div class="weight-presets">
                  <span class="preset-label">Presets:</span>
                  <button type="button" class="preset-chip" (click)="setWeight(500)">500g</button>
                  <button type="button" class="preset-chip" (click)="setWeight(1000)">1 kg</button>
                  <button type="button" class="preset-chip" (click)="setWeight(2500)">2.5 kg</button>
                  <button type="button" class="preset-chip" (click)="setWeight(5000)">5 kg</button>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Delivery Speed *</label>
                  <select class="form-control" [(ngModel)]="booking.parcelDeliveryType" name="dt" (ngModelChange)="calculateCost()">
                    <option value="Standard">Standard Delivery (₹30)</option>
                    <option value="Express">Express Delivery (₹80)</option>
                    <option value="Same-Day">Same-Day Dispatch (₹150)</option>
                  </select>
                </div>

                <div class="form-group">
                  <label>Packaging Preference *</label>
                  <select class="form-control" [(ngModel)]="booking.parcelPackingPreference" name="pp" (ngModelChange)="calculateCost()">
                    <option value="Basic">Standard Cardboard (₹10)</option>
                    <option value="Premium">Reinforced Cushioning (₹30)</option>
                  </select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Pickup Window *</label>
                  <input type="datetime-local" class="form-control" [(ngModel)]="booking.parcelPickupTime" name="pt" required>
                </div>
                <div class="form-group">
                  <label>Drop-off Window *</label>
                  <input type="datetime-local" class="form-control" [(ngModel)]="booking.parcelDropoffTime" name="dot" required>
                </div>
              </div>
            </div>
          </div>

          <!-- Sticky Sidebar -->
          <div class="form-sidebar-column">
            <div class="card cost-sidebar">
              <h3>Officer Booking Quote</h3>
              <p class="cost-subtitle">Includes customer service fee + administrative charge</p>

              <div class="cost-breakdown-list">
                <div class="cost-item">
                  <span>Base Rate</span>
                  <strong>₹50.00</strong>
                </div>
                <div class="cost-item">
                  <span>Weight Fee (₹0.02/g)</span>
                  <strong>₹{{ (0.02 * (booking.parcelWeightInGram || 0)).toFixed(2) }}</strong>
                </div>
                <div class="cost-item">
                  <span>Delivery Speed</span>
                  <strong>₹{{ getDeliveryCharge() }}.00</strong>
                </div>
                <div class="cost-item">
                  <span>Packaging</span>
                  <strong>₹{{ getPackingCharge() }}.00</strong>
                </div>
                <div class="cost-item">
                  <span>Officer Admin Booking Fee</span>
                  <strong style="color: #c084fc;">₹50.00</strong>
                </div>
                <div class="cost-item subtotal">
                  <span>Subtotal</span>
                  <strong>₹{{ getSubtotal().toFixed(2) }}</strong>
                </div>
                <div class="cost-item">
                  <span>Tax (5%)</span>
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

              <button type="submit" class="btn btn-primary btn-block btn-lg" [disabled]="loading || !selectedCustomerId">
                <span *ngIf="loading" class="spinner-sm"></span>
                <span>{{ loading ? 'Creating...' : 'Confirm Officer Booking' }}</span>
              </button>
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
      background: var(--purple);
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

    .customer-preview-box {
      background: var(--bg-input);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-md);
      padding: 14px 16px;
      margin-top: 14px;
    }

    .preview-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }

    .preview-badge {
      font-size: 11px;
      font-weight: 700;
      color: #34d399;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .customer-info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px;
      font-size: 12.5px;
      color: var(--text-secondary);
    }

    .customer-info-grid .span-2 {
      grid-column: span 2;
    }

    .customer-info-grid strong {
      color: var(--text-primary);
    }

    .weight-presets {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 8px;
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
      border-color: var(--border-hover);
      color: var(--text-primary);
    }

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

    /* Ack Card */
    .ack-card {
      max-width: 600px;
      margin: 20px auto;
      text-align: center;
      padding: 40px 32px;
    }

    .ack-icon-badge {
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

    .ack-card h2 {
      font-size: 22px;
      font-weight: 800;
      color: var(--text-primary);
      margin-bottom: 6px;
    }

    .ack-desc {
      font-size: 14px;
      color: var(--text-secondary);
      margin-bottom: 24px;
    }

    .ack-summary-box {
      background: var(--bg-input);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-md);
      padding: 16px 20px;
      margin-bottom: 24px;
      text-align: left;
    }

    .ack-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid var(--border-subtle);
      font-size: 13.5px;
    }

    .ack-row:last-child {
      border-bottom: none;
    }

    .ack-row span {
      color: var(--text-secondary);
    }

    .ack-row strong {
      color: var(--text-primary);
    }

    .ack-actions {
      display: flex;
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
      .booking-layout { grid-template-columns: 1fr; }
    }
  `]
})
export class OfficerBookingComponent implements OnInit {
  customers: User[] = [];
  selectedCustomerId = '';
  selectedCustomer: User | null = null;
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
    this.apiService.getAllCustomers().subscribe({
      next: (c) => { this.customers = c; }
    });

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

  onCustomerSelect(): void {
    this.selectedCustomer = this.customers.find(c => c.customerId === this.selectedCustomerId) || null;
  }

  getDeliveryCharge(): number {
    return this.booking.parcelDeliveryType === 'Express' ? 80 : this.booking.parcelDeliveryType === 'Same-Day' ? 150 : 30;
  }

  getPackingCharge(): number {
    return this.booking.parcelPackingPreference === 'Premium' ? 30 : 10;
  }

  getSubtotal(): number {
    return 50 + (0.02 * (this.booking.parcelWeightInGram || 0)) + this.getDeliveryCharge() + this.getPackingCharge() + 50; // includes 50 admin fee
  }

  getTax(): number {
    return this.getSubtotal() * 0.05;
  }

  calculateCost(): void {
    this.estimatedCost = Math.round(this.getSubtotal() * 1.05 * 100) / 100;
  }

  onSubmit(): void {
    this.errorMessage = '';
    if (!this.selectedCustomer) {
      this.errorMessage = 'Please select a registered customer account';
      return;
    }
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

    this.loading = true;
    const payload = {
      ...this.booking,
      customerId: this.selectedCustomerId,
      senderName: this.selectedCustomer.name,
      senderAddress: this.selectedCustomer.address,
      senderContact: this.selectedCustomer.mobile
    };

    this.apiService.createOfficerBooking(payload).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.bookingComplete = true;
        this.bookingResult = res;
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Officer booking failed';
      }
    });
  }

  resetBooking(): void {
    this.bookingComplete = false;
    this.selectedCustomerId = '';
    this.selectedCustomer = null;
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
