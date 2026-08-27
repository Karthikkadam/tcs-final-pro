import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { Booking } from '../../models/models';

@Component({
  selector: 'app-customer-home',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  template: `
    <div class="page-container">
      <app-navbar></app-navbar>
      
      <main class="main-content">
        <!-- Dashboard Welcome Banner -->
        <div class="welcome-banner card">
          <div class="welcome-left">
            <div class="greeting-pill">
              <span class="pulse-dot"></span>
              Customer Operations Dashboard
            </div>
            <h1>Welcome back, {{ authService.getName() }}</h1>
            <p>Manage your shipments, initiate bookings, track real-time dispatches, and download invoices.</p>
          </div>

          <div class="welcome-stats">
            <div class="welcome-stat-box">
              <span class="stat-num">{{ recentBookings.length }}</span>
              <span class="stat-lbl">Recent Orders</span>
            </div>
            <div class="welcome-stat-box">
              <span class="stat-num">{{ getActiveCount() }}</span>
              <span class="stat-lbl">In Transit / Active</span>
            </div>
            <div class="welcome-stat-box">
              <span class="stat-num">{{ getDeliveredCount() }}</span>
              <span class="stat-lbl">Delivered</span>
            </div>
          </div>
        </div>

        <!-- Quick Action Cards -->
        <div class="actions-grid">
          <a routerLink="/customer/booking" class="action-tile card">
            <div class="tile-icon-box primary">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 16h6"/><path d="M19 13v6"/><path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>
              </svg>
            </div>
            <div class="tile-content">
              <h3>Book New Parcel</h3>
              <p>Calculate service fees and book doorstep parcel pickup</p>
            </div>
            <div class="tile-arrow">→</div>
          </a>

          <a routerLink="/customer/tracking" class="action-tile card">
            <div class="tile-icon-box info">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
              </svg>
            </div>
            <div class="tile-content">
              <h3>Live Tracking</h3>
              <p>Track parcel milestone timeline and carrier status</p>
            </div>
            <div class="tile-arrow">→</div>
          </a>

          <a routerLink="/customer/bookings" class="action-tile card">
            <div class="tile-icon-box success">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M14 8H8"/><path d="M16 12H8"/><path d="M13 16H8"/>
              </svg>
            </div>
            <div class="tile-content">
              <h3>Booking History</h3>
              <p>View all previous shipments and tax invoices</p>
            </div>
            <div class="tile-arrow">→</div>
          </a>

          <a routerLink="/customer/support" class="action-tile card">
            <div class="tile-icon-box purple">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
              </svg>
            </div>
            <div class="tile-content">
              <h3>Customer Support</h3>
              <p>24/7 helpline, ticket queries, and delivery assistance</p>
            </div>
            <div class="tile-arrow">→</div>
          </a>
        </div>

        <!-- Recent Shipments Table Section -->
        <div class="recent-section card">
          <div class="section-card-header">
            <div>
              <h2>Recent Shipments</h2>
              <p>Latest parcels booked under Customer ID: <strong class="font-mono">{{ authService.getCustomerId() }}</strong></p>
            </div>
            <a routerLink="/customer/bookings" class="btn btn-secondary btn-sm">
              View All History →
            </a>
          </div>

          <div *ngIf="loading" class="loading-spinner">
            <div class="spinner"></div>
          </div>

          <div *ngIf="!loading && recentBookings.length === 0" class="empty-state">
            <div class="empty-icon-box">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="m7.5 4.27 9 5.15"/>
                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
                <path d="m3.3 7 8.7 5 8.7-5"/>
                <path d="M12 22V12"/>
              </svg>
            </div>
            <h3>No shipments booked yet</h3>
            <p>Ready to ship your first package? Book your parcel delivery in just 2 minutes.</p>
            <a routerLink="/customer/booking" class="btn btn-primary" style="margin-top: 14px;">
              Book First Parcel →
            </a>
          </div>

          <div class="table-container" *ngIf="!loading && recentBookings.length > 0">
            <table>
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Receiver</th>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let b of recentBookings">
                  <td>
                    <strong class="font-mono">{{ b.bookingId }}</strong>
                  </td>
                  <td>
                    <div><strong>{{ b.receiverName }}</strong></div>
                    <div style="font-size: 11.5px; color: var(--text-muted);">{{ b.receiverAddress }}</div>
                  </td>
                  <td>{{ b.bookingDate }}</td>
                  <td>{{ b.parcelDeliveryType }}</td>
                  <td><strong style="color: var(--text-primary);">₹{{ b.parcelServiceCost }}</strong></td>
                  <td>
                    <span class="badge" [ngClass]="'badge-' + b.status.toLowerCase().replace(' ', '')">
                      {{ b.status }}
                    </span>
                  </td>
                  <td>
                    <div style="display: flex; gap: 6px;">
                      <a [routerLink]="'/customer/invoice/' + b.bookingId" class="btn btn-secondary btn-sm" title="View Invoice">
                        Invoice
                      </a>
                      <a *ngIf="b.status === 'New'" [routerLink]="'/customer/payment/' + b.bookingId" class="btn btn-primary btn-sm">
                        Pay
                      </a>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .welcome-banner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 32px;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 24px;
      background: linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(17, 26, 46, 1) 100%);
      border: 1px solid var(--border-default);
    }

    .welcome-left {
      max-width: 540px;
    }

    .greeting-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      background: var(--primary-subtle);
      border: 1px solid var(--primary-border);
      border-radius: var(--radius-full);
      font-size: 11px;
      font-weight: 700;
      color: #60a5fa;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 12px;
    }

    .pulse-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #3b82f6;
    }

    .welcome-left h1 {
      font-size: 26px;
      font-weight: 800;
      color: var(--text-primary);
      margin-bottom: 6px;
    }

    .welcome-left p {
      font-size: 13.5px;
      color: var(--text-secondary);
      line-height: 1.5;
    }

    .welcome-stats {
      display: flex;
      gap: 16px;
    }

    .welcome-stat-box {
      padding: 16px 20px;
      background: var(--bg-surface-raised);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-md);
      min-width: 120px;
      text-align: center;
    }

    .stat-num {
      display: block;
      font-family: var(--font-heading);
      font-size: 26px;
      font-weight: 800;
      color: var(--text-primary);
      line-height: 1.1;
    }

    .stat-lbl {
      display: block;
      font-size: 11px;
      color: var(--text-muted);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      margin-top: 4px;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }

    .action-tile {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 20px 18px;
      text-decoration: none;
      transition: all var(--transition-fast);
    }

    .action-tile:hover {
      border-color: var(--border-hover);
      transform: translateY(-2px);
    }

    .tile-icon-box {
      width: 44px;
      height: 44px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .tile-icon-box.primary { background: var(--primary-subtle); border: 1px solid var(--primary-border); color: #60a5fa; }
    .tile-icon-box.info { background: var(--info-bg); border: 1px solid var(--info-border); color: #38bdf8; }
    .tile-icon-box.success { background: var(--success-bg); border: 1px solid var(--success-border); color: #34d399; }
    .tile-icon-box.purple { background: var(--purple-bg); border: 1px solid var(--purple-border); color: #c084fc; }

    .tile-content {
      flex: 1;
      min-width: 0;
    }

    .tile-content h3 {
      font-size: 14.5px;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 3px;
    }

    .tile-content p {
      font-size: 12px;
      color: var(--text-muted);
      line-height: 1.4;
    }

    .tile-arrow {
      color: var(--text-muted);
      font-size: 16px;
      transition: transform var(--transition-fast), color var(--transition-fast);
    }

    .action-tile:hover .tile-arrow {
      color: var(--text-primary);
      transform: translateX(3px);
    }

    .recent-section {
      padding: 24px;
    }

    .section-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .section-card-header h2 {
      font-size: 18px;
      font-weight: 800;
      color: var(--text-primary);
    }

    .section-card-header p {
      font-size: 13px;
      color: var(--text-muted);
      margin-top: 2px;
    }

    .empty-state {
      text-align: center;
      padding: 48px 20px;
    }

    .empty-icon-box {
      width: 54px;
      height: 54px;
      border-radius: 50%;
      background: var(--bg-surface-raised);
      border: 1px solid var(--border-default);
      color: var(--text-muted);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 14px;
    }

    .empty-state h3 {
      font-size: 16px;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 6px;
    }

    .empty-state p {
      font-size: 13.5px;
      color: var(--text-secondary);
      max-width: 400px;
      margin: 0 auto;
    }

    @media (max-width: 1200px) {
      .actions-grid { grid-template-columns: repeat(2, 1fr); }
    }

    @media (max-width: 768px) {
      .actions-grid { grid-template-columns: 1fr; }
      .welcome-stats { width: 100%; justify-content: space-between; }
      .welcome-stat-box { flex: 1; }
    }
  `]
})
export class CustomerHomeComponent implements OnInit {
  recentBookings: Booking[] = [];
  allBookings: Booking[] = [];
  loading = true;

  constructor(public authService: AuthService, private apiService: ApiService) {}

  ngOnInit(): void {
    const custId = this.authService.getCustomerId();
    this.apiService.getCustomerBookings(custId).subscribe({
      next: (bookings) => {
        this.allBookings = bookings;
        this.recentBookings = bookings.slice(0, 6);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  getActiveCount(): number {
    return this.allBookings.filter(b => b.status === 'InTransit' || b.status === 'PickedUp' || b.status === 'Scheduled').length;
  }

  getDeliveredCount(): number {
    return this.allBookings.filter(b => b.status === 'Delivered').length;
  }
}
