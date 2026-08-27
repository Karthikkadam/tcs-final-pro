import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Booking } from '../../models/models';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, RouterLink],
  template: `
    <div class="page-container">
      <app-navbar></app-navbar>

      <main class="main-content">
        <div class="page-header">
          <div>
            <h1>Secure Checkout & Payment</h1>
            <p>256-Bit SSL Encrypted Payment Gateway for ParcelSwift Deliveries</p>
          </div>
        </div>

        <div *ngIf="errorMessage" class="alert alert-error">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          <span>{{ errorMessage }}</span>
        </div>

        <!-- Payment Success View -->
        <div *ngIf="paymentSuccess" class="card payment-success-card">
          <div class="success-icon-badge">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <h2>Payment Authorized & Processed</h2>
          <p class="success-subtitle">Your shipment status has transitioned to <strong>Booked</strong>.</p>

          <div class="receipt-box">
            <div class="receipt-row">
              <span>Transaction ID</span>
              <strong class="font-mono">{{ paymentResult.transactionId }}</strong>
            </div>
            <div class="receipt-row">
              <span>Payment Reference</span>
              <strong class="font-mono">{{ paymentResult.paymentId }}</strong>
            </div>
            <div class="receipt-row">
              <span>Booking Reference</span>
              <strong class="font-mono">{{ paymentResult.bookingId }}</strong>
            </div>
            <div class="receipt-row">
              <span>Payment Method</span>
              <strong>{{ paymentResult.transactionType }} Card</strong>
            </div>
            <div class="receipt-row">
              <span>Timestamp</span>
              <span>{{ paymentResult.transactionDate }}</span>
            </div>
            <div class="receipt-row total">
              <span>Amount Paid</span>
              <strong class="text-success" style="font-size: 18px;">₹{{ paymentResult.transactionAmount }}</strong>
            </div>
          </div>

          <div class="receipt-actions">
            <button class="btn btn-primary btn-lg" (click)="downloadReceipt()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download Payment Receipt
            </button>
            <a [routerLink]="'/customer/invoice/' + bookingId" class="btn btn-secondary btn-lg">
              View Tax Invoice
            </a>
            <a routerLink="/customer/home" class="btn btn-secondary btn-lg">
              Return to Dashboard
            </a>
          </div>
        </div>

        <!-- Payment Checkout Grid -->
        <div *ngIf="!paymentSuccess && booking" class="checkout-grid">
          <!-- Left Column: Virtual Card & Form -->
          <div class="checkout-form-col">
            <!-- Virtual Card Preview -->
            <div class="virtual-card">
              <div class="card-chip-row">
                <div class="card-chip"></div>
                <svg class="contactless-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M8.5 16.5a5 5 0 0 1 0-9"/><path d="M12 19a8.5 8.5 0 0 0 0-14"/><path d="M15.5 21.5a12 12 0 0 0 0-19"/>
                </svg>
              </div>
              <div class="card-number-display font-mono">
                {{ card.number || '•••• •••• •••• ••••' }}
              </div>
              <div class="card-meta-row">
                <div>
                  <span class="card-meta-lbl">Cardholder Name</span>
                  <span class="card-meta-val">{{ card.holderName || 'YOUR FULL NAME' }}</span>
                </div>
                <div>
                  <span class="card-meta-lbl">Expires</span>
                  <span class="card-meta-val font-mono">{{ card.expiry || 'MM/YY' }}</span>
                </div>
              </div>
            </div>

            <!-- Card Inputs Card -->
            <div class="card payment-input-card">
              <h3 class="payment-card-title">Card Information</h3>

              <form (ngSubmit)="onSubmit()">
                <div class="form-group">
                  <label>Cardholder Name *</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    [(ngModel)]="card.holderName" 
                    name="holderName" 
                    placeholder="Name exactly as printed on card" 
                    required
                  />
                </div>

                <div class="form-group">
                  <label>Card Number *</label>
                  <input 
                    type="text" 
                    class="form-control font-mono" 
                    [(ngModel)]="card.number" 
                    name="cardNumber" 
                    placeholder="1234 5678 9012 3456" 
                    maxlength="19" 
                    (input)="formatCard($event)" 
                    required
                  />
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label>Expiration Date *</label>
                    <input 
                      type="text" 
                      class="form-control font-mono" 
                      [(ngModel)]="card.expiry" 
                      name="expiry" 
                      placeholder="MM/YY" 
                      maxlength="5" 
                      required
                    />
                  </div>

                  <div class="form-group">
                    <label>Security CVV *</label>
                    <input 
                      type="password" 
                      class="form-control font-mono" 
                      [(ngModel)]="card.cvv" 
                      name="cvv" 
                      placeholder="3 or 4 digits" 
                      maxlength="4" 
                      required
                    />
                  </div>
                </div>

                <div class="form-group">
                  <label>Card Type *</label>
                  <select class="form-control" [(ngModel)]="card.type" name="type">
                    <option value="Credit">Credit Card</option>
                    <option value="Debit">Debit Card</option>
                  </select>
                </div>

                <button type="submit" class="btn btn-primary btn-block btn-lg" style="margin-top: 10px;">
                  Authorize & Pay ₹{{ booking.parcelServiceCost }}
                </button>
              </form>

              <div class="gateway-trust-footer">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <span>Payments are verified and secured via 256-Bit SSL tokenization.</span>
              </div>
            </div>
          </div>

          <!-- Right Column: Order Summary -->
          <div class="checkout-summary-col">
            <div class="card summary-card">
              <h3>Order Summary</h3>
              <span class="summary-sub">Booking details for checkout</span>

              <div class="summary-list">
                <div class="summary-item">
                  <span>Booking Reference</span>
                  <strong class="font-mono">{{ bookingId }}</strong>
                </div>
                <div class="summary-item">
                  <span>Recipient</span>
                  <strong>{{ booking.receiverName }}</strong>
                </div>
                <div class="summary-item">
                  <span>Destination Address</span>
                  <span class="dest-text">{{ booking.receiverAddress }}</span>
                </div>
                <div class="summary-item">
                  <span>Delivery Speed</span>
                  <strong>{{ booking.parcelDeliveryType }}</strong>
                </div>
                <div class="summary-item">
                  <span>Parcel Weight</span>
                  <strong>{{ booking.parcelWeightInGram }}g</strong>
                </div>
                <div class="summary-item total">
                  <span>Total Amount Due</span>
                  <span class="total-amount">₹{{ booking.parcelServiceCost }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Confirmation Modal -->
        <div *ngIf="showConfirmation" class="modal-overlay" (click)="showConfirmation = false">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h3>Confirm Transaction</h3>
              <button class="btn btn-secondary btn-sm" (click)="showConfirmation = false">✕</button>
            </div>

            <p style="color: var(--text-secondary); font-size: 13.5px; margin-bottom: 16px;">
              Please review the charge details before final authorization:
            </p>

            <div class="confirm-summary-box">
              <div class="confirm-row">
                <span>Booking Reference:</span>
                <strong class="font-mono">{{ bookingId }}</strong>
              </div>
              <div class="confirm-row">
                <span>Card Number:</span>
                <strong class="font-mono">•••• •••• •••• {{ card.number.slice(-4) }}</strong>
              </div>
              <div class="confirm-row">
                <span>Card Type:</span>
                <strong>{{ card.type }} Card</strong>
              </div>
              <div class="confirm-row total">
                <span>Amount to Charge:</span>
                <strong class="text-success" style="font-size: 16px;">₹{{ booking?.parcelServiceCost }}</strong>
              </div>
            </div>

            <div class="modal-actions">
              <button class="btn btn-secondary" (click)="showConfirmation = false">Cancel</button>
              <button class="btn btn-primary" (click)="confirmPayment()" [disabled]="processing">
                <span *ngIf="processing" class="spinner-sm"></span>
                <span>{{ processing ? 'Authorizing...' : 'Confirm & Authorize Payment' }}</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .checkout-grid {
      display: grid;
      grid-template-columns: 1fr 340px;
      gap: 24px;
      align-items: start;
    }

    /* Virtual Card */
    .virtual-card {
      background: linear-gradient(135deg, #1e3a8a 0%, #1e1b4b 60%, #0f172a 100%);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: var(--radius-lg);
      padding: 24px 28px;
      color: #fff;
      box-shadow: 0 12px 30px -6px rgba(0, 0, 0, 0.6);
      margin-bottom: 20px;
    }

    .card-chip-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .card-chip {
      width: 42px;
      height: 30px;
      background: linear-gradient(135deg, #fde047 0%, #ca8a04 100%);
      border-radius: 4px;
      border: 1px solid rgba(0, 0, 0, 0.2);
    }

    .contactless-icon {
      color: rgba(255, 255, 255, 0.6);
    }

    .card-number-display {
      font-size: 18px;
      letter-spacing: 0.15em;
      margin-bottom: 24px;
      color: #fff;
      font-weight: 500;
    }

    .card-meta-row {
      display: flex;
      justify-content: space-between;
    }

    .card-meta-lbl {
      display: block;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: rgba(255, 255, 255, 0.6);
    }

    .card-meta-val {
      display: block;
      font-size: 12.5px;
      font-weight: 600;
      color: #fff;
      margin-top: 2px;
      letter-spacing: 0.02em;
    }

    .payment-input-card {
      padding: 24px;
    }

    .payment-card-title {
      font-size: 16px;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 18px;
    }

    .gateway-trust-footer {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 16px;
      font-size: 11.5px;
      color: var(--text-muted);
      justify-content: center;
    }

    /* Summary Card */
    .summary-card {
      position: sticky;
      top: 32px;
      padding: 24px;
    }

    .summary-card h3 {
      font-size: 17px;
      font-weight: 800;
      color: var(--text-primary);
    }

    .summary-sub {
      display: block;
      font-size: 12px;
      color: var(--text-muted);
      margin-bottom: 18px;
    }

    .summary-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .summary-item {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      color: var(--text-secondary);
    }

    .summary-item strong {
      color: var(--text-primary);
    }

    .dest-text {
      max-width: 160px;
      text-align: right;
      font-size: 12px;
      color: var(--text-secondary);
    }

    .summary-item.total {
      padding-top: 14px;
      border-top: 1px dashed var(--border-default);
      align-items: center;
    }

    .total-amount {
      font-family: var(--font-heading);
      font-size: 22px;
      font-weight: 800;
      color: var(--success);
    }

    /* Success Card */
    .payment-success-card {
      max-width: 620px;
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

    .payment-success-card h2 {
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

    .receipt-box {
      background: var(--bg-input);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-md);
      padding: 18px 22px;
      margin-bottom: 24px;
      text-align: left;
    }

    .receipt-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid var(--border-subtle);
      font-size: 13.5px;
    }

    .receipt-row:last-child {
      border-bottom: none;
    }

    .receipt-row span {
      color: var(--text-secondary);
    }

    .receipt-row strong {
      color: var(--text-primary);
    }

    .receipt-actions {
      display: flex;
      gap: 10px;
      justify-content: center;
      flex-wrap: wrap;
    }

    /* Modal */
    .confirm-summary-box {
      background: var(--bg-input);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-md);
      padding: 16px;
      margin-bottom: 20px;
    }

    .confirm-row {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      font-size: 13.5px;
    }

    .confirm-row span {
      color: var(--text-secondary);
    }

    .confirm-row strong {
      color: var(--text-primary);
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
      .checkout-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class PaymentComponent implements OnInit {
  bookingId = '';
  booking: Booking | null = null;
  card = { holderName: '', number: '', expiry: '', cvv: '', type: 'Credit' };
  showConfirmation = false;
  processing = false;
  paymentSuccess = false;
  paymentResult: any = {};
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.bookingId = this.route.snapshot.paramMap.get('bookingId') || '';
    if (this.bookingId) {
      this.apiService.getBooking(this.bookingId).subscribe({
        next: (b) => { this.booking = b; },
        error: () => { this.errorMessage = 'Booking record not found'; }
      });
    }
  }

  formatCard(e: any): void {
    let val = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
    val = val.match(/.{1,4}/g)?.join(' ') || val;
    this.card.number = val;
  }

  onSubmit(): void {
    this.errorMessage = '';
    const num = this.card.number.replace(/\s/g, '');
    if (num.length !== 16) {
      this.errorMessage = 'Card number must be exactly 16 digits';
      return;
    }
    if (!this.card.cvv.match(/^\d{3,4}$/)) {
      this.errorMessage = 'Security CVV must be 3 or 4 digits';
      return;
    }
    if (!this.card.expiry.match(/^\d{2}\/\d{2}$/)) {
      this.errorMessage = 'Expiry must follow MM/YY format';
      return;
    }
    const [m, y] = this.card.expiry.split('/').map(Number);
    const now = new Date();
    if (2000 + y < now.getFullYear() || (2000 + y === now.getFullYear() && m < now.getMonth() + 1)) {
      this.errorMessage = 'Card has expired. Please provide a valid expiration date.';
      return;
    }
    if (!this.card.holderName.trim()) {
      this.errorMessage = 'Cardholder name is required';
      return;
    }

    this.showConfirmation = true;
  }

  confirmPayment(): void {
    this.processing = true;
    this.apiService.processPayment({
      bookingId: this.bookingId,
      cardNumber: this.card.number.replace(/\s/g, ''),
      expiryDate: this.card.expiry,
      cvv: this.card.cvv,
      cardholderName: this.card.holderName,
      cardType: this.card.type
    }).subscribe({
      next: (res: any) => {
        this.processing = false;
        this.showConfirmation = false;
        this.paymentSuccess = true;
        this.paymentResult = res;
      },
      error: (err) => {
        this.processing = false;
        this.showConfirmation = false;
        this.errorMessage = err.error?.message || 'Payment authorization failed. Please try again.';
      }
    });
  }

  downloadReceipt(): void {
    const content = `PARCELSWIFT PAYMENT RECEIPT
============================================================
Payment Reference : ${this.paymentResult.paymentId}
Transaction ID    : ${this.paymentResult.transactionId}
Booking Reference : ${this.paymentResult.bookingId}
Transaction Date  : ${this.paymentResult.transactionDate}
Card Type         : ${this.paymentResult.transactionType}
Status            : ${this.paymentResult.transactionStatus}
============================================================
AMOUNT PAID       : ₹${this.paymentResult.transactionAmount}
============================================================
Thank you for choosing ParcelSwift Enterprise Logistics!
Support Helpline  : 1800-PARCEL-SWIFT (24x7)
`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt_${this.paymentResult.paymentId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
