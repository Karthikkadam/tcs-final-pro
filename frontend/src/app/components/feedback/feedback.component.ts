import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Booking, Feedback } from '../../models/models';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, RouterLink],
  template: `
    <div class="page-container">
      <app-navbar></app-navbar>

      <main class="main-content">
        <div class="page-header">
          <div>
            <div class="role-badge" [ngClass]="isOfficer ? 'role-officer' : 'role-customer'" style="margin-bottom: 8px;">
              {{ isOfficer ? 'Quality Assurance' : 'Customer Review' }}
            </div>
            <h1>{{ isOfficer ? 'Customer Feedback & Ratings Overview' : 'Rate Your Delivered Shipment' }}</h1>
            <p>{{ isOfficer ? 'Analyze delivery satisfaction scores, verified reviews, and recipient feedback' : 'Help us maintain exceptional service quality by rating your delivered parcels' }}</p>
          </div>
        </div>

        <div *ngIf="successMessage" class="alert alert-success">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          <span>{{ successMessage }}</span>
        </div>

        <div *ngIf="errorMessage" class="alert alert-error">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          <span>{{ errorMessage }}</span>
        </div>

        <!-- ================= OFFICER VIEW ================= -->
        <div *ngIf="isOfficer" class="officer-view-wrap">
          <div class="card table-card">
            <div class="card-top-bar">
              <div>
                <h2>Delivered Parcel Feedback Log</h2>
                <p>Verified customer ratings and review comments across the delivery network</p>
              </div>
            </div>

            <div *ngIf="loading" class="loading-spinner"><div class="spinner"></div></div>

            <div *ngIf="!loading && allFeedbackList.length === 0" class="empty-state">
              <p>No customer feedback records have been logged yet.</p>
            </div>

            <div class="table-container" *ngIf="!loading && allFeedbackList.length > 0">
              <table>
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Customer Name</th>
                    <th>Rating</th>
                    <th>Review Description</th>
                    <th>Submitted At</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let fb of allFeedbackList">
                    <td><strong class="font-mono">{{ fb.bookingId }}</strong></td>
                    <td>{{ fb.customerName }}</td>
                    <td>
                      <div class="star-rating-pill">
                        <span *ngFor="let s of [1,2,3,4,5]" [style.color]="s <= fb.rating ? '#fbbf24' : '#334155'">★</span>
                        <strong style="margin-left: 6px;">{{ fb.rating }}/5</strong>
                      </div>
                    </td>
                    <td>
                      <div class="review-desc-cell">"{{ fb.description }}"</div>
                    </td>
                    <td class="font-mono text-muted" style="white-space: nowrap; font-size: 12px;">{{ fb.dateTime }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ================= CUSTOMER VIEW ================= -->
        <div *ngIf="!isOfficer" class="customer-view-wrap">
          <div class="card feedback-form-card">
            <h3 class="section-title">Select Delivered Package</h3>

            <div *ngIf="loading" class="loading-spinner"><div class="spinner"></div></div>

            <div *ngIf="!loading && deliveredBookings.length === 0" class="empty-state">
              <div class="empty-icon-box">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="m7.5 4.27 9 5.15"/>
                  <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
                  <path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>
                </svg>
              </div>
              <h3>No delivered parcels available</h3>
              <p>Feedback can be posted once a parcel delivery is completed and marked as 'Delivered'.</p>
              <a routerLink="/customer/bookings" class="btn btn-secondary" style="margin-top: 14px;">
                View All Shipments
              </a>
            </div>

            <form *ngIf="!loading && deliveredBookings.length > 0" (ngSubmit)="submitFeedback()">
              <div class="form-group">
                <label>Choose Delivered Parcel *</label>
                <select class="form-control" [(ngModel)]="selectedBookingId" name="bookingId" (ngModelChange)="onBookingSelected()">
                  <option value="">-- Select a completed delivery --</option>
                  <option *ngFor="let b of deliveredBookings" [value]="b.bookingId">
                    {{ b.bookingId }} — Delivered to {{ b.receiverName }} on {{ b.bookingDate }}
                  </option>
                </select>
              </div>

              <!-- Existing Feedback Alert -->
              <div *ngIf="existingFeedback" class="existing-fb-card">
                <div class="existing-fb-header">
                  <span class="text-success">✓ Review Submitted for this shipment</span>
                  <div class="star-rating-pill">
                    <span *ngFor="let s of [1,2,3,4,5]" [style.color]="s <= existingFeedback.rating ? '#fbbf24' : '#334155'">★</span>
                    <strong>{{ existingFeedback.rating }}/5</strong>
                  </div>
                </div>
                <p class="existing-fb-text">"{{ existingFeedback.description }}"</p>
                <div class="existing-fb-date font-mono">Logged: {{ existingFeedback.dateTime }}</div>
              </div>

              <!-- New Feedback Form -->
              <div *ngIf="selectedBookingId && !existingFeedback">
                <div class="form-group">
                  <label>Overall Experience Rating *</label>
                  <div class="star-picker">
                    <span 
                      *ngFor="let star of [1,2,3,4,5]" 
                      class="star-item"
                      [class.active]="newRating >= star" 
                      (click)="newRating = star"
                    >★</span>
                    <span class="rating-label">({{ newRating }} of 5 Stars)</span>
                  </div>
                </div>

                <div class="form-group">
                  <label>Your Feedback & Comments *</label>
                  <textarea 
                    class="form-control" 
                    [(ngModel)]="newDescription" 
                    name="description"
                    placeholder="How was the delivery speed, packaging quality, courier professional behavior, etc.?" 
                    rows="4" 
                    required
                  ></textarea>
                </div>

                <button type="submit" class="btn btn-primary btn-lg" [disabled]="submitting">
                  <span *ngIf="submitting" class="spinner-sm"></span>
                  <span>{{ submitting ? 'Posting Review...' : 'Post Customer Feedback' }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .card-top-bar { margin-bottom: 20px; }
    .card-top-bar h2 { font-size: 18px; font-weight: 800; color: var(--text-primary); }
    .card-top-bar p { font-size: 13px; color: var(--text-muted); margin-top: 2px; }
    .table-card { padding: 24px; }
    .star-rating-pill { display: inline-flex; align-items: center; gap: 3px; font-size: 14px; color: #fbbf24; }
    .review-desc-cell { max-width: 380px; font-size: 13px; line-height: 1.4; color: var(--text-primary); }
    .feedback-form-card { max-width: 680px; padding: 28px; }
    .section-title { font-size: 16px; font-weight: 700; color: var(--text-primary); margin-bottom: 18px; }
    .star-picker { display: flex; align-items: center; gap: 6px; }
    .star-item { font-size: 28px; color: var(--border-hover); cursor: pointer; transition: all var(--transition-fast); }
    .star-item.active { color: #fbbf24; text-shadow: 0 0 8px rgba(251, 191, 36, 0.4); }
    .star-item:hover { transform: scale(1.15); }
    .rating-label { font-size: 13px; color: var(--text-secondary); margin-left: 8px; font-weight: 600; }
    .existing-fb-card { background: var(--bg-input); border: 1px solid var(--border-default); border-radius: var(--radius-md); padding: 18px; margin-top: 16px; }
    .existing-fb-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; font-size: 13.5px; font-weight: 600; }
    .existing-fb-text { font-size: 13.5px; color: var(--text-primary); line-height: 1.5; background: var(--bg-surface); padding: 12px; border-radius: var(--radius-sm); }
    .existing-fb-date { font-size: 11px; color: var(--text-muted); margin-top: 8px; }
    .empty-state { text-align: center; padding: 40px; color: var(--text-muted); }
    .empty-icon-box { width: 50px; height: 50px; border-radius: 50%; background: var(--bg-surface-raised); border: 1px solid var(--border-default); color: var(--text-muted); display: inline-flex; align-items: center; justify-content: center; margin-bottom: 12px; }
    .spinner-sm { display: inline-block; width: 14px; height: 14px; border: 2px solid rgba(255, 255, 255, 0.2); border-top-color: #fff; border-radius: 50%; animation: spin 0.75s linear infinite; }
  `]
})
export class FeedbackComponent implements OnInit {
  isOfficer = false;
  loading = true;
  submitting = false;

  successMessage = '';
  errorMessage = '';

  // Officer Data
  allFeedbackList: Feedback[] = [];

  // Customer Data
  deliveredBookings: Booking[] = [];
  selectedBookingId = '';
  existingFeedback: Feedback | null = null;
  newRating = 5;
  newDescription = '';

  constructor(private apiService: ApiService, public authService: AuthService) {}

  ngOnInit(): void {
    this.isOfficer = this.authService.getRole() === 'OFFICER';
    if (this.isOfficer) {
      this.loadAllFeedback();
    } else {
      this.loadDeliveredBookings();
    }
  }

  loadAllFeedback(): void {
    this.loading = true;
    this.apiService.getAllFeedback().subscribe({
      next: (data) => {
        this.allFeedbackList = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Failed to load customer feedback registry';
      }
    });
  }

  loadDeliveredBookings(): void {
    this.loading = true;
    const custId = this.authService.getCustomerId();
    this.apiService.getCustomerBookings(custId).subscribe({
      next: (bookings) => {
        this.deliveredBookings = bookings.filter(b => b.status === 'Delivered');
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Failed to load delivered parcel list';
      }
    });
  }

  onBookingSelected(): void {
    this.existingFeedback = null;
    this.errorMessage = '';
    if (!this.selectedBookingId) return;

    this.apiService.getFeedbackByBooking(this.selectedBookingId).subscribe({
      next: (fb) => {
        this.existingFeedback = fb;
      },
      error: () => {
        this.existingFeedback = null;
      }
    });
  }

  submitFeedback(): void {
    if (!this.selectedBookingId) {
      this.errorMessage = 'Please select a delivered parcel';
      return;
    }
    if (!this.newDescription.trim()) {
      this.errorMessage = 'Please provide a feedback description';
      return;
    }

    this.submitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payload = {
      bookingId: this.selectedBookingId,
      customerId: this.authService.getCustomerId(),
      customerName: this.authService.getName(),
      description: this.newDescription,
      rating: this.newRating
    };

    this.apiService.addFeedback(payload).subscribe({
      next: (res: any) => {
        this.submitting = false;
        this.successMessage = res.message || 'Feedback successfully recorded!';
        this.newDescription = '';
        this.newRating = 5;
        this.onBookingSelected();
      },
      error: (err) => {
        this.submitting = false;
        this.errorMessage = err.error?.message || 'Failed to submit feedback';
      }
    });
  }
}
