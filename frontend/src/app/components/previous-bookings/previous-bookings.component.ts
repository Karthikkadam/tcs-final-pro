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

      <main class="main-content">
        <!-- Header -->
        <div class="page-header">
          <div>
            <h1>My Shipment History</h1>
            <p>View, filter, track milestones, and manage all your parcel bookings</p>
          </div>

          <div class="header-actions">
            <button class="btn btn-secondary btn-sm" (click)="downloadReport('xls')" [disabled]="bookings.length === 0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Export Excel (.XLS)
            </button>
            <button class="btn btn-secondary btn-sm" (click)="downloadReport('pdf')" [disabled]="bookings.length === 0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              Export Document
            </button>
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

        <!-- Filter Bar Card -->
        <div class="card filter-card">
          <div class="filter-grid">
            <div class="form-group" style="margin-bottom: 0;">
              <label>Filter by Booking ID</label>
              <input 
                type="text" 
                class="form-control" 
                [(ngModel)]="filterBookingId" 
                (ngModelChange)="applyFilter()" 
                placeholder="e.g. BKG00001"
              />
            </div>

            <div class="form-group" style="margin-bottom: 0;">
              <label>Filter by Booking Date</label>
              <input 
                type="date" 
                class="form-control" 
                [(ngModel)]="filterDate" 
                (ngModelChange)="applyFilter()"
              />
            </div>

            <div class="form-group" style="margin-bottom: 0;">
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

            <div class="filter-reset-col">
              <button class="btn btn-secondary btn-block" (click)="resetFilters()">
                Reset
              </button>
            </div>
          </div>
        </div>

        <!-- Data Table Card -->
        <div class="card table-card" style="margin-top: 20px;">
          <div *ngIf="loading" class="loading-spinner">
            <div class="spinner"></div>
          </div>

          <div *ngIf="!loading && filteredBookings.length === 0" class="empty-state">
            <p>No shipments match the selected filters.</p>
          </div>

          <div class="table-container" *ngIf="!loading && filteredBookings.length > 0">
            <table>
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Booking Date</th>
                  <th>Receiver</th>
                  <th>Destination Address</th>
                  <th>Delivery Speed</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let b of paginatedBookings">
                  <td>
                    <strong class="font-mono">{{ b.bookingId }}</strong>
                  </td>
                  <td>{{ b.bookingDate }}</td>
                  <td>
                    <strong>{{ b.receiverName }}</strong>
                    <div style="font-size: 11px; color: var(--text-muted);">{{ b.receiverMobile }}</div>
                  </td>
                  <td>
                    <div style="max-width: 220px; font-size: 12.5px; line-height: 1.3;">
                      {{ b.receiverAddress }}
                    </div>
                  </td>
                  <td>{{ b.parcelDeliveryType }}</td>
                  <td><strong class="text-success">₹{{ b.parcelServiceCost }}</strong></td>
                  <td>
                    <span class="badge" [ngClass]="'badge-' + b.status.toLowerCase().replace(' ', '')">
                      {{ b.status }}
                    </span>
                  </td>
                  <td>
                    <div class="action-buttons-wrap">
                      <a [routerLink]="'/customer/invoice/' + b.bookingId" class="btn btn-secondary btn-sm" title="View Tax Invoice">
                        Invoice
                      </a>
                      
                      <button *ngIf="b.status === 'Delivered'" class="btn btn-success btn-sm" (click)="openFeedbackModal(b)">
                        ★ Feedback
                      </button>
                      
                      <a *ngIf="b.status === 'New'" [routerLink]="'/customer/payment/' + b.bookingId" class="btn btn-primary btn-sm">
                        Pay
                      </a>
                      
                      <a *ngIf="b.status === 'Booked'" routerLink="/customer/cancel" class="btn btn-outline-danger btn-sm">
                        Cancel
                      </a>

                      <a [routerLink]="['/customer/tracking']" [queryParams]="{ id: b.bookingId }" class="btn btn-secondary btn-sm" title="Track Live">
                        Track
                      </a>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination Bar -->
          <div class="pagination-bar" *ngIf="totalPages > 1">
            <div class="pagination-summary">
              Showing {{ (currentPage - 1) * pageSize + 1 }} to {{ getEndIndex() }} of {{ filteredBookings.length }} records
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
              <h3>Parcel Delivery Rating</h3>
              <button class="btn btn-secondary btn-sm" (click)="closeFeedbackModal()">✕</button>
            </div>

            <p style="color: var(--text-secondary); font-size: 13px; margin-bottom: 16px;">
              Booking: <strong class="font-mono" style="color: var(--text-primary);">{{ selectedBookingForFeedback?.bookingId }}</strong>
              (Recipient: {{ selectedBookingForFeedback?.receiverName }})
            </p>

            <div class="form-group">
              <label>Service Rating (1 to 5 Stars) *</label>
              <div class="star-picker">
                <span 
                  *ngFor="let star of [1,2,3,4,5]" 
                  class="star-item"
                  [class.active]="feedbackRating >= star" 
                  (click)="feedbackRating = star"
                >★</span>
                <span class="rating-label">({{ feedbackRating }} of 5 Stars)</span>
              </div>
            </div>

            <div class="form-group">
              <label>Review Description *</label>
              <textarea 
                class="form-control" 
                [(ngModel)]="feedbackDescription" 
                placeholder="Share details on delivery speed, package condition, and overall service experience..." 
                rows="4"
              ></textarea>
            </div>

            <div class="modal-actions">
              <button class="btn btn-secondary" (click)="closeFeedbackModal()">Cancel</button>
              <button class="btn btn-primary" (click)="submitFeedback()" [disabled]="submittingFeedback">
                {{ submittingFeedback ? 'Submitting...' : 'Post Review' }}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .header-actions { display: flex; gap: 8px; }
    .filter-card { padding: 18px; }
    .filter-grid { display: grid; grid-template-columns: 1fr 1fr 1fr 100px; gap: 14px; align-items: flex-end; }
    .filter-reset-col { display: flex; align-items: flex-end; }
    .table-card { padding: 20px; }
    .action-buttons-wrap { display: flex; gap: 5px; flex-wrap: wrap; }
    .pagination-bar { display: flex; justify-content: space-between; align-items: center; margin-top: 18px; padding-top: 16px; border-top: 1px solid var(--border-subtle); flex-wrap: wrap; gap: 12px; }
    .pagination-summary { font-size: 12.5px; color: var(--text-muted); }
    .empty-state { text-align: center; padding: 40px; color: var(--text-muted); }
    .star-picker { display: flex; align-items: center; gap: 6px; }
    .star-item { font-size: 26px; color: var(--border-hover); cursor: pointer; transition: all var(--transition-fast); }
    .star-item.active { color: #fbbf24; text-shadow: 0 0 8px rgba(251, 191, 36, 0.4); }
    .star-item:hover { transform: scale(1.15); }
    .rating-label { font-size: 13px; color: var(--text-secondary); margin-left: 6px; font-weight: 600; }
    @media (max-width: 992px) { .filter-grid { grid-template-columns: 1fr 1fr; } }
    @media (max-width: 640px) { .filter-grid { grid-template-columns: 1fr; } }
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

  // Feedback modal state
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
        this.errorMessage = 'Failed to load shipment history';
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
      this.errorMessage = 'Please provide a feedback description';
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
        this.successMessage = res.message || 'Feedback registered successfully!';
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
    a.download = `my_shipments_${this.authService.getCustomerId()}.${format === 'xls' ? 'xls' : 'txt'}`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
