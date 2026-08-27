import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <!-- Mobile Top Header Bar -->
    <header class="mobile-topbar">
      <div class="brand">
        <div class="brand-badge">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m7.5 4.27 9 5.15"/>
            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
            <path d="m3.3 7 8.7 5 8.7-5"/>
            <path d="M12 22V12"/>
          </svg>
        </div>
        <span class="brand-title">ParcelSwift</span>
      </div>

      <div class="mobile-actions-wrap">
        <button class="theme-toggle-btn theme-icon-btn" (click)="themeService.toggleTheme()" [title]="themeService.isDark() ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
          <svg *ngIf="themeService.isDark()" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
          <svg *ngIf="!themeService.isDark()" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </button>

        <button class="mobile-menu-btn" (click)="toggleMobileMenu()" aria-label="Toggle navigation menu">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>
    </header>

    <!-- Backdrop for mobile drawer -->
    <div class="sidebar-backdrop" *ngIf="mobileMenuOpen" (click)="closeMobileMenu()"></div>

    <!-- Desktop & Mobile Sidebar Drawer -->
    <nav class="sidebar" [class.open]="mobileMenuOpen">
      <!-- Sidebar Header & Logo -->
      <div class="sidebar-header">
        <a routerLink="/" class="brand" (click)="closeMobileMenu()">
          <div class="brand-badge">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m7.5 4.27 9 5.15"/>
              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
              <path d="m3.3 7 8.7 5 8.7-5"/>
              <path d="M12 22V12"/>
            </svg>
          </div>
          <div class="brand-info">
            <span class="brand-title">ParcelSwift</span>
            <span class="brand-tag">Enterprise Logistics</span>
          </div>
        </a>
      </div>

      <!-- User Profile Card -->
      <div class="user-profile-card">
        <div class="user-avatar-wrap">
          <div class="user-avatar">{{ getUserInitial() }}</div>
          <span class="status-indicator"></span>
        </div>
        <div class="user-details">
          <span class="user-name" [title]="authService.getName()">{{ authService.getName() || 'User' }}</span>
          <div class="user-meta">
            <span class="role-badge" [ngClass]="authService.getRole() === 'OFFICER' ? 'role-officer' : 'role-customer'">
              <svg *ngIf="authService.getRole() === 'OFFICER'" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <svg *ngIf="authService.getRole() !== 'OFFICER'" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 1 0-16 0"/>
              </svg>
              {{ authService.getRole() }}
            </span>
            <span class="user-id">{{ authService.getCustomerId() }}</span>
          </div>
        </div>
      </div>

      <!-- Navigation Menu Links -->
      <div class="sidebar-menu">
        <div class="menu-label">Main Navigation</div>

        <!-- Customer Links -->
        <ng-container *ngIf="authService.getRole() === 'CUSTOMER'">
          <a routerLink="/customer/home" routerLinkActive="active" class="menu-item" (click)="closeMobileMenu()">
            <svg class="menu-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>
            </svg>
            <span>Dashboard</span>
          </a>

          <a routerLink="/customer/booking" routerLinkActive="active" class="menu-item" (click)="closeMobileMenu()">
            <svg class="menu-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 16h6"/><path d="M19 13v6"/><path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>
            </svg>
            <span>Book Parcel</span>
          </a>

          <a routerLink="/customer/tracking" routerLinkActive="active" class="menu-item" (click)="closeMobileMenu()">
            <svg class="menu-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
            <span>Live Tracking</span>
          </a>

          <a routerLink="/customer/bookings" routerLinkActive="active" class="menu-item" (click)="closeMobileMenu()">
            <svg class="menu-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M14 8H8"/><path d="M16 12H8"/><path d="M13 16H8"/>
            </svg>
            <span>My Shipments</span>
          </a>

          <a routerLink="/customer/cancel" routerLinkActive="active" class="menu-item" (click)="closeMobileMenu()">
            <svg class="menu-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>
            </svg>
            <span>Cancel Booking</span>
          </a>

          <div class="menu-label" style="margin-top: 18px;">Support</div>

          <a routerLink="/customer/feedback" routerLinkActive="active" class="menu-item" (click)="closeMobileMenu()">
            <svg class="menu-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            <span>Rate & Feedback</span>
          </a>

          <a routerLink="/customer/support" routerLinkActive="active" class="menu-item" (click)="closeMobileMenu()">
            <svg class="menu-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
            </svg>
            <span>Help Center</span>
          </a>
        </ng-container>

        <!-- Officer Links -->
        <ng-container *ngIf="authService.getRole() === 'OFFICER'">
          <a routerLink="/officer/home" routerLinkActive="active" class="menu-item" (click)="closeMobileMenu()">
            <svg class="menu-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>
            </svg>
            <span>Operations Hub</span>
          </a>

          <a routerLink="/officer/booking" routerLinkActive="active" class="menu-item" (click)="closeMobileMenu()">
            <svg class="menu-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
            </svg>
            <span>Book for Customer</span>
          </a>

          <a routerLink="/officer/tracking" routerLinkActive="active" class="menu-item" (click)="closeMobileMenu()">
            <svg class="menu-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
            <span>Global Tracking</span>
          </a>

          <a routerLink="/officer/delivery-status" routerLinkActive="active" class="menu-item" (click)="closeMobileMenu()">
            <svg class="menu-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>
            </svg>
            <span>Update Delivery Status</span>
          </a>

          <a routerLink="/officer/pickup-schedule" routerLinkActive="active" class="menu-item" (click)="closeMobileMenu()">
            <svg class="menu-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span>Pickup & Drop Schedule</span>
          </a>

          <a routerLink="/officer/bookings" routerLinkActive="active" class="menu-item" (click)="closeMobileMenu()">
            <svg class="menu-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M14 8H8"/><path d="M16 12H8"/><path d="M13 16H8"/>
            </svg>
            <span>All System Bookings</span>
          </a>

          <a routerLink="/officer/cancel" routerLinkActive="active" class="menu-item" (click)="closeMobileMenu()">
            <svg class="menu-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>
            </svg>
            <span>Cancel / Refunds</span>
          </a>

          <div class="menu-label" style="margin-top: 18px;">Analytics</div>

          <a routerLink="/officer/feedback" routerLinkActive="active" class="menu-item" (click)="closeMobileMenu()">
            <svg class="menu-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            <span>Feedback Analysis</span>
          </a>
        </ng-container>
      </div>

      <!-- Sidebar Footer / Theme Toggle & Logout -->
      <div class="sidebar-footer">
        <button class="theme-toggle-btn theme-footer-btn" (click)="themeService.toggleTheme()">
          <svg *ngIf="themeService.isDark()" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
          <svg *ngIf="!themeService.isDark()" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
          <span>{{ themeService.isDark() ? 'Light Mode' : 'Dark Mode' }}</span>
        </button>

        <button class="logout-btn" (click)="logout()" title="Sign out of your session">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          <span>Sign Out</span>
        </button>
      </div>
    </nav>
  `,
  styles: [`
    /* Mobile Topbar */
    .mobile-topbar {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 60px;
      background: var(--bg-sidebar);
      border-bottom: 1px solid var(--border-default);
      padding: 0 18px;
      align-items: center;
      justify-content: space-between;
      z-index: 99;
    }

    .mobile-actions-wrap {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .mobile-menu-btn {
      background: transparent;
      border: none;
      color: var(--text-primary);
      cursor: pointer;
      padding: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .sidebar-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.7);
      z-index: 100;
      animation: fadeIn 0.2s ease;
    }

    /* Main Desktop Sidebar */
    .sidebar {
      position: fixed;
      top: 0;
      left: 0;
      width: 270px;
      height: 100vh;
      background: var(--bg-sidebar);
      border-right: 1px solid var(--border-default);
      display: flex;
      flex-direction: column;
      z-index: 101;
      overflow-y: auto;
      transition: transform var(--transition-normal), background-color var(--transition-normal);
    }

    .sidebar-header {
      padding: 24px 20px 20px;
      border-bottom: 1px solid var(--border-subtle);
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
    }

    .brand-badge {
      width: 38px;
      height: 38px;
      border-radius: var(--radius-md);
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.2);
    }

    .brand-info {
      display: flex;
      flex-direction: column;
    }

    .brand-title {
      font-family: var(--font-heading);
      font-size: 19px;
      font-weight: 800;
      color: var(--text-primary);
      letter-spacing: -0.02em;
      line-height: 1.1;
    }

    .brand-tag {
      font-size: 11px;
      color: var(--text-muted);
      font-weight: 600;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      margin-top: 2px;
    }

    /* User Profile Card */
    .user-profile-card {
      margin: 16px 16px 8px;
      padding: 12px;
      background: var(--bg-surface-raised);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .user-avatar-wrap {
      position: relative;
    }

    .user-avatar {
      width: 36px;
      height: 36px;
      border-radius: var(--radius-sm);
      background: var(--bg-surface);
      border: 1px solid var(--border-default);
      color: var(--primary);
      font-weight: 700;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .status-indicator {
      position: absolute;
      bottom: -2px;
      right: -2px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--success);
      border: 2px solid var(--bg-sidebar);
    }

    .user-details {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-size: 13.5px;
      font-weight: 600;
      color: var(--text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .user-meta {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 3px;
    }

    .user-id {
      font-size: 11px;
      color: var(--text-muted);
      font-family: var(--font-mono);
    }

    /* Sidebar Navigation Menu */
    .sidebar-menu {
      flex: 1;
      padding: 12px 14px;
      overflow-y: auto;
    }

    .menu-label {
      font-size: 11px;
      font-weight: 700;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      padding: 8px 12px 6px;
    }

    .menu-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 9.5px 12px;
      border-radius: var(--radius-md);
      color: var(--text-secondary);
      font-size: 13.5px;
      font-weight: 500;
      text-decoration: none;
      transition: all var(--transition-fast);
      margin-bottom: 2px;
      border: 1px solid transparent;
    }

    .menu-icon {
      color: var(--text-muted);
      transition: color var(--transition-fast);
      flex-shrink: 0;
    }

    .menu-item:hover {
      background: var(--bg-surface);
      color: var(--text-primary);
      border-color: var(--border-subtle);
    }

    .menu-item:hover .menu-icon {
      color: var(--primary);
    }

    .menu-item.active {
      background: var(--primary-subtle);
      color: var(--primary);
      font-weight: 600;
      border-color: var(--primary-border);
    }

    .menu-item.active .menu-icon {
      color: var(--primary);
    }

    /* Sidebar Footer */
    .sidebar-footer {
      padding: 14px 16px;
      border-top: 1px solid var(--border-subtle);
      background: var(--bg-surface-raised);
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .theme-footer-btn {
      width: 100%;
      justify-content: flex-start;
      padding: 9px 12px;
    }

    .logout-btn {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 9px 12px;
      background: transparent;
      border: 1px solid transparent;
      border-radius: var(--radius-md);
      color: var(--text-secondary);
      font-family: var(--font-sans);
      font-size: 13.5px;
      font-weight: 500;
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .logout-btn:hover {
      background: var(--danger-bg);
      border-color: var(--danger-border);
      color: var(--danger);
    }

    /* Responsive Drawer Styles */
    @media (max-width: 992px) {
      .mobile-topbar {
        display: flex;
      }

      .sidebar {
        transform: translateX(-100%);
      }

      .sidebar.open {
        transform: translateX(0);
        box-shadow: var(--shadow-lg);
      }
    }
  `]
})
export class NavbarComponent {
  mobileMenuOpen = false;

  constructor(
    public authService: AuthService,
    public themeService: ThemeService,
    private router: Router
  ) {}

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  getUserInitial(): string {
    const name = this.authService.getName();
    return name ? name.charAt(0).toUpperCase() : 'U';
  }

  logout(): void {
    this.closeMobileMenu();
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
