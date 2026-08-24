import { Component, Input } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="sidebar">
      <div class="sidebar-header">
        <div class="logo">
          <span class="logo-icon">📦</span>
          <span class="logo-text">ParcelSwift</span>
        </div>
        <div class="user-info">
          <div class="user-avatar">{{ getUserInitial() }}</div>
          <div class="user-details">
            <span class="user-name">{{ authService.getName() }}</span>
            <span class="user-role">{{ authService.getRole() }}</span>
          </div>
        </div>
      </div>

      <div class="sidebar-menu">
        <div class="menu-label">NAVIGATION</div>

        <!-- Customer Menu -->
        <ng-container *ngIf="authService.getRole() === 'CUSTOMER'">
          <a routerLink="/customer/home" routerLinkActive="active" class="menu-item">
            <span class="icon">🏠</span> Home
          </a>
          <a routerLink="/customer/booking" routerLinkActive="active" class="menu-item">
            <span class="icon">📋</span> Book Service
          </a>
          <a routerLink="/customer/tracking" routerLinkActive="active" class="menu-item">
            <span class="icon">🔍</span> Track Parcel
          </a>
          <a routerLink="/customer/bookings" routerLinkActive="active" class="menu-item">
            <span class="icon">📁</span> Previous Bookings
          </a>
          <a routerLink="/customer/support" routerLinkActive="active" class="menu-item">
            <span class="icon">💬</span> Contact Support
          </a>
        </ng-container>

        <!-- Officer Menu -->
        <ng-container *ngIf="authService.getRole() === 'OFFICER'">
          <a routerLink="/officer/home" routerLinkActive="active" class="menu-item">
            <span class="icon">🏠</span> Home
          </a>
          <a routerLink="/officer/tracking" routerLinkActive="active" class="menu-item">
            <span class="icon">🔍</span> Tracking
          </a>
          <a routerLink="/officer/delivery-status" routerLinkActive="active" class="menu-item">
            <span class="icon">🚚</span> Delivery Status
          </a>
          <a routerLink="/officer/pickup-schedule" routerLinkActive="active" class="menu-item">
            <span class="icon">📅</span> Pickup Schedule
          </a>
          <a routerLink="/officer/bookings" routerLinkActive="active" class="menu-item">
            <span class="icon">📁</span> All Bookings
          </a>
          <a routerLink="/officer/feedback" routerLinkActive="active" class="menu-item">
            <span class="icon">⭐</span> Feedback
          </a>
        </ng-container>
      </div>

      <div class="sidebar-footer">
        <button class="menu-item logout-btn" (click)="logout()">
          <span class="icon">🚪</span> Logout
        </button>
      </div>
    </nav>
  `,
  styles: [`
    .sidebar {
      position: fixed;
      top: 0;
      left: 0;
      width: 260px;
      height: 100vh;
      background: rgba(17, 22, 56, 0.95);
      backdrop-filter: blur(20px);
      border-right: 1px solid rgba(255,255,255,0.08);
      display: flex;
      flex-direction: column;
      z-index: 100;
      overflow-y: auto;
    }
    .sidebar-header {
      padding: 24px 20px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    .logo {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 20px;
    }
    .logo-icon { font-size: 28px; }
    .logo-text {
      font-family: 'Outfit', sans-serif;
      font-size: 22px;
      font-weight: 800;
      background: linear-gradient(135deg, #667eea, #764ba2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: rgba(255,255,255,0.04);
      border-radius: 12px;
    }
    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 16px;
    }
    .user-details {
      display: flex;
      flex-direction: column;
    }
    .user-name {
      font-size: 14px;
      font-weight: 600;
      color: #fff;
    }
    .user-role {
      font-size: 11px;
      color: #a0a3bd;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .sidebar-menu {
      flex: 1;
      padding: 16px 12px;
    }
    .menu-label {
      font-size: 10px;
      font-weight: 700;
      color: #6b7280;
      letter-spacing: 1px;
      padding: 8px 12px;
      margin-bottom: 4px;
    }
    .menu-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      border-radius: 10px;
      color: #a0a3bd;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s ease;
      cursor: pointer;
      border: none;
      background: none;
      width: 100%;
      text-align: left;
      text-decoration: none;
      margin-bottom: 2px;
    }
    .menu-item:hover {
      background: rgba(102, 126, 234, 0.1);
      color: #fff;
    }
    .menu-item.active {
      background: linear-gradient(135deg, rgba(102,126,234,0.2), rgba(118,75,162,0.2));
      color: #fff;
      border: 1px solid rgba(102,126,234,0.3);
    }
    .icon { font-size: 18px; width: 24px; text-align: center; }
    .sidebar-footer {
      padding: 12px;
      border-top: 1px solid rgba(255,255,255,0.06);
    }
    .logout-btn:hover {
      background: rgba(255, 107, 107, 0.15) !important;
      color: #ff6b6b !important;
    }
  `]
})
export class NavbarComponent {
  constructor(public authService: AuthService, private router: Router) {}

  getUserInitial(): string {
    const name = this.authService.getName();
    return name ? name.charAt(0).toUpperCase() : 'U';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
