import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Booking } from '../../models/models';

@Component({
  selector: 'app-previous-bookings',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, RouterLink],
  template: `
    <div class="page-container">
      <app-navbar></app-navbar>
      <div class="main-content">
        <div class="page-header">
          <div class="header-content">
            <div>
              <h1>Previous Bookings</h1>
              <p>View, filter, track, and manage your parcel booking history</p>
            </div>
            <div class="header-actions" *ngIf="bookings.length > 10">
              <button class="btn btn-secondary" (click)="downloadReport('xls')">📊 Export .XLS</button>
              <button class="btn btn-secondary" (click)="downloadReport('pdf')">📄 Export .PDF</button>
            </div>
          </div>
        </div>

        <div *ngIf="successMessage" class="alert alert-success">✅ {{ successMessage }}</div>
        <div *ngIf="errorMessage" class="alert alert-error">❌ {{ errorMessage }}</div>

        <!-- Filter Bar -->
        <div class="glass-card filter-card">
          <div class="filter-bar">
            <div class="form-group">
              <label>Filter by Booking ID</label>
              <input type="text" class="form-control" [(ngModel)]="filterBookingId" (ngModelChange)="applyFilter()" placeholder="e.g. BKG00001">
            </div>
            <div class="form-group">
              <label>Filter by Booking Date</label>
              <input type="date" class="form-control" [(ngModel)]="filterDate" (ngModelChange)="applyFilter()">
            </div>
            <div class="form-group">
              <label>Filter by Status</label>
              <select class="form-control" [(ngModel)]="filterStatus" (ngModelChange)="applyFilter()">
                <option value="">All Statuses</option>
                <option value="New">New</option>
                <option value="Scheduled">Scheduled</option>
                <option value="PickedUp">Picked Up</option>
                <option value="Assigned">Assigned</option>
                <option value="Booked">Booked</option>
                <option value="InTransit">In Transit</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div class="form-group" style="flex: 0 0 auto;">
              <button class="btn btn-secondary" (click)="resetFilters()">Reset Filters</button>
            </div>
          </div>
        </div>

        <!-- Bookings Table -->
        <div class="glass-card table-section" style="margin-top: 20px;">
          <div *ngIf="loading" class="loading-spinner"><div class="spinner"></div></div>

          <div *ngIf="!loading && filteredBookings.length === 0" class="empty-state">
            <p>No bookings match the selected criteria.</p>
          </div>

          <div class="table-container" *ngIf="!loading && filteredBookings.length > 0">
            <table>
              <thead>
                <tr>
                  <th>Customer ID</th>
                  <th>Booking ID</th>
                  <th>Booking Date</th>
                  <th>Receiver Name</th>
                  <th>Delivered Address</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let b of paginatedBookings">
                  <td>{{ b.customerId }}</td>
                  <td><strong>{{ b.bookingId }}</strong></td>
                  <td>{{ b.bookingDate }}</td>
                  <td>{{ b.receiverName }}</td>
                  <td>{{ b.receiverAddress }}</td>
                  <td class="amount-cell">₹{{ b.parcelServiceCost }}</td>
                  <td>
                    <span class="badge" [ngClass]="'badge-' + b.status.toLowerCase().replace(' ', '')">{{ b.status }}</span>
                  </td>
                  <td class="action-cell">
                    <a [routerLink]="'/customer/invoice/' + b.bookingId" class="btn btn-sm btn-secondary" title="View Invoice">📄 Invoice</a>
                    
                    <button *ngIf="b.status === 'Delivered'" class="btn btn-sm btn-success" (click)="openFeedbackModal(b)">⭐ Feedback</button>
                    
                    <a *ngIf="b.status === 'New'" [routerLink]="'/customer/payment/' + b.bookingId" class="btn btn-sm btn-primary">💳 Pay</a>
                    
                    <a *ngIf="b.status === 'Booked'" routerLink="/customer/cancel" class="btn btn-sm btn-danger" title="Cancel Booking">✕ Cancel</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="pagination-container" *ngIf="totalPages > 1">
            <div class="pagination-info">
              Showing {{ (currentPage - 1) * pageSize + 1 }} to {{ getEndIndex() }} of {{ filteredBookings.length }} bookings
            </div>
            <div class="pagination">
              <button (click)="goToPage(currentPage - 1)" [disabled]="currentPage === 1">« Prev</button>
              <button *ngFor="let p of pagesArray" (click)="goToPage(p)" [class.active]="currentPage === p">{{ p }}</button>
              <button (click)="goToPage(currentPage + 1)" [disabled]="currentPage === totalPages">Next »</button>
            </div>
          </div>
        </div>

        <!-- Feedback Modal -->
        <div *ngIf="showFeedbackModal" class="modal-overlay" (click)="closeFeedbackModal()">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h3>⭐ Give Feedback for Parcel</h3>
              <button class="btn btn-sm btn-secondary" (click)="closeFeedbackModal()">✕</button>
            </div>
            <p style="color: #a0a3bd; font-size: 13px; margin-bottom: 16px;">
              Booking ID: <strong>{{ selectedBookingForFeedback?.bookingId }}</strong> (Delivered to {{ selectedBookingForFeedback?.receiverName }})
            </p>

            <div class="form-group">
              <label>Rating (1 to 5 Stars) *</label>
              <div class="star-rating">
                <span *ngFor="let star of [1,2,3,4,5]" class="star" [class.active]="feedbackRating >= star" (click)="feedbackRating = star">★</span>
              </div>
            </div>

            <div class="form-group">
              <label>Feedback Description *</label>
              <textarea class="form-control" [(ngModel)]="feedbackDescription" placeholder="Share your delivery experience, packaging quality, timeliness, etc." rows="4"></textarea>
            </div>

            <div class="modal-actions">
              <button class="btn btn-secondary" (click)="closeFeedbackModal()">Cancel</button>
              <button class="btn btn-primary" (click)="submitFeedback()" [disabled]="submittingFeedback">
                {{ submittingFeedback ? 'Submitting...' : 'Submit Feedback' }}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .header-content { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; }
    .header-actions { display: flex; gap: 10px; }
    .filter-card { padding: 20px; }
    .table-section { padding: 24px; }
    .amount-cell { font-weight: 600; color: #00d4aa; }
    .action-cell { display: flex; gap: 6px; flex-wrap: wrap; }
    .empty-state { text-align: center; padding: 48px; color: #6b7280; }
    .pagination-container { display: flex; justify-content: space-between; align-items: center; margin-top: 24px; flex-wrap: wrap; gap: 12px; }
    .pagination-info { font-size: 13px; color: #a0a3bd; }
    .star-rating { display: flex; gap: 8px; font-size: 28px; cursor: pointer; }
    .star-rating .star { color: #4a4d6b; transition: all 0.2s; }
    .star-rating .star.active { color: #ffc107; text-shadow: 0 0 10px rgba(255, 193, 7, 0.5); }
    .star-rating .star:hover { transform: scale(1.2); }
  `]
})
export class PreviousBookingsComponent implements OnInit {
  bookings: Booking[] = [];
  filteredBookings: Booking[] = [];
  paginatedBookings: Booking[] = [];

  filterBookingId = '';
  filterDate = '';
  filterStatus = '';

  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  pagesArray: number[] = [];

  loading = true;
  successMessage = '';
  errorMessage = '';

  // Feedback modal
  showFeedbackModal = false;
  selectedBookingForFeedback: Booking | null = null;
  feedbackRating = 5;
  feedbackDescription = '';
  submittingFeedback = false;

  constructor(private apiService: ApiService, public authService: AuthService) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.loading = true;
    const custId = this.authService.getCustomerId();
    this.apiService.getCustomerBookings(custId).subscribe({
      next: (data) => {
        this.bookings = data;
        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Failed to load booking history';
      }
    });
  }

  applyFilter(): void {
    this.filteredBookings = this.bookings.filter(b => {
      const matchId = !this.filterBookingId || b.bookingId.toLowerCase().includes(this.filterBookingId.toLowerCase());
      const matchDate = !this.filterDate || b.bookingDate.startsWith(this.filterDate);
      const matchStatus = !this.filterStatus || b.status.toLowerCase() === this.filterStatus.toLowerCase();
      return matchId && matchDate && matchStatus;
    });

    this.currentPage = 1;
    this.updatePagination();
  }

  resetFilters(): void {
    this.filterBookingId = '';
    this.filterDate = '';
    this.filterStatus = '';
    this.applyFilter();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredBookings.length / this.pageSize) || 1;
    this.pagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    const start = (this.currentPage - 1) * this.pageSize;
    this.paginatedBookings = this.filteredBookings.slice(start, start + this.pageSize);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  getEndIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredBookings.length);
  }

  openFeedbackModal(b: Booking): void {
    this.selectedBookingForFeedback = b;
    this.feedbackRating = 5;
    this.feedbackDescription = '';
    this.showFeedbackModal = true;
  }

  closeFeedbackModal(): void {
    this.showFeedbackModal = false;
    this.selectedBookingForFeedback = null;
  }

  submitFeedback(): void {
    if (!this.feedbackDescription.trim()) {
      this.errorMessage = 'Feedback description is required';
      return;
    }
    if (!this.selectedBookingForFeedback) return;

    this.submittingFeedback = true;
    const payload = {
      bookingId: this.selectedBookingForFeedback.bookingId,
      customerId: this.authService.getCustomerId(),
      customerName: this.authService.getName(),
      description: this.feedbackDescription,
      rating: this.feedbackRating
    };

    this.apiService.addFeedback(payload).subscribe({
      next: (res: any) => {
        this.submittingFeedback = false;
        this.closeFeedbackModal();
        this.successMessage = res.message || 'Feedback submitted successfully!';
      },
      error: (err) => {
        this.submittingFeedback = false;
        this.errorMessage = err.error?.message || 'Failed to submit feedback';
      }
    });
  }

  downloadReport(format: string): void {
    let content = 'Customer ID\tBooking ID\tBooking Date\tReceiver Name\tDelivered Address\tAmount\tStatus\n';
    this.filteredBookings.forEach(b => {
      content += `${b.customerId}\t${b.bookingId}\t${b.bookingDate}\t${b.receiverName}\t"${b.receiverAddress}"\t₹${b.parcelServiceCost}\t${b.status}\n`;
    });

    const blob = new Blob([content], { type: format === 'xls' ? 'application/vnd.ms-excel' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `previous_bookings_${this.authService.getCustomerId()}.${format === 'xls' ? 'xls' : 'pdf.txt'}`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
