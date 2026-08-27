import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { Booking } from '../../models/models';

@Component({
  selector: 'app-officer-home',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  template: `
    <div class="page-container">
      <app-navbar></app-navbar>

      <main class="main-content">
        <!-- Officer Terminal Header -->
        <div class="page-header">
          <div>
            <div class="terminal-badge">
              <span class="pulse-dot"></span>
              Officer Terminal & Operations Control
            </div>
            <h1>Logistics Operations Hub</h1>
            <p>System-wide monitoring, carrier status updates, dispatch scheduling, and customer assistance.</p>
          </div>

          <div class="officer-id-tag">
            <span class="tag-label">Active Terminal:</span>
            <strong class="font-mono">{{ authService.getCustomerId() }} ({{ authService.getName() }})</strong>
          </div>
        </div>

        <!-- 4 KPI Metrics Cards -->
        <div class="stats-row">
          <div class="stat-card card">
            <div class="stat-top">
              <span class="stat-title">Total Parcel Volume</span>
              <div class="stat-icon-box primary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="m7.5 4.27 9 5.15"/>
                  <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
                  <path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>
                </svg>
              </div>
            </div>
            <div class="stat-value">{{ totalBookings }}</div>
            <div class="stat-footer">
              <span class="stat-badge info">All-Time Bookings</span>
            </div>
          </div>

          <div class="stat-card card">
            <div class="stat-top">
              <span class="stat-title">Active In Transit</span>
              <div class="stat-icon-box info">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>
                </svg>
              </div>
            </div>
            <div class="stat-value text-info">{{ inTransit }}</div>
            <div class="stat-footer">
              <span class="stat-meta">{{ getPercentage(inTransit) }}% of total network</span>
            </div>
          </div>

          <div class="stat-card card">
            <div class="stat-top">
              <span class="stat-title">Delivered Successfully</span>
              <div class="stat-icon-box success">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
            </div>
            <div class="stat-value text-success">{{ delivered }}</div>
            <div class="stat-footer">
              <span class="stat-meta">{{ getPercentage(delivered) }}% completion rate</span>
            </div>
          </div>

          <div class="stat-card card">
            <div class="stat-top">
              <span class="stat-title">New Intake / Pending</span>
              <div class="stat-icon-box warning">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
            </div>
            <div class="stat-value text-warning">{{ newBookings }}</div>
            <div class="stat-footer">
              <span class="stat-meta">Awaiting dispatch/pickup</span>
            </div>
          </div>
        </div>

        <!-- Operational Action Grid -->
        <div class="section-title-bar">
          <h2>Operational Workflows</h2>
          <p>Execute core logistics and parcel management tasks</p>
        </div>

        <div class="quick-actions-grid">
          <a routerLink="/officer/booking" class="action-card card">
            <div class="action-icon-box primary">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
              </svg>
            </div>
            <div class="action-info">
              <h3>Book for Customer</h3>
              <p>Create parcel booking on customer behalf with admin booking fee</p>
            </div>
            <span class="action-arrow">→</span>
          </a>

          <a routerLink="/officer/tracking" class="action-card card">
            <div class="action-icon-box info">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
              </svg>
            </div>
            <div class="action-info">
              <h3>Global Parcel Tracking</h3>
              <p>Look up any package across all customer accounts by Booking ID</p>
            </div>
            <span class="action-arrow">→</span>
          </a>

          <a routerLink="/officer/delivery-status" class="action-card card">
            <div class="action-icon-box teal">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>
              </svg>
            </div>
            <div class="action-info">
              <h3>Update Delivery Status</h3>
              <p>Transition parcel status: Scheduled, Picked Up, In Transit, or Delivered</p>
            </div>
            <span class="action-arrow">→</span>
          </a>

          <a routerLink="/officer/pickup-schedule" class="action-card card">
            <div class="action-icon-box warning">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <div class="action-info">
              <h3>Pickup & Drop Schedule</h3>
              <p>Modify courier pickup time and estimated recipient delivery window</p>
            </div>
            <span class="action-arrow">→</span>
          </a>

          <a routerLink="/officer/bookings" class="action-card card">
            <div class="action-icon-box purple">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M14 8H8"/><path d="M16 12H8"/><path d="M13 16H8"/>
              </svg>
            </div>
            <div class="action-info">
              <h3>All System Bookings</h3>
              <p>Filter, search, review feedback, and export bookings database</p>
            </div>
            <span class="action-arrow">→</span>
          </a>

          <a routerLink="/officer/feedback" class="action-card card">
            <div class="action-icon-box amber">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </div>
            <div class="action-info">
              <h3>Customer Feedback</h3>
              <p>Analyze delivery satisfaction scores, ratings, and customer reviews</p>
            </div>
            <span class="action-arrow">→</span>
          </a>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .terminal-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      background: rgba(168, 85, 247, 0.12);
      border: 1px solid rgba(168, 85, 247, 0.25);
      border-radius: var(--radius-full);
      font-size: 11px;
      font-weight: 700;
      color: #c084fc;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 8px;
    }

    .pulse-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #c084fc;
    }

    .officer-id-tag {
      padding: 8px 14px;
      background: var(--bg-surface);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-md);
      font-size: 13px;
    }

    .tag-label {
      color: var(--text-muted);
      margin-right: 6px;
    }

    /* Stats Cards */
    .stats-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 32px;
    }

    .stat-card {
      padding: 20px;
    }

    .stat-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .stat-title {
      font-size: 12.5px;
      font-weight: 600;
      color: var(--text-secondary);
    }

    .stat-icon-box {
      width: 36px;
      height: 36px;
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-icon-box.primary { background: var(--primary-subtle); color: #60a5fa; }
    .stat-icon-box.info { background: var(--info-bg); color: #38bdf8; }
    .stat-icon-box.success { background: var(--success-bg); color: #34d399; }
    .stat-icon-box.warning { background: var(--warning-bg); color: #fbbf24; }

    .stat-value {
      font-family: var(--font-heading);
      font-size: 32px;
      font-weight: 800;
      color: var(--text-primary);
      line-height: 1;
      margin-bottom: 12px;
    }

    .text-info { color: #38bdf8; }
    .text-success { color: #34d399; }
    .text-warning { color: #fbbf24; }

    .stat-footer {
      font-size: 12px;
      color: var(--text-muted);
    }

    .stat-badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: var(--radius-sm);
      font-size: 11px;
      font-weight: 600;
    }

    .stat-badge.info {
      background: rgba(255, 255, 255, 0.04);
      color: var(--text-secondary);
    }

    .section-title-bar {
      margin-bottom: 18px;
    }

    .section-title-bar h2 {
      font-size: 18px;
      font-weight: 800;
      color: var(--text-primary);
    }

    .section-title-bar p {
      font-size: 13px;
      color: var(--text-muted);
    }

    /* Actions Grid */
    .quick-actions-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }

    .action-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 22px 20px;
      text-decoration: none;
      transition: all var(--transition-fast);
    }

    .action-card:hover {
      border-color: var(--border-hover);
      transform: translateY(-2px);
    }

    .action-icon-box {
      width: 44px;
      height: 44px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .action-icon-box.primary { background: var(--primary-subtle); color: #60a5fa; border: 1px solid var(--primary-border); }
    .action-icon-box.info { background: var(--info-bg); color: #38bdf8; border: 1px solid var(--info-border); }
    .action-icon-box.teal { background: rgba(13, 148, 136, 0.15); color: #2dd4bf; border: 1px solid rgba(13, 148, 136, 0.3); }
    .action-icon-box.warning { background: var(--warning-bg); color: #fbbf24; border: 1px solid var(--warning-border); }
    .action-icon-box.purple { background: var(--purple-bg); color: #c084fc; border: 1px solid var(--purple-border); }
    .action-icon-box.amber { background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); }

    .action-info {
      flex: 1;
      min-width: 0;
    }

    .action-info h3 {
      font-size: 15px;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 3px;
    }

    .action-info p {
      font-size: 12px;
      color: var(--text-muted);
      line-height: 1.4;
    }

    .action-arrow {
      color: var(--text-muted);
      font-size: 16px;
      transition: transform var(--transition-fast), color var(--transition-fast);
    }

    .action-card:hover .action-arrow {
      color: var(--text-primary);
      transform: translateX(3px);
    }

    @media (max-width: 1200px) {
      .stats-row { grid-template-columns: repeat(2, 1fr); }
      .quick-actions-grid { grid-template-columns: repeat(2, 1fr); }
    }

    @media (max-width: 768px) {
      .stats-row, .quick-actions-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class OfficerHomeComponent implements OnInit {
  totalBookings = 0;
  inTransit = 0;
  delivered = 0;
  newBookings = 0;

  constructor(public authService: AuthService, private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getAllBookings().subscribe({
      next: (bookings) => {
        this.totalBookings = bookings.length;
        this.inTransit = bookings.filter(b => b.status === 'InTransit').length;
        this.delivered = bookings.filter(b => b.status === 'Delivered').length;
        this.newBookings = bookings.filter(b => b.status === 'New').length;
      },
      error: () => {}
    });
  }

  getPercentage(count: number): string {
    if (!this.totalBookings) return '0';
    return Math.round((count / this.totalBookings) * 100).toString();
  }
}
