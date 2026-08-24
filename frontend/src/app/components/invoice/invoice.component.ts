import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Booking, Payment } from '../../models/models';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterLink],
  template: `
    <div class="page-container">
      <app-navbar></app-navbar>
      <div class="main-content">
        <div class="page-header">
          <h1>Invoice</h1>
          <p>Booking invoice details</p>
        </div>

        <div *ngIf="booking" class="glass-card invoice-card" id="invoice">
          <div class="invoice-header">
            <div class="invoice-brand">
              <span class="brand-icon">📦</span>
              <span class="brand-name">ParcelSwift</span>
            </div>
            <div class="invoice-meta">
              <div class="invoice-number">Invoice #INV-{{ booking.bookingId }}</div>
              <div class="invoice-date">{{ booking.bookingDate }}</div>
            </div>
          </div>

          <div class="invoice-body">
            <div class="invoice-grid">
              <div class="invoice-section">
                <h4>Booking Details</h4>
                <div class="detail-row"><span>Booking ID</span><strong>{{ booking.bookingId }}</strong></div>
                <div class="detail-row" *ngIf="payment"><span>Payment ID</span><strong>{{ payment.paymentId }}</strong></div>
                <div class="detail-row" *ngIf="payment"><span>Transaction ID</span><strong>{{ payment.transactionId }}</strong></div>
                <div class="detail-row" *ngIf="payment"><span>Invoice Number</span><strong>INV-{{ booking.bookingId }}</strong></div>
              </div>
              <div class="invoice-section">
                <h4>Receiver Details</h4>
                <div class="detail-row"><span>Name</span><strong>{{ booking.receiverName }}</strong></div>
                <div class="detail-row"><span>Address</span><strong>{{ booking.receiverAddress }}</strong></div>
                <div class="detail-row"><span>PIN</span><strong>{{ booking.receiverPin }}</strong></div>
                <div class="detail-row"><span>Mobile</span><strong>{{ booking.receiverMobile }}</strong></div>
              </div>
            </div>

            <div class="invoice-section" style="margin-top: 24px;">
              <h4>Parcel Details</h4>
              <div class="detail-row"><span>Weight</span><strong>{{ booking.parcelWeightInGram }}g</strong></div>
              <div class="detail-row"><span>Contents</span><strong>{{ booking.parcelContentsDescription }}</strong></div>
              <div class="detail-row"><span>Delivery Type</span><strong>{{ booking.parcelDeliveryType }}</strong></div>
              <div class="detail-row"><span>Packing</span><strong>{{ booking.parcelPackingPreference }}</strong></div>
              <div class="detail-row"><span>Pickup Time</span><strong>{{ booking.parcelPickupTime }}</strong></div>
              <div class="detail-row"><span>Drop-off Time</span><strong>{{ booking.parcelDropoffTime }}</strong></div>
              <div class="detail-row total"><span>Service Cost</span><strong>₹{{ booking.parcelServiceCost }}</strong></div>
              <div class="detail-row"><span>Payment Time</span><strong>{{ booking.parcelPaymentTime || 'Pending' }}</strong></div>
            </div>
          </div>

          <div class="invoice-footer">
            <button class="btn btn-primary" (click)="downloadInvoice()">📥 Download Invoice</button>
            <a [routerLink]="authService.getRole() === 'OFFICER' ? '/officer/home' : '/customer/home'" class="btn btn-secondary">🏠 Back to Dashboard</a>
          </div>
        </div>

        <div *ngIf="!booking" class="loading-spinner"><div class="spinner"></div></div>
      </div>
    </div>
  `,
  styles: [`
    .invoice-card { max-width: 800px; animation: slideUp 0.5s ease; }
    .invoice-header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 24px; border-bottom: 1px solid rgba(255,255,255,0.08); margin-bottom: 24px; }
    .brand-icon { font-size: 32px; margin-right: 8px; }
    .brand-name { font-family: 'Outfit'; font-size: 24px; font-weight: 800; background: linear-gradient(135deg,#667eea,#764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .invoice-number { font-size: 16px; font-weight: 700; color: #667eea; }
    .invoice-date { font-size: 13px; color: #a0a3bd; }
    .invoice-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    .invoice-section h4 { font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: #667eea; margin-bottom: 12px; }
    .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.04); font-size: 13px; }
    .detail-row span { color: #a0a3bd; }
    .detail-row strong { color: #fff; }
    .detail-row.total { padding-top: 12px; border-top: 1px solid rgba(102,126,234,0.3); }
    .detail-row.total strong { color: #00d4aa; font-size: 16px; }
    .invoice-footer { display: flex; gap: 12px; margin-top: 32px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.08); }
  `]
})
export class InvoiceComponent implements OnInit {
  bookingId = '';
  booking: Booking | null = null;
  payment: Payment | null = null;

  constructor(private route: ActivatedRoute, private apiService: ApiService, public authService: AuthService) {}

  ngOnInit(): void {
    this.bookingId = this.route.snapshot.paramMap.get('bookingId') || '';
    this.apiService.getBooking(this.bookingId).subscribe({ next: (b) => { this.booking = b; } });
    this.apiService.getPayment(this.bookingId).subscribe({ next: (p) => { this.payment = p; }, error: () => {} });
  }

  downloadInvoice(): void {
    if (!this.booking) return;
    const b = this.booking;
    const p = this.payment;
    let content = `PARCELSWIFT INVOICE\n${'='.repeat(50)}\nInvoice #: INV-${b.bookingId}\nDate: ${b.bookingDate}\n\n`;
    if (p) { content += `Payment ID: ${p.paymentId}\nTransaction ID: ${p.transactionId}\n\n`; }
    content += `RECEIVER\nName: ${b.receiverName}\nAddress: ${b.receiverAddress}\nPIN: ${b.receiverPin}\nMobile: ${b.receiverMobile}\n\n`;
    content += `PARCEL DETAILS\nWeight: ${b.parcelWeightInGram}g\nContents: ${b.parcelContentsDescription}\nDelivery: ${b.parcelDeliveryType}\nPacking: ${b.parcelPackingPreference}\nPickup: ${b.parcelPickupTime}\nDrop-off: ${b.parcelDropoffTime}\n\n`;
    content += `${'='.repeat(50)}\nTOTAL: ₹${b.parcelServiceCost}\n${'='.repeat(50)}\nThank you for using ParcelSwift!`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `invoice_${b.bookingId}.txt`; a.click(); URL.revokeObjectURL(url);
  }
}
