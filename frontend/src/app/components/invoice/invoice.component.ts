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

      <main class="main-content">
        <div class="page-header no-print">
          <div>
            <h1>Tax Invoice & Bill of Lading</h1>
            <p>Official consignment receipt and itemized billing statement</p>
          </div>

          <div class="header-actions">
            <button class="btn btn-primary" (click)="printInvoice()">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
              Print / Save PDF
            </button>
            <button class="btn btn-secondary" (click)="downloadInvoiceText()">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download Text Invoice
            </button>
          </div>
        </div>

        <!-- Official Printable Invoice Sheet -->
        <div *ngIf="booking" class="invoice-sheet card" id="printable-invoice">
          <!-- Invoice Header -->
          <div class="invoice-sheet-header">
            <div class="brand-left">
              <div class="brand">
                <div class="brand-badge">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                    <path d="m7.5 4.27 9 5.15"/>
                    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
                    <path d="m3.3 7 8.7 5 8.7-5"/>
                    <path d="M12 22V12"/>
                  </svg>
                </div>
                <div>
                  <span class="brand-title">ParcelSwift Logistics</span>
                  <span class="brand-sub">Enterprise Delivery & Supply Chain Network</span>
                </div>
              </div>
              <div class="company-tax-info">
                GSTIN: 27AABCP1234F1Z5 | Corporate Reg: U74999MH2026PTC1098
              </div>
            </div>

            <div class="invoice-meta-right">
              <div class="invoice-title-tag">OFFICIAL TAX INVOICE</div>
              <div class="meta-row">
                <span>Invoice No:</span>
                <strong class="font-mono">INV-{{ booking.bookingId }}</strong>
              </div>
              <div class="meta-row">
                <span>Date of Issue:</span>
                <strong>{{ booking.bookingDate }}</strong>
              </div>
              <div class="meta-row">
                <span>Shipment Status:</span>
                <span class="badge" [ngClass]="'badge-' + booking.status.toLowerCase().replace(' ', '')">
                  {{ booking.status }}
                </span>
              </div>
            </div>
          </div>

          <!-- Parties Grid (Shipper / Consignee) -->
          <div class="parties-grid">
            <div class="party-box">
              <span class="party-label">01. CONSIGNOR / SENDER DETAILS</span>
              <div class="party-content">
                <strong>{{ booking.senderName }}</strong>
                <p>{{ booking.senderAddress }}</p>
                <div class="party-meta">Contact: {{ booking.senderContact }}</div>
                <div class="party-meta font-mono">Customer ID: {{ booking.customerId }}</div>
              </div>
            </div>

            <div class="party-box">
              <span class="party-label">02. CONSIGNEE / RECIPIENT DETAILS</span>
              <div class="party-content">
                <strong>{{ booking.receiverName }}</strong>
                <p>{{ booking.receiverAddress }}</p>
                <div class="party-meta">Postal PIN: {{ booking.receiverPin }}</div>
                <div class="party-meta">Contact: {{ booking.receiverMobile }}</div>
              </div>
            </div>
          </div>

          <!-- Shipment Specifications Table -->
          <div class="specs-table-wrap">
            <table class="specs-table">
              <thead>
                <tr>
                  <th>Contents Description</th>
                  <th>Delivery Speed</th>
                  <th>Weight</th>
                  <th>Packaging</th>
                  <th>Pickup Scheduled</th>
                  <th>Drop-off Target</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>{{ booking.parcelContentsDescription }}</strong></td>
                  <td>{{ booking.parcelDeliveryType }}</td>
                  <td>{{ booking.parcelWeightInGram }}g</td>
                  <td>{{ booking.parcelPackingPreference }}</td>
                  <td>{{ booking.parcelPickupTime || '-' }}</td>
                  <td>{{ booking.parcelDropoffTime || '-' }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Itemized Financial Breakdown -->
          <div class="financial-breakdown-section">
            <div class="payment-telemetry-box" *ngIf="payment">
              <h4>Electronic Payment Confirmation</h4>
              <div class="telemetry-row">
                <span>Payment Reference:</span>
                <strong class="font-mono">{{ payment.paymentId }}</strong>
              </div>
              <div class="telemetry-row">
                <span>Gateway Transaction ID:</span>
                <strong class="font-mono">{{ payment.transactionId }}</strong>
              </div>
              <div class="telemetry-row">
                <span>Method:</span>
                <strong>{{ payment.cardType }} Card</strong>
              </div>
              <div class="telemetry-row">
                <span>Settlement Status:</span>
                <strong class="text-success">Authorized & Settled</strong>
              </div>
            </div>

            <div class="pricing-summary-box">
              <div class="price-row">
                <span>Base Consignment Charge</span>
                <span>₹50.00</span>
              </div>
              <div class="price-row">
                <span>Weight Surcharge (₹0.02 × {{ booking.parcelWeightInGram }}g)</span>
                <span>₹{{ (0.02 * booking.parcelWeightInGram).toFixed(2) }}</span>
              </div>
              <div class="price-row">
                <span>Delivery Mode Surcharge</span>
                <span>₹{{ getDeliveryCharge() }}.00</span>
              </div>
              <div class="price-row">
                <span>Protective Packaging Surcharge</span>
                <span>₹{{ getPackingCharge() }}.00</span>
              </div>
              <div class="price-row" *ngIf="booking.bookedBy === 'OFFICER'">
                <span>Officer Administrative Fee</span>
                <span>₹50.00</span>
              </div>
              <div class="price-row subtotal">
                <span>Subtotal (Net)</span>
                <strong>₹{{ getSubtotal().toFixed(2) }}</strong>
              </div>
              <div class="price-row">
                <span>Integrated GST (5%)</span>
                <span>₹{{ getTax().toFixed(2) }}</span>
              </div>
              <div class="price-row grand-total">
                <span>Grand Total (INR)</span>
                <span class="total-amount">₹{{ booking.parcelServiceCost }}</span>
              </div>
            </div>
          </div>

          <!-- Invoice Footer -->
          <div class="invoice-sheet-footer">
            <div class="terms-note">
              <strong>Terms & Conditions:</strong> All consignments are governed by ParcelSwift standard freight carriage terms. Goods are insured under standard transit liability.
            </div>
            <div class="authorized-signatory">
              <div class="signature-line"></div>
              <span>Authorized Representative</span>
              <span class="signatory-sub">ParcelSwift Logistics Terminal</span>
            </div>
          </div>
        </div>

        <div *ngIf="!booking" class="loading-spinner">
          <div class="spinner"></div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .invoice-sheet {
      max-width: 860px;
      margin: 0 auto;
      padding: 36px 40px;
      background: var(--bg-surface);
      border: 1px solid var(--border-default);
    }

    .invoice-sheet-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding-bottom: 24px;
      border-bottom: 1px solid var(--border-subtle);
      gap: 20px;
      flex-wrap: wrap;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .brand-badge {
      width: 44px;
      height: 44px;
      border-radius: var(--radius-md);
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .brand-title {
      font-family: var(--font-heading);
      font-size: 22px;
      font-weight: 800;
      color: var(--text-primary);
      display: block;
      line-height: 1.1;
    }

    .brand-sub {
      font-size: 11px;
      color: var(--text-muted);
      display: block;
      margin-top: 2px;
    }

    .company-tax-info {
      font-size: 11px;
      color: var(--text-muted);
      margin-top: 10px;
      font-family: var(--font-mono);
    }

    .invoice-meta-right {
      text-align: right;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .invoice-title-tag {
      font-size: 11px;
      font-weight: 700;
      color: var(--primary);
      letter-spacing: 0.08em;
      margin-bottom: 4px;
    }

    .meta-row {
      font-size: 13px;
      color: var(--text-secondary);
    }

    .meta-row strong {
      color: var(--text-primary);
      margin-left: 6px;
    }

    /* Parties Grid */
    .parties-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      padding: 24px 0;
      border-bottom: 1px solid var(--border-subtle);
    }

    .party-box {
      background: var(--bg-input);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-md);
      padding: 16px 18px;
    }

    .party-label {
      font-size: 10.5px;
      font-weight: 700;
      color: var(--text-muted);
      letter-spacing: 0.06em;
      display: block;
      margin-bottom: 8px;
    }

    .party-content strong {
      display: block;
      font-size: 14.5px;
      color: var(--text-primary);
      margin-bottom: 4px;
    }

    .party-content p {
      font-size: 12.5px;
      color: var(--text-secondary);
      line-height: 1.4;
      margin-bottom: 6px;
    }

    .party-meta {
      font-size: 12px;
      color: var(--text-muted);
    }

    /* Specs Table */
    .specs-table-wrap {
      padding: 24px 0;
      border-bottom: 1px solid var(--border-subtle);
    }

    .specs-table {
      width: 100%;
      border-collapse: collapse;
    }

    .specs-table th {
      background: var(--bg-surface-raised);
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      padding: 10px 14px;
      color: var(--text-muted);
      border-bottom: 1px solid var(--border-default);
    }

    .specs-table td {
      padding: 12px 14px;
      font-size: 13px;
      border-bottom: 1px solid var(--border-subtle);
      color: var(--text-secondary);
    }

    /* Financial Breakdown */
    .financial-breakdown-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      padding: 24px 0;
      border-bottom: 1px solid var(--border-subtle);
    }

    .payment-telemetry-box {
      background: var(--bg-input);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-md);
      padding: 16px 18px;
    }

    .payment-telemetry-box h4 {
      font-size: 12.5px;
      font-weight: 700;
      color: #38bdf8;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 12px;
    }

    .telemetry-row {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      font-size: 12.5px;
      color: var(--text-secondary);
    }

    .pricing-summary-box {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .price-row {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      color: var(--text-secondary);
    }

    .price-row.subtotal {
      padding-top: 8px;
      border-top: 1px solid var(--border-subtle);
      font-weight: 600;
    }

    .price-row.grand-total {
      padding-top: 10px;
      border-top: 1px solid var(--border-default);
      align-items: center;
    }

    .price-row.grand-total span {
      font-size: 14px;
      font-weight: 800;
      color: var(--text-primary);
    }

    .total-amount {
      font-family: var(--font-heading);
      font-size: 22px;
      font-weight: 800;
      color: var(--success);
    }

    /* Footer */
    .invoice-sheet-footer {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      padding-top: 24px;
      gap: 20px;
    }

    .terms-note {
      font-size: 11px;
      color: var(--text-muted);
      max-width: 440px;
      line-height: 1.4;
    }

    .authorized-signatory {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .signature-line {
      width: 140px;
      height: 1px;
      background: var(--border-default);
      margin-bottom: 6px;
    }

    .authorized-signatory span {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .signatory-sub {
      font-size: 10.5px;
      color: var(--text-muted);
    }

    @media print {
      .no-print { display: none !important; }
      .invoice-sheet {
        box-shadow: none !important;
        border: none !important;
        padding: 0 !important;
        background: #fff !important;
        color: #000 !important;
      }
      .brand-title, strong, .party-content strong, .meta-row strong, .price-row.grand-total span { color: #000 !important; }
      .brand-sub, .party-content p, .party-meta, .price-row, .meta-row, .terms-note, td { color: #333 !important; }
      .party-box, .payment-telemetry-box { background: #f9f9f9 !important; border: 1px solid #ddd !important; }
      .specs-table th { background: #eee !important; color: #000 !important; }
      .total-amount { color: #000 !important; }
    }

    @media (max-width: 768px) {
      .parties-grid, .financial-breakdown-section { grid-template-columns: 1fr; }
      .invoice-sheet { padding: 20px; }
    }
  `]
})
export class InvoiceComponent implements OnInit {
  bookingId = '';
  booking: Booking | null = null;
  payment: Payment | null = null;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.bookingId = this.route.snapshot.paramMap.get('bookingId') || '';
    if (this.bookingId) {
      this.apiService.getBooking(this.bookingId).subscribe({
        next: (b) => { this.booking = b; }
      });
      this.apiService.getPayment(this.bookingId).subscribe({
        next: (p) => { this.payment = p; },
        error: () => {}
      });
    }
  }

  getDeliveryCharge(): number {
    if (!this.booking) return 30;
    return this.booking.parcelDeliveryType === 'Express' ? 80 : this.booking.parcelDeliveryType === 'Same-Day' ? 150 : 30;
  }

  getPackingCharge(): number {
    if (!this.booking) return 10;
    return this.booking.parcelPackingPreference === 'Premium' ? 30 : 10;
  }

  getSubtotal(): number {
    if (!this.booking) return 0;
    const admin = this.booking.bookedBy === 'OFFICER' ? 50 : 0;
    return 50 + (0.02 * this.booking.parcelWeightInGram) + this.getDeliveryCharge() + this.getPackingCharge() + admin;
  }

  getTax(): number {
    return this.getSubtotal() * 0.05;
  }

  printInvoice(): void {
    window.print();
  }

  downloadInvoiceText(): void {
    if (!this.booking) return;
    const b = this.booking;
    const p = this.payment;
    let content = `PARCELSWIFT TAX INVOICE & CONSIGNMENT NOTE
========================================================================
Invoice Number  : INV-${b.bookingId}
Issue Date      : ${b.bookingDate}
Booking Status  : ${b.status}
========================================================================
CONSIGNOR (SENDER)
Name            : ${b.senderName}
Customer ID     : ${b.customerId}
Address         : ${b.senderAddress}
Contact         : ${b.senderContact}

CONSIGNEE (RECEIVER)
Name            : ${b.receiverName}
Address         : ${b.receiverAddress}
Postal PIN      : ${b.receiverPin}
Contact         : ${b.receiverMobile}
========================================================================
CONSIGNMENT DETAILS
Contents        : ${b.parcelContentsDescription}
Weight          : ${b.parcelWeightInGram} grams
Delivery Speed  : ${b.parcelDeliveryType}
Packaging       : ${b.parcelPackingPreference}
Pickup Window   : ${b.parcelPickupTime || 'N/A'}
Drop-off Window : ${b.parcelDropoffTime || 'N/A'}
========================================================================
BILLING BREAKDOWN
Base Carriage Fee     : ₹50.00
Weight Charge         : ₹${(0.02 * b.parcelWeightInGram).toFixed(2)}
Delivery Speed Surcharge : ₹${this.getDeliveryCharge()}.00
Packaging Surcharge   : ₹${this.getPackingCharge()}.00
GST Tax (5%)          : ₹${this.getTax().toFixed(2)}
------------------------------------------------------------------------
TOTAL SERVICE COST    : ₹${b.parcelServiceCost}
========================================================================
`;
    if (p) {
      content += `PAYMENT CONFIRMATION
Payment Reference   : ${p.paymentId}
Transaction ID      : ${p.transactionId}
Payment Method      : ${p.cardType} Card
Settlement Status   : ${p.status}
========================================================================
`;
    }
    content += `Thank you for choosing ParcelSwift Enterprise Logistics!
Support Hotline: 1800-PARCEL-SWIFT (24/7)
`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice_${b.bookingId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
