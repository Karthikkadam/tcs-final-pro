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
      <div class="main-content">
        <div class="page-header">
          <h1>{{ isOfficer ? 'Customer Feedback Overview' : 'Give Parcel Feedback' }}</h1>
          <p>{{ isOfficer ? 'View and analyze feedback from all delivered parcel bookings' : 'Share your delivery experience for your delivered parcels' }}</p>
        </div>

        <div *ngIf="successMessage" class="alert alert-success">✅ {{ successMessage }}</div>
        <div *ngIf="errorMessage" class="alert alert-error">❌ {{ errorMessage }}</div>

        <!-- ================= OFFICER VIEW ================= -->
        <div *ngIf="isOfficer" class="officer-feedback-view">
          <div class="glass-card">
            <h3 class="section-title">⭐ All Delivered Parcel Feedback</h3>

            <div *ngIf="loading" class="loading-spinner"><div class="spinner"></div></div>

            <div *ngIf="!loading && allFeedbackList.length === 0" class="empty-state">
              <p>No feedback has been submitted by customers yet.</p>
            </div>

            <div class="table-container" *ngIf="!loading && allFeedbackList.length > 0">
              <table>
                <thead>
                  <tr>
                    <th>Order / Booking ID</th>
                    <th>Customer Name</th>
                    <th>Rating</th>
                    <th>Feedback Description</th>
                    <th>Date & Time</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let fb of allFeedbackList">
                    <td><strong>{{ fb.bookingId }}</strong></td>
                    <td>{{ fb.customerName }}</td>
                    <td>
                      <span class="star-rating-display">
                        <span *ngFor="let s of [1,2,3,4,5]" [style.color]="s <= fb.rating ? '#ffc107' : '#4a4d6b'">★</span>
                        <strong style="margin-left: 6px;">{{ fb.rating }}/5</strong>
                      </span>
                    </td>
                    <td class="description-cell">{{ fb.description }}</td>
                    <td style="white-space: nowrap; color: #a0a3bd; font-size: 12px;">{{ fb.dateTime }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ================= CUSTOMER VIEW ================= -->
        <div *ngIf="!isOfficer" class="customer-feedback-view">
          <!-- Select delivered booking -->
          <div class="glass-card form-card">
            <h3 class="section-title">📦 Select Delivered Parcel</h3>

            <div *ngIf="loading" class="loading-spinner"><div class="spinner"></div></div>

            <div *ngIf="!loading && deliveredBookings.length === 0" class="empty-state">
              <p>You have no delivered parcels available for feedback at this time.</p>
              <a routerLink="/customer/bookings" class="btn btn-secondary" style="margin-top: 12px;">View All Bookings</a>
            </div>

            <form *ngIf="!loading && deliveredBookings.length > 0" (ngSubmit)="submitFeedback()">
              <div class="form-group">
                <label>Select Delivered Parcel *</label>
                <select class="form-control" [(ngModel)]="selectedBookingId" name="bookingId" (ngModelChange)="onBookingSelected()">
                  <option value="">-- Choose a delivered parcel --</option>
                  <option *ngFor="let b of deliveredBookings" [value]="b.bookingId">
                    {{ b.bookingId }} — Delivered to {{ b.receiverName }} ({{ b.bookingDate }})
                  </option>
                </select>
              </div>

              <div *ngIf="existingFeedback" class="alert alert-info">
                ℹ️ You have already submitted feedback for this parcel:
                <div style="margin-top: 6px;">
                  Rating: <strong>{{ existingFeedback.rating }}/5 ★</strong> | "{{ existingFeedback.description }}"
                </div>
              </div>

              <div *ngIf="selectedBookingId && !existingFeedback">
                <div class="form-group">
                  <label>Rating (1 to 5 Stars) *</label>
                  <div class="star-rating">
                    <span *ngFor="let star of [1,2,3,4,5]" class="star" 
                          [class.active]="newRating >= star" 
                          (click)="newRating = star">★</span>
                  </div>
                </div>

                <div class="form-group">
                  <label>Feedback Description *</label>
                  <textarea class="form-control" [(ngModel)]="newDescription" name="description"
                            placeholder="How was the delivery speed, packaging condition, and service?" rows="4" required></textarea>
                </div>

                <button type="submit" class="btn btn-primary btn-lg" [disabled]="submitting">
                  {{ submitting ? 'Submitting...' : 'Submit Feedback' }}
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .section-title { font-size: 16px; margin-bottom: 20px; }
    .star-rating-display { font-size: 16px; display: inline-flex; align-items: center; }
    .description-cell { max-width: 320px; line-height: 1.4; }
    .empty-state { text-align: center; padding: 40px; color: #6b7280; }
    .star-rating { display: flex; gap: 8px; font-size: 32px; cursor: pointer; margin-top: 4px; }
    .star-rating .star { color: #4a4d6b; transition: all 0.2s; }
    .star-rating .star.active { color: #ffc107; text-shadow: 0 0 12px rgba(255, 193, 7, 0.5); }
    .star-rating .star:hover { transform: scale(1.2); }
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
        this.errorMessage = 'Failed to load feedback list';
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
        this.errorMessage = 'Failed to load delivered bookings';
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
      this.errorMessage = 'Please select a delivered booking';
      return;
    }
    if (!this.newDescription.trim()) {
      this.errorMessage = 'Feedback description is required';
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
        this.successMessage = res.message || 'Feedback submitted successfully!';
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
