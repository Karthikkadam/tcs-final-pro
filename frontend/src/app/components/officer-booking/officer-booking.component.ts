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
      <div class="main-content">
        <div class="page-header">
          <h1>Book for Customer</h1>
          <p>Create a booking on behalf of a customer (Admin Fee: ₹50 applies)</p>
        </div>

        <div *ngIf="successMessage" class="alert alert-success">✅ {{ successMessage }}</div>
        <div *ngIf="errorMessage" class="alert alert-error">❌ {{ errorMessage }}</div>

        <div *ngIf="bookingComplete" class="glass-card ack-section">
          <div class="ack-icon">🎉</div>
          <h2>Booking Created!</h2>
          <p>Booking ID: <strong>{{ bookingResult.bookingId }}</strong></p>
          <p>Status: <strong>Assigned</strong> (awaiting customer payment at office)</p>
          <p>Service Cost: <strong>₹{{ bookingResult.serviceCost }}</strong></p>
          <button class="btn btn-primary" (click)="resetBooking()" style="margin-top: 16px;">Create Another Booking</button>
        </div>

        <form *ngIf="!bookingComplete" (ngSubmit)="onSubmit()">
          <div class="glass-card" style="margin-bottom: 16px;">
            <h3 class="section-title">👤 Select Customer</h3>
            <div class="form-group">
              <label>Customer *</label>
              <select class="form-control" [(ngModel)]="selectedCustomerId" name="customer" (ngModelChange)="onCustomerSelect()">
                <option value="">-- Select a customer --</option>
                <option *ngFor="let c of customers" [value]="c.customerId">{{ c.customerId }} - {{ c.name }} ({{ c.email }})</option>
              </select>
            </div>
            <div *ngIf="selectedCustomer" class="customer-info">
              <div class="info-row"><span>Name:</span><strong>{{ selectedCustomer.name }}</strong></div>
              <div class="info-row"><span>Address:</span><strong>{{ selectedCustomer.address }}</strong></div>
              <div class="info-row"><span>Contact:</span><strong>{{ selectedCustomer.countryCode }} {{ selectedCustomer.mobile }}</strong></div>
            </div>
          </div>

          <div class="glass-card" style="margin-bottom: 16px;">
            <h3 class="section-title">📥 Receiver Details</h3>
            <div class="form-group"><label>Receiver Name *</label><input type="text" class="form-control" [(ngModel)]="booking.receiverName" name="rn" required></div>
            <div class="form-group"><label>Receiver Address *</label><input type="text" class="form-control" [(ngModel)]="booking.receiverAddress" name="ra" required></div>
            <div class="form-row">
              <div class="form-group"><label>PIN *</label><input type="text" class="form-control" [(ngModel)]="booking.receiverPin" name="rp" maxlength="6" required></div>
              <div class="form-group"><label>Mobile *</label><input type="text" class="form-control" [(ngModel)]="booking.receiverMobile" name="rm" maxlength="10" required></div>
            </div>
          </div>

          <div class="glass-card" style="margin-bottom: 16px;">
            <h3 class="section-title">📦 Parcel Details</h3>
            <div class="form-row">
              <div class="form-group"><label>Weight (grams) *</label><input type="number" class="form-control" [(ngModel)]="booking.parcelWeightInGram" name="w" min="1" (ngModelChange)="calculateCost()" required></div>
              <div class="form-group"><label>Contents *</label><input type="text" class="form-control" [(ngModel)]="booking.parcelContentsDescription" name="cd" required></div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Delivery Type *</label>
                <select class="form-control" [(ngModel)]="booking.parcelDeliveryType" name="dt" (ngModelChange)="calculateCost()">
                  <option value="Standard">Standard (₹30)</option><option value="Express">Express (₹80)</option><option value="Same-Day">Same-Day (₹150)</option>
                </select>
              </div>
              <div class="form-group">
                <label>Packing *</label>
                <select class="form-control" [(ngModel)]="booking.parcelPackingPreference" name="pp" (ngModelChange)="calculateCost()">
                  <option value="Basic">Basic (₹10)</option><option value="Premium">Premium (₹30)</option>
                </select>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group"><label>Pickup Time *</label><input type="datetime-local" class="form-control" [(ngModel)]="booking.parcelPickupTime" name="pt" required></div>
              <div class="form-group"><label>Drop-off Time *</label><input type="datetime-local" class="form-control" [(ngModel)]="booking.parcelDropoffTime" name="dot" required></div>
            </div>
          </div>

          <div class="glass-card cost-card" style="margin-bottom: 16px;">
            <h3 class="section-title">💰 Cost (includes ₹50 Admin Fee)</h3>
            <div class="cost-total"><span>Total Service Cost</span><span>₹{{ estimatedCost.toFixed(2) }}</span></div>
          </div>

          <button type="submit" class="btn btn-primary btn-lg" [disabled]="loading || !selectedCustomerId">{{ loading ? 'Booking...' : 'Create Booking' }}</button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .section-title { font-size: 16px; margin-bottom: 20px; }
    .customer-info { background: rgba(102,126,234,0.08); border-radius: 10px; padding: 16px; margin-top: 12px; }
    .info-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; }
    .info-row span { color: #a0a3bd; }
    .cost-total { display: flex; justify-content: space-between; font-size: 18px; font-weight: 700; color: #00d4aa; }
    .ack-section { text-align: center; padding: 48px; }
    .ack-icon { font-size: 48px; margin-bottom: 16px; }
    .ack-section h2 { color: #00d4aa; margin-bottom: 16px; }
    .ack-section p { color: #a0a3bd; margin-bottom: 8px; }
    .ack-section strong { color: #fff; }
  `]
})
export class OfficerBookingComponent implements OnInit {
  customers: User[] = [];
  selectedCustomerId = '';
  selectedCustomer: User | null = null;
  booking: any = { parcelWeightInGram: 0, parcelDeliveryType: 'Standard', parcelPackingPreference: 'Basic', parcelPickupTime: '', parcelDropoffTime: '', receiverName: '', receiverAddress: '', receiverPin: '', receiverMobile: '', parcelContentsDescription: '' };
  estimatedCost = 0;
  loading = false;
  successMessage = '';
  errorMessage = '';
  bookingComplete = false;
  bookingResult: any = {};

  constructor(private apiService: ApiService, public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.apiService.getAllCustomers().subscribe({ next: (c) => { this.customers = c; } });
  }

  onCustomerSelect(): void {
    this.selectedCustomer = this.customers.find(c => c.customerId === this.selectedCustomerId) || null;
  }

  calculateCost(): void {
    const dc = this.booking.parcelDeliveryType === 'Express' ? 80 : this.booking.parcelDeliveryType === 'Same-Day' ? 150 : 30;
    const pc = this.booking.parcelPackingPreference === 'Premium' ? 30 : 10;
    this.estimatedCost = Math.round((50 + 0.02 * (this.booking.parcelWeightInGram || 0) + dc + pc + 50) * 1.05 * 100) / 100;
  }

  onSubmit(): void {
    this.errorMessage = '';
    if (!this.selectedCustomer) { this.errorMessage = 'Please select a customer'; return; }
    this.loading = true;
    const payload = { ...this.booking, customerId: this.selectedCustomerId, senderName: this.selectedCustomer.name, senderAddress: this.selectedCustomer.address, senderContact: this.selectedCustomer.mobile };
    this.apiService.createOfficerBooking(payload).subscribe({
      next: (res: any) => { this.loading = false; this.bookingComplete = true; this.bookingResult = res; this.successMessage = res.message; },
      error: (err) => { this.loading = false; this.errorMessage = err.error?.message || 'Booking failed'; }
    });
  }

  resetBooking(): void { this.bookingComplete = false; this.selectedCustomerId = ''; this.selectedCustomer = null; this.estimatedCost = 0; }
}
