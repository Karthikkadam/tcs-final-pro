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
      <div class="main-content">
        <div class="welcome-section">
          <div class="welcome-text">
            <h1>Welcome back, <span class="gradient-text">{{ authService.getName() }}</span> 👋</h1>
            <p>Manage your parcels, track deliveries, and more.</p>
          </div>
        </div>

        <div class="quick-actions">
          <a routerLink="/customer/booking" class="action-card glass-card">
            <div class="action-icon">📋</div>
            <h3>Book Service</h3>
            <p>Book a new parcel delivery</p>
          </a>
          <a routerLink="/customer/tracking" class="action-card glass-card">
            <div class="action-icon">🔍</div>
            <h3>Track Parcel</h3>
            <p>Track your shipment status</p>
          </a>
          <a routerLink="/customer/bookings" class="action-card glass-card">
            <div class="action-icon">📁</div>
            <h3>Previous Bookings</h3>
            <p>View your booking history</p>
          </a>
          <a routerLink="/customer/support" class="action-card glass-card">
            <div class="action-icon">💬</div>
            <h3>Contact Support</h3>
            <p>Get help and support</p>
          </a>
        </div>

        <div class="recent-section">
          <h2>Recent Bookings</h2>
          <div *ngIf="recentBookings.length === 0" class="empty-state">
            <p>No bookings yet. Start by booking a new parcel!</p>
          </div>
          <div class="table-container" *ngIf="recentBookings.length > 0">
            <table>
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Receiver</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let b of recentBookings">
                  <td><strong>{{ b.bookingId }}</strong></td>
                  <td>{{ b.receiverName }}</td>
                  <td>{{ b.bookingDate }}</td>
                  <td>₹{{ b.parcelServiceCost }}</td>
                  <td><span class="badge" [ngClass]="'badge-' + b.status.toLowerCase().replace(' ','')">{{ b.status }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .welcome-section { margin-bottom: 32px; animation: slideDown 0.5s ease; }
    .welcome-text h1 { font-size: 32px; margin-bottom: 8px; }
    .gradient-text {
      background: linear-gradient(135deg, #667eea, #764ba2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .welcome-text p { color: #a0a3bd; font-size: 15px; }
    .quick-actions {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 40px;
    }
    .action-card {
      text-decoration: none;
      color: inherit;
      padding: 24px;
      cursor: pointer;
      animation: slideUp 0.5s ease both;
    }
    .action-card:nth-child(2) { animation-delay: 0.05s; }
    .action-card:nth-child(3) { animation-delay: 0.1s; }
    .action-card:nth-child(4) { animation-delay: 0.15s; }
    .action-card:hover { transform: translateY(-4px); }
    .action-icon { font-size: 32px; margin-bottom: 12px; }
    .action-card h3 { font-size: 16px; margin-bottom: 6px; }
    .action-card p { font-size: 13px; color: #a0a3bd; }
    .recent-section h2 { font-size: 20px; margin-bottom: 16px; }
    .empty-state {
      text-align: center;
      padding: 40px;
      color: #6b7280;
      background: rgba(255,255,255,0.03);
      border-radius: 12px;
      border: 1px dashed rgba(255,255,255,0.1);
    }
    @media (max-width: 768px) {
      .quick-actions { grid-template-columns: repeat(2, 1fr); }
    }
  `]
})
export class CustomerHomeComponent implements OnInit {
  recentBookings: Booking[] = [];

  constructor(public authService: AuthService, private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getCustomerBookings(this.authService.getCustomerId()).subscribe({
      next: (bookings) => { this.recentBookings = bookings.slice(0, 5); },
      error: () => {}
    });
  }
}
