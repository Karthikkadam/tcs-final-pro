import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Booking, Feedback } from '../../models/models';

@Component({
  selector: 'app-view-all-bookings',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, RouterLink],
  template: `
    <div class="page-container">
      <app-navbar></app-navbar>
      <div class="main-content">
        <div class="page-header">
          <div class="header-content">
            <div>
              <h1>All Bookings</h1>
              <p>System-wide view of all customer & officer parcel bookings</p>
            </div>
            <div class="header-actions" *ngIf="bookings.length > 10">
              <button class="btn btn-secondary" (click)="downloadReport('xls')">📊 Export .XLS</button>
              <button class="btn btn-secondary" (click)="downloadReport('pdf')">📄 Export .PDF</button>
            </div>
          </div>
        </div>

        <div *ngIf="successMessage" class="alert alert-success">✅ {{ successMessage }}</div>
        <div *ngIf="errorMessage" class="alert alert-error">❌ {{ errorMessage }}</div>

        <!-- Filter Controls -->
        <div class="glass-card filter-card">
          <div class="filter-bar">
            <div class="form-group">
              <label>Customer ID</label>
              <input type="text" class="form-control" [(ngModel)]="filterCustomerId" (ngModelChange)="applyFilter()" placeholder="e.g. CUS00001">
            </div>
            <div class="form-group">
              <label>Booking ID</label>
              <input type="text" class="form-control" [(ngModel)]="filterBookingId" (ngModelChange)="applyFilter()" placeholder="e.g. BKG00001">
            </div>
            <div class="form-group">
              <label>Booking Date</label>
              <input type="date" class="form-control" [(ngModel)]="filterDate" (ngModelChange)="applyFilter()">
            </div>
            <div class="form-group">
              <label>Status</label>
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
              <button class="btn btn-secondary" (click)="resetFilters()">Reset</button>
            </div>
          </div>
        </div>

        <!-- Bookings Table -->
        <div class="glass-card table-section" style="margin-top: 20px;">
          <div *ngIf="loading" class="loading-spinner"><div class="spinner"></div></div>

          <div *ngIf="!loading && filteredBookings.length === 0" class="empty-state">
            <p>No bookings found matching criteria.</p>
          </div>

          <div class="table-container" *ngIf="!loading && filteredBookings.length > 0">
            <table>
              <thead>
                <tr>
                  <th>Customer ID</th>
                  <th>Customer Name</th>
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
                  <td>{{ b.senderName }}</td>
                  <td><strong>{{ b.bookingId }}</strong></td>
                  <td>{{ b.bookingDate }}</td>
                  <td>{{ b.receiverName }}</td>
                  <td>{{ b.receiverAddress }}</td>
                  <td class="amount-cell">₹{{ b.parcelServiceCost }}</td>
                  <td>
                    <span class="badge" [ngClass]="'badge-' + b.status.toLowerCase().replace(' ', '')">{{ b.status }}</span>
                  </td>
                  <td class="action-cell">
                    <a [routerLink]="'/officer/invoice/' + b.bookingId" class="btn btn-sm btn-secondary" title="View Invoice">📄 Invoice</a>
                    
                    <button *ngIf="b.status === 'Delivered'" class="btn btn-sm btn-info" (click)="viewFeedback(b.bookingId)" title="View Feedback">⭐ Review</button>
                    
                    <a routerLink="/officer/delivery-status" class="btn btn-sm btn-primary" title="Update Status">🚚 Status</a>
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

        <!-- Feedback Detail Modal -->
        <div *ngIf="showFeedbackModal" class="modal-overlay" (click)="closeFeedbackModal()">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h3>⭐ Parcel Feedback Details</h3>
              <button class="btn btn-sm btn-secondary" (click)="closeFeedbackModal()">✕</button>
            </div>

            <div *ngIf="currentFeedback" class="feedback-details">
              <div class="feedback-row"><span>Order / Booking ID</span><strong>{{ currentFeedback.bookingId }}</strong></div>
              <div class="feedback-row"><span>Customer Name</span><strong>{{ currentFeedback.customerName }}</strong></div>
              <div class="feedback-row">
                <span>Rating</span>
                <span class="stars-display">
                  <span *ngFor="let s of [1,2,3,4,5]" [style.color]="s <= currentFeedback.rating ? '#ffc107' : '#4a4d6b'">★</span>
                  ({{ currentFeedback.rating }}/5)
                </span>
              </div>
              <div class="feedback-row"><span>Date & Time</span><strong>{{ currentFeedback.dateTime }}</strong></div>
              <div class="feedback-description-box">
                <label>Feedback Description:</label>
                <p>{{ currentFeedback.description }}</p>
              </div>
            </div>

            <div *ngIf="!currentFeedback" class="empty-state">
              <p>No feedback has been submitted for this booking yet.</p>
            </div>

            <div class="modal-actions">
              <button class="btn btn-primary" (click)="closeFeedbackModal()">Close</button>
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
    .empty-state { text-align: center; padding: 32px; color: #6b7280; }
    .pagination-container { display: flex; justify-content: space-between; align-items: center; margin-top: 24px; flex-wrap: wrap; gap: 12px; }
    .pagination-info { font-size: 13px; color: #a0a3bd; }
    .btn-info { background: rgba(79, 195, 247, 0.15); color: #4fc3f7; border: 1px solid rgba(79, 195, 247, 0.3); }
    .btn-info:hover { background: rgba(79, 195, 247, 0.3); }
    .feedback-details { background: rgba(255, 255, 255, 0.03); border-radius: 12px; padding: 16px; }
    .feedback-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 14px; }
    .feedback-row span { color: #a0a3bd; }
    .feedback-row strong { color: #fff; }
    .stars-display { font-size: 18px; font-weight: 700; color: #ffc107; }
    .feedback-description-box { margin-top: 14px; }
    .feedback-description-box label { font-size: 12px; color: #a0a3bd; text-transform: uppercase; font-weight: 600; }
    .feedback-description-box p { margin-top: 6px; padding: 12px; background: rgba(0,0,0,0.2); border-radius: 8px; color: #fff; font-size: 14px; line-height: 1.5; }
  `]
})
export class ViewAllBookingsComponent implements OnInit {
  bookings: Booking[] = [];
  filteredBookings: Booking[] = [];
  paginatedBookings: Booking[] = [];

  filterCustomerId = '';
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
  currentFeedback: Feedback | null = null;

  constructor(private apiService: ApiService, public authService: AuthService) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.loading = true;
    this.apiService.getAllBookings().subscribe({
      next: (data) => {
        this.bookings = data;
        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Failed to load all bookings';
      }
    });
  }

  applyFilter(): void {
    this.filteredBookings = this.bookings.filter(b => {
      const matchCust = !this.filterCustomerId || b.customerId.toLowerCase().includes(this.filterCustomerId.toLowerCase());
      const matchId = !this.filterBookingId || b.bookingId.toLowerCase().includes(this.filterBookingId.toLowerCase());
      const matchDate = !this.filterDate || b.bookingDate.startsWith(this.filterDate);
      const matchStatus = !this.filterStatus || b.status.toLowerCase() === this.filterStatus.toLowerCase();
      return matchCust && matchId && matchDate && matchStatus;
    });

    this.currentPage = 1;
    this.updatePagination();
  }

  resetFilters(): void {
    this.filterCustomerId = '';
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

  viewFeedback(bookingId: string): void {
    this.apiService.getFeedbackByBooking(bookingId).subscribe({
      next: (fb) => {
        this.currentFeedback = fb;
        this.showFeedbackModal = true;
      },
      error: () => {
        this.currentFeedback = null;
        this.showFeedbackModal = true;
      }
    });
  }

  closeFeedbackModal(): void {
    this.showFeedbackModal = false;
    this.currentFeedback = null;
  }

  downloadReport(format: string): void {
    let content = 'Customer ID\tCustomer Name\tBooking ID\tBooking Date\tReceiver Name\tDelivered Address\tAmount\tStatus\n';
    this.filteredBookings.forEach(b => {
      content += `${b.customerId}\t"${b.senderName}"\t${b.bookingId}\t${b.bookingDate}\t${b.receiverName}\t"${b.receiverAddress}"\t₹${b.parcelServiceCost}\t${b.status}\n`;
    });

    const blob = new Blob([content], { type: format === 'xls' ? 'application/vnd.ms-excel' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `all_bookings_report.${format === 'xls' ? 'xls' : 'pdf.txt'}`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
