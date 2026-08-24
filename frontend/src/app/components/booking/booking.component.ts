import { Component } from '@angular/core';
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
      <div class="main-content">
        <div class="page-header">
          <h1>Book a Parcel</h1>
          <p>Fill in the details to book your parcel delivery service</p>
        </div>

        <div *ngIf="successMessage" class="alert alert-success">✅ {{ successMessage }}</div>
        <div *ngIf="errorMessage" class="alert alert-error">❌ {{ errorMessage }}</div>

        <div *ngIf="bookingComplete" class="glass-card ack-section">
          <div class="ack-icon">🎉</div>
          <h2>Booking Confirmed!</h2>
          <p class="ack-id">Booking ID: <strong>{{ bookingResult.bookingId }}</strong></p>
          <p class="ack-cost">Service Cost: <strong>₹{{ bookingResult.serviceCost }}</strong></p>
          <div class="ack-actions">
            <button class="btn btn-primary" (click)="goToPayment()">Proceed to Payment →</button>
            <button class="btn btn-secondary" (click)="resetBooking()">Book Another</button>
          </div>
        </div>

        <form *ngIf="!bookingComplete" class="booking-form" (ngSubmit)="onSubmit()">
          <div class="form-grid">
            <div class="glass-card">
              <h3 class="section-title">📤 Sender Details</h3>
              <div class="form-group">
                <label>Name</label>
                <input type="text" class="form-control" [value]="authService.getName()" disabled>
              </div>
              <div class="form-group">
                <label>Address</label>
                <input type="text" class="form-control" [value]="authService.getUser()?.address" disabled>
              </div>
              <div class="form-group">
                <label>Contact</label>
                <input type="text" class="form-control" [value]="authService.getUser()?.mobile" disabled>
              </div>
            </div>

            <div class="glass-card">
              <h3 class="section-title">📥 Receiver Details</h3>
              <div class="form-group">
                <label>Receiver Name *</label>
                <input type="text" class="form-control" [(ngModel)]="booking.receiverName" name="receiverName" placeholder="Receiver's full name" required>
              </div>
              <div class="form-group">
                <label>Receiver Address *</label>
                <input type="text" class="form-control" [(ngModel)]="booking.receiverAddress" name="receiverAddress" placeholder="Full delivery address" required>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>PIN Code *</label>
                  <input type="text" class="form-control" [(ngModel)]="booking.receiverPin" name="receiverPin" placeholder="6-digit PIN" maxlength="6" required>
                </div>
                <div class="form-group">
                  <label>Mobile *</label>
                  <input type="text" class="form-control" [(ngModel)]="booking.receiverMobile" name="receiverMobile" placeholder="10-digit mobile" maxlength="10" required>
                </div>
              </div>
            </div>
          </div>

          <div class="glass-card" style="margin-top: 16px;">
            <h3 class="section-title">📦 Parcel Details</h3>
            <div class="form-row">
              <div class="form-group">
                <label>Weight (grams) *</label>
                <input type="number" class="form-control" [(ngModel)]="booking.parcelWeightInGram" name="weight" placeholder="e.g. 2000" min="1" (ngModelChange)="calculateCost()" required>
              </div>
              <div class="form-group">
                <label>Contents Description *</label>
                <input type="text" class="form-control" [(ngModel)]="booking.parcelContentsDescription" name="contents" placeholder="Describe contents" required>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Delivery Type *</label>
                <select class="form-control" [(ngModel)]="booking.parcelDeliveryType" name="deliveryType" (ngModelChange)="calculateCost()">
                  <option value="Standard">🚛 Standard Delivery (₹30)</option>
                  <option value="Express">🚀 Express Delivery (₹80)</option>
                  <option value="Same-Day">⚡ Same-Day Delivery (₹150)</option>
                </select>
              </div>
              <div class="form-group">
                <label>Packing Preference *</label>
                <select class="form-control" [(ngModel)]="booking.parcelPackingPreference" name="packing" (ngModelChange)="calculateCost()">
                  <option value="Basic">📦 Basic Packing (₹10)</option>
                  <option value="Premium">🎁 Premium Packing (₹30)</option>
                </select>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Pickup Time *</label>
                <input type="datetime-local" class="form-control" [(ngModel)]="booking.parcelPickupTime" name="pickupTime" required>
              </div>
              <div class="form-group">
                <label>Drop-off Time *</label>
                <input type="datetime-local" class="form-control" [(ngModel)]="booking.parcelDropoffTime" name="dropoffTime" required>
              </div>
            </div>
          </div>

          <div class="glass-card cost-card" style="margin-top: 16px;">
            <h3 class="section-title">💰 Cost Breakdown</h3>
            <div class="cost-row"><span>Base Rate</span><span>₹50.00</span></div>
            <div class="cost-row"><span>Weight Charge (₹0.02 × {{ booking.parcelWeightInGram || 0 }}g)</span><span>₹{{ (0.02 * (booking.parcelWeightInGram || 0)).toFixed(2) }}</span></div>
            <div class="cost-row"><span>Delivery Charge ({{ booking.parcelDeliveryType }})</span><span>₹{{ getDeliveryCharge() }}</span></div>
            <div class="cost-row"><span>Packing Charge ({{ booking.parcelPackingPreference }})</span><span>₹{{ getPackingCharge() }}</span></div>
            <div class="cost-row"><span>Tax (5%)</span><span>₹{{ getTax().toFixed(2) }}</span></div>
            <div class="cost-total"><span>Total Service Cost</span><span>₹{{ estimatedCost.toFixed(2) }}</span></div>
          </div>

          <div style="margin-top: 20px; display: flex; gap: 12px;">
            <button type="submit" class="btn btn-primary btn-lg" [disabled]="loading">{{ loading ? 'Booking...' : 'Confirm Booking' }}</button>
            <button type="reset" class="btn btn-secondary btn-lg">Reset</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .section-title { font-size: 16px; margin-bottom: 20px; display: flex; align-items: center; gap: 8px; }
    .cost-card { }
    .cost-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 14px; color: #a0a3bd; }
    .cost-total { display: flex; justify-content: space-between; padding: 16px 0 0; font-size: 18px; font-weight: 700; color: #00d4aa; }
    .ack-section { text-align: center; padding: 48px; animation: scaleIn 0.4s ease; }
    .ack-icon { font-size: 48px; margin-bottom: 16px; }
    .ack-section h2 { color: #00d4aa; margin-bottom: 16px; }
    .ack-id, .ack-cost { font-size: 16px; color: #a0a3bd; margin-bottom: 8px; }
    .ack-id strong, .ack-cost strong { color: #fff; }
    .ack-actions { margin-top: 24px; display: flex; gap: 12px; justify-content: center; }
    @media (max-width: 768px) { .form-grid { grid-template-columns: 1fr; } }
  `]
})
export class BookingComponent {
  booking: any = { parcelWeightInGram: 0, parcelDeliveryType: 'Standard', parcelPackingPreference: 'Basic', parcelPickupTime: '', parcelDropoffTime: '', receiverName: '', receiverAddress: '', receiverPin: '', receiverMobile: '', parcelContentsDescription: '' };
  estimatedCost = 0;
  loading = false;
  successMessage = '';
  errorMessage = '';
  bookingComplete = false;
  bookingResult: any = {};

  constructor(private apiService: ApiService, public authService: AuthService, private router: Router) {}

  getDeliveryCharge(): number { return this.booking.parcelDeliveryType === 'Express' ? 80 : this.booking.parcelDeliveryType === 'Same-Day' ? 150 : 30; }
  getPackingCharge(): number { return this.booking.parcelPackingPreference === 'Premium' ? 30 : 10; }
  getSubtotal(): number { return 50 + (0.02 * (this.booking.parcelWeightInGram || 0)) + this.getDeliveryCharge() + this.getPackingCharge(); }
  getTax(): number { return this.getSubtotal() * 0.05; }

  calculateCost(): void {
    this.estimatedCost = Math.round(this.getSubtotal() * 1.05 * 100) / 100;
  }

  onSubmit(): void {
    this.errorMessage = '';
    if (!this.booking.receiverName || !this.booking.receiverAddress || !this.booking.receiverPin || !this.booking.receiverMobile) {
      this.errorMessage = 'All receiver fields are required'; return;
    }
    this.loading = true;
    const user = this.authService.getUser();
    const payload = { ...this.booking, customerId: user.customerId, senderName: user.name, senderAddress: user.address, senderContact: user.mobile };
    this.apiService.createCustomerBooking(payload).subscribe({
      next: (res: any) => { this.loading = false; this.bookingComplete = true; this.bookingResult = res; this.successMessage = res.message; },
      error: (err) => { this.loading = false; this.errorMessage = err.error?.message || 'Booking failed'; }
    });
  }

  goToPayment(): void { this.router.navigate(['/customer/payment', this.bookingResult.bookingId]); }
  resetBooking(): void { this.bookingComplete = false; this.booking = { parcelWeightInGram: 0, parcelDeliveryType: 'Standard', parcelPackingPreference: 'Basic', parcelPickupTime: '', parcelDropoffTime: '', receiverName: '', receiverAddress: '', receiverPin: '', receiverMobile: '', parcelContentsDescription: '' }; this.estimatedCost = 0; }
}
