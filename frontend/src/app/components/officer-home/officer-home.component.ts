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
      <div class="main-content">
        <div class="welcome-section">
          <div class="welcome-text">
            <h1>Welcome, <span class="gradient-text">{{ authService.getName() }}</span> 🛡️</h1>
            <p>Officer Dashboard — Manage all parcel operations.</p>
          </div>
        </div>

        <div class="stats-row">
          <div class="stat-card glass-card">
            <div class="stat-icon">📦</div>
            <div class="stat-value">{{ totalBookings }}</div>
            <div class="stat-label">Total Bookings</div>
          </div>
          <div class="stat-card glass-card">
            <div class="stat-icon">🚚</div>
            <div class="stat-value">{{ inTransit }}</div>
            <div class="stat-label">In Transit</div>
          </div>
          <div class="stat-card glass-card">
            <div class="stat-icon">✅</div>
            <div class="stat-value">{{ delivered }}</div>
            <div class="stat-label">Delivered</div>
          </div>
          <div class="stat-card glass-card">
            <div class="stat-icon">🆕</div>
            <div class="stat-value">{{ newBookings }}</div>
            <div class="stat-label">New</div>
          </div>
        </div>

        <div class="quick-actions">
          <a routerLink="/officer/booking" class="action-card glass-card">
            <div class="action-icon">📋</div>
            <h3>Book for Customer</h3>
            <p>Create booking on behalf</p>
          </a>
          <a routerLink="/officer/tracking" class="action-card glass-card">
            <div class="action-icon">🔍</div>
            <h3>Track Parcel</h3>
            <p>Track any booking by ID</p>
          </a>
          <a routerLink="/officer/delivery-status" class="action-card glass-card">
            <div class="action-icon">🚚</div>
            <h3>Delivery Status</h3>
            <p>Update delivery status</p>
          </a>
          <a routerLink="/officer/pickup-schedule" class="action-card glass-card">
            <div class="action-icon">📅</div>
            <h3>Pickup Schedule</h3>
            <p>Update pickup/dropoff</p>
          </a>
          <a routerLink="/officer/bookings" class="action-card glass-card">
            <div class="action-icon">📁</div>
            <h3>All Bookings</h3>
            <p>View & manage all bookings</p>
          </a>
          <a routerLink="/officer/feedback" class="action-card glass-card">
            <div class="action-icon">⭐</div>
            <h3>View Feedback</h3>
            <p>Read customer feedback</p>
          </a>
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
    .stats-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 32px;
    }
    .stat-card {
      padding: 24px;
      text-align: center;
      animation: slideUp 0.5s ease both;
    }
    .stat-card:nth-child(2) { animation-delay: 0.05s; }
    .stat-card:nth-child(3) { animation-delay: 0.1s; }
    .stat-card:nth-child(4) { animation-delay: 0.15s; }
    .stat-icon { font-size: 28px; margin-bottom: 8px; }
    .stat-value { font-family: 'Outfit', sans-serif; font-size: 32px; font-weight: 800; }
    .stat-label { font-size: 12px; color: #a0a3bd; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px; }
    .quick-actions {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }
    .action-card {
      text-decoration: none;
      color: inherit;
      padding: 24px;
      cursor: pointer;
      animation: slideUp 0.6s ease both;
    }
    .action-card:hover { transform: translateY(-4px); }
    .action-icon { font-size: 32px; margin-bottom: 12px; }
    .action-card h3 { font-size: 16px; margin-bottom: 6px; }
    .action-card p { font-size: 13px; color: #a0a3bd; }
    @media (max-width: 768px) {
      .stats-row, .quick-actions { grid-template-columns: repeat(2, 1fr); }
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
}
