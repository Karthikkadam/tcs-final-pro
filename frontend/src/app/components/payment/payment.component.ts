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
      <div class="main-content">
        <div class="page-header">
          <h1>Pay for Parcel</h1>
          <p>Complete your booking payment securely</p>
        </div>

        <div *ngIf="successMessage" class="alert alert-success">✅ {{ successMessage }}</div>
        <div *ngIf="errorMessage" class="alert alert-error">❌ {{ errorMessage }}</div>

        <!-- Payment Success -->
        <div *ngIf="paymentSuccess" class="glass-card success-section">
          <div class="success-icon">✅</div>
          <h2>Payment Successful!</h2>
          <div class="receipt-details">
            <div class="receipt-row"><span>Payment ID</span><strong>{{ paymentResult.paymentId }}</strong></div>
            <div class="receipt-row"><span>Transaction ID</span><strong>{{ paymentResult.transactionId }}</strong></div>
            <div class="receipt-row"><span>Transaction Date</span><strong>{{ paymentResult.transactionDate }}</strong></div>
            <div class="receipt-row"><span>Transaction Type</span><strong>{{ paymentResult.transactionType }}</strong></div>
            <div class="receipt-row"><span>Booking ID</span><strong>{{ paymentResult.bookingId }}</strong></div>
            <div class="receipt-row"><span>Amount</span><strong>₹{{ paymentResult.transactionAmount }}</strong></div>
            <div class="receipt-row"><span>Status</span><strong class="status-success">{{ paymentResult.transactionStatus }}</strong></div>
          </div>
          <div class="success-actions">
            <button class="btn btn-primary" (click)="downloadReceipt()">📥 Download Receipt</button>
            <a [routerLink]="'/customer/invoice/' + bookingId" class="btn btn-secondary">📄 View Invoice</a>
            <a routerLink="/customer/home" class="btn btn-secondary">🏠 Go to Dashboard</a>
          </div>
        </div>

        <!-- Confirmation Modal -->
        <div *ngIf="showConfirmation" class="modal-overlay" (click)="showConfirmation = false">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <div class="modal-header"><h3>Confirm Payment</h3></div>
            <div class="confirm-details">
              <div class="confirm-row"><span>Booking ID:</span><strong>{{ bookingId }}</strong></div>
              <div class="confirm-row"><span>Amount:</span><strong>₹{{ booking?.parcelServiceCost }}</strong></div>
              <div class="confirm-row"><span>Card:</span><strong>**** **** **** {{ card.number.slice(-4) }}</strong></div>
              <div class="confirm-row"><span>Type:</span><strong>{{ card.type }}</strong></div>
            </div>
            <div class="modal-actions">
              <button class="btn btn-secondary" (click)="showConfirmation = false">Cancel</button>
              <button class="btn btn-primary" (click)="confirmPayment()" [disabled]="processing">{{ processing ? 'Processing...' : 'Confirm & Pay' }}</button>
            </div>
          </div>
        </div>

        <!-- Payment Form -->
        <div *ngIf="!paymentSuccess && booking" class="payment-grid">
          <div class="glass-card">
            <h3 class="section-title">💳 Card Details</h3>
            <form (ngSubmit)="onSubmit()">
              <div class="form-group">
                <label>Cardholder Name *</label>
                <input type="text" class="form-control" [(ngModel)]="card.holderName" name="holderName" placeholder="Name on card" required>
              </div>
              <div class="form-group">
                <label>Card Number *</label>
                <input type="text" class="form-control" [(ngModel)]="card.number" name="cardNumber" placeholder="1234 5678 9012 3456" maxlength="19" (input)="formatCard($event)" required>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Expiry Date *</label>
                  <input type="text" class="form-control" [(ngModel)]="card.expiry" name="expiry" placeholder="MM/YY" maxlength="5" required>
                </div>
                <div class="form-group">
                  <label>CVV *</label>
                  <input type="password" class="form-control" [(ngModel)]="card.cvv" name="cvv" placeholder="***" maxlength="4" required>
                </div>
              </div>
              <div class="form-group">
                <label>Card Type *</label>
                <select class="form-control" [(ngModel)]="card.type" name="type">
                  <option value="Credit">💳 Credit Card</option>
                  <option value="Debit">💳 Debit Card</option>
                </select>
              </div>
              <button type="submit" class="btn btn-primary btn-block btn-lg">Pay ₹{{ booking.parcelServiceCost }}</button>
            </form>
          </div>

          <div class="glass-card order-summary">
            <h3 class="section-title">📋 Order Summary</h3>
            <div class="summary-row"><span>Booking ID</span><strong>{{ bookingId }}</strong></div>
            <div class="summary-row"><span>Receiver</span><strong>{{ booking.receiverName }}</strong></div>
            <div class="summary-row"><span>Delivery Type</span><strong>{{ booking.parcelDeliveryType }}</strong></div>
            <div class="summary-row"><span>Weight</span><strong>{{ booking.parcelWeightInGram }}g</strong></div>
            <div class="summary-total"><span>Total Amount</span><span>₹{{ booking.parcelServiceCost }}</span></div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .payment-grid { display: grid; grid-template-columns: 1fr 380px; gap: 24px; align-items: start; }
    .section-title { font-size: 16px; margin-bottom: 20px; }
    .order-summary { position: sticky; top: 32px; }
    .summary-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 14px; }
    .summary-row span { color: #a0a3bd; }
    .summary-total { display: flex; justify-content: space-between; padding: 16px 0 0; font-size: 20px; font-weight: 700; color: #00d4aa; }
    .success-section { text-align: center; padding: 48px; animation: scaleIn 0.4s ease; }
    .success-icon { font-size: 56px; margin-bottom: 16px; }
    .success-section h2 { color: #00d4aa; margin-bottom: 24px; }
    .receipt-details { background: rgba(0,212,170,0.06); border: 1px solid rgba(0,212,170,0.15); border-radius: 12px; padding: 20px; margin-bottom: 24px; text-align: left; }
    .receipt-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.04); font-size: 14px; }
    .receipt-row span { color: #a0a3bd; }
    .receipt-row strong { color: #fff; }
    .status-success { color: #00d4aa !important; }
    .success-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
    .confirm-details { margin: 16px 0; }
    .confirm-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; color: #a0a3bd; }
    .confirm-row strong { color: #fff; }
    @media (max-width: 768px) { .payment-grid { grid-template-columns: 1fr; } }
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
  successMessage = '';
  errorMessage = '';

  constructor(private route: ActivatedRoute, private apiService: ApiService, public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.bookingId = this.route.snapshot.paramMap.get('bookingId') || '';
    this.apiService.getBooking(this.bookingId).subscribe({
      next: (b) => { this.booking = b; },
      error: () => { this.errorMessage = 'Booking not found'; }
    });
  }

  formatCard(e: any): void {
    let val = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
    val = val.match(/.{1,4}/g)?.join(' ') || val;
    this.card.number = val;
  }

  onSubmit(): void {
    this.errorMessage = '';
    const num = this.card.number.replace(/\s/g, '');
    if (num.length !== 16) { this.errorMessage = 'Card number must be exactly 16 digits'; return; }
    if (!this.card.cvv.match(/^\d{3,4}$/)) { this.errorMessage = 'CVV must be 3 or 4 digits'; return; }
    if (!this.card.expiry.match(/^\d{2}\/\d{2}$/)) { this.errorMessage = 'Expiry must be MM/YY format'; return; }
    const [m, y] = this.card.expiry.split('/').map(Number);
    const now = new Date();
    if (2000 + y < now.getFullYear() || (2000 + y === now.getFullYear() && m < now.getMonth() + 1)) { this.errorMessage = 'Card has expired'; return; }
    if (!this.card.holderName.trim()) { this.errorMessage = 'Cardholder name is required'; return; }
    this.showConfirmation = true;
  }

  confirmPayment(): void {
    this.processing = true;
    this.apiService.processPayment({
      bookingId: this.bookingId, cardNumber: this.card.number.replace(/\s/g, ''),
      expiryDate: this.card.expiry, cvv: this.card.cvv, cardholderName: this.card.holderName, cardType: this.card.type
    }).subscribe({
      next: (res: any) => { this.processing = false; this.showConfirmation = false; this.paymentSuccess = true; this.paymentResult = res; this.successMessage = 'Payment successful!'; },
      error: (err) => { this.processing = false; this.showConfirmation = false; this.errorMessage = err.error?.message || 'Payment failed'; }
    });
  }

  downloadReceipt(): void {
    const content = `PAYMENT RECEIPT\n${'='.repeat(40)}\nPayment ID: ${this.paymentResult.paymentId}\nTransaction ID: ${this.paymentResult.transactionId}\nDate: ${this.paymentResult.transactionDate}\nType: ${this.paymentResult.transactionType}\nBooking ID: ${this.paymentResult.bookingId}\nAmount: ₹${this.paymentResult.transactionAmount}\nStatus: ${this.paymentResult.transactionStatus}\n${'='.repeat(40)}\nThank you for using ParcelSwift!`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `receipt_${this.paymentResult.paymentId}.txt`;
    a.click(); URL.revokeObjectURL(url);
  }
}
