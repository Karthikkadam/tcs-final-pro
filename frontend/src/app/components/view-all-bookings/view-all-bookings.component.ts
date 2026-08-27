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

      <main class="main-content">
        <div class="page-header">
          <div>
            <div class="role-badge role-officer" style="margin-bottom: 8px;">System Master Registry</div>
            <h1>All System Bookings</h1>
            <p>Comprehensive ledger of customer and officer parcel bookings across the network</p>
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

        <div *ngIf="errorMessage" class="alert alert-error">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          <span>{{ errorMessage }}</span>
        </div>

        <!-- Filter Controls Card -->
        <div class="card filter-card">
          <div class="filter-grid">
            <div class="form-group" style="margin-bottom: 0;">
              <label>Customer ID</label>
              <input 
                type="text" 
                class="form-control" 
                [(ngModel)]="filterCustomerId" 
                (ngModelChange)="applyFilter()" 
                placeholder="e.g. CUS00001"
              />
            </div>

            <div class="form-group" style="margin-bottom: 0;">
              <label>Booking ID</label>
              <input 
                type="text" 
                class="form-control" 
                [(ngModel)]="filterBookingId" 
                (ngModelChange)="applyFilter()" 
                placeholder="e.g. BKG00001"
              />
            </div>

            <div class="form-group" style="margin-bottom: 0;">
              <label>Booking Date</label>
              <input 
                type="date" 
                class="form-control" 
                [(ngModel)]="filterDate" 
                (ngModelChange)="applyFilter()"
              />
            </div>

            <div class="form-group" style="margin-bottom: 0;">
              <label>Milestone Status</label>
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

        <!-- System Table Card -->
        <div class="card table-card" style="margin-top: 20px;">
          <div *ngIf="loading" class="loading-spinner">
            <div class="spinner"></div>
          </div>

          <div *ngIf="!loading && filteredBookings.length === 0" class="empty-state">
            <p>No system bookings match the selected criteria.</p>
          </div>

          <div class="table-container" *ngIf="!loading && filteredBookings.length > 0">
            <table>
              <thead>
                <tr>
                  <th>Customer ID</th>
                  <th>Sender</th>
                  <th>Booking ID</th>
                  <th>Date</th>
                  <th>Recipient</th>
                  <th>Address</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Operations</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let b of paginatedBookings">
                  <td>
                    <span class="font-mono text-muted">{{ b.customerId }}</span>
                  </td>
                  <td><strong>{{ b.senderName }}</strong></td>
                  <td>
                    <strong class="font-mono">{{ b.bookingId }}</strong>
                  </td>
                  <td>{{ b.bookingDate }}</td>
                  <td>{{ b.receiverName }}</td>
                  <td>
                    <div style="max-width: 200px; font-size: 12px; line-height: 1.3;">
                      {{ b.receiverAddress }}
                    </div>
                  </td>
                  <td><strong class="text-success">₹{{ b.parcelServiceCost }}</strong></td>
                  <td>
                    <span class="badge" [ngClass]="'badge-' + b.status.toLowerCase().replace(' ', '')">
                      {{ b.status }}
                    </span>
                  </td>
                  <td>
                    <div class="action-buttons-wrap">
                      <a [routerLink]="'/officer/invoice/' + b.bookingId" class="btn btn-secondary btn-sm" title="View Invoice">
                        Invoice
                      </a>
                      
                      <button *ngIf="b.status === 'Delivered'" class="btn btn-success btn-sm" (click)="viewFeedback(b.bookingId)">
                        ★ Review
                      </button>
                      
                      <a routerLink="/officer/delivery-status" class="btn btn-primary btn-sm">
                        Status
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

        <!-- Feedback Detail Modal -->
        <div *ngIf="showFeedbackModal" class="modal-overlay" (click)="closeFeedbackModal()">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h3>Customer Feedback Record</h3>
              <button class="btn btn-secondary btn-sm" (click)="closeFeedbackModal()">✕</button>
            </div>

            <div *ngIf="currentFeedback" class="feedback-details-box">
              <div class="feedback-row">
                <span>Booking ID:</span>
                <strong class="font-mono">{{ currentFeedback.bookingId }}</strong>
              </div>
              <div class="feedback-row">
                <span>Customer Name:</span>
                <strong>{{ currentFeedback.customerName }}</strong>
              </div>
              <div class="feedback-row">
                <span>Rating:</span>
                <span class="stars-display">
                  <span *ngFor="let s of [1,2,3,4,5]" [style.color]="s <= currentFeedback.rating ? '#fbbf24' : '#334155'">★</span>
                  <strong style="margin-left: 6px; color: var(--text-primary);">{{ currentFeedback.rating }}/5</strong>
                </span>
              </div>
              <div class="feedback-row">
                <span>Submitted At:</span>
                <span>{{ currentFeedback.dateTime }}</span>
              </div>
              <div class="feedback-review-text">
                <label>Customer Review:</label>
                <p>"{{ currentFeedback.description }}"</p>
              </div>
            </div>

            <div *ngIf="!currentFeedback" class="empty-state">
              <p>No feedback record has been posted for this shipment.</p>
            </div>

            <div class="modal-actions">
              <button class="btn btn-primary" (click)="closeFeedbackModal()">Close</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .header-actions { display: flex; gap: 8px; }
    .filter-card { padding: 18px; }
    .filter-grid { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr 100px; gap: 14px; align-items: flex-end; }
    .filter-reset-col { display: flex; align-items: flex-end; }
    .table-card { padding: 20px; }
    .action-buttons-wrap { display: flex; gap: 5px; flex-wrap: wrap; }
    .pagination-bar { display: flex; justify-content: space-between; align-items: center; margin-top: 18px; padding-top: 16px; border-top: 1px solid var(--border-subtle); flex-wrap: wrap; gap: 12px; }
    .pagination-summary { font-size: 12.5px; color: var(--text-muted); }
    .empty-state { text-align: center; padding: 40px; color: var(--text-muted); }
    .feedback-details-box { background: var(--bg-input); border: 1px solid var(--border-default); border-radius: var(--radius-md); padding: 18px; }
    .feedback-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border-subtle); font-size: 13.5px; }
    .feedback-row span { color: var(--text-secondary); }
    .stars-display { font-size: 16px; display: inline-flex; align-items: center; }
    .feedback-review-text { margin-top: 14px; }
    .feedback-review-text label { font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; display: block; margin-bottom: 6px; }
    .feedback-review-text p { font-size: 13.5px; color: var(--text-primary); line-height: 1.5; background: var(--bg-surface); padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); }
    @media (max-width: 1200px) { .filter-grid { grid-template-columns: 1fr 1fr 1fr; } }
    @media (max-width: 768px) { .filter-grid { grid-template-columns: 1fr; } }
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
  errorMessage = '';

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
        this.errorMessage = 'Failed to load system bookings registry';
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
    a.download = `system_bookings_report.${format === 'xls' ? 'xls' : 'txt'}`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
