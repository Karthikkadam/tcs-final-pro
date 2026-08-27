import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-container">
        <!-- Brand Header -->
        <div class="auth-brand-header">
          <a routerLink="/" class="brand-link">
            <div class="brand-badge">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m7.5 4.27 9 5.15"/>
                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
                <path d="m3.3 7 8.7 5 8.7-5"/>
                <path d="M12 22V12"/>
              </svg>
            </div>
            <span class="brand-name">ParcelSwift</span>
          </a>

          <button class="theme-toggle-btn theme-icon-btn" (click)="themeService.toggleTheme()" [title]="themeService.isDark() ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
            <svg *ngIf="themeService.isDark()" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
            <svg *ngIf="!themeService.isDark()" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          </button>
        </div>

        <div class="auth-card card">
          <div class="auth-card-header">
            <h1>Account Login</h1>
            <p>Access your customer dashboard or officer terminal</p>
          </div>

          <div *ngIf="errorMessage" class="alert alert-error">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            <span>{{ errorMessage }}</span>
          </div>

          <form (ngSubmit)="onSubmit()" class="auth-form">
            <div class="form-group">
              <label for="customerId">User ID / Customer ID *</label>
              <div class="input-with-icon">
                <svg class="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                <input 
                  id="customerId"
                  type="text" 
                  class="form-control with-icon" 
                  [(ngModel)]="customerId" 
                  name="customerId"
                  placeholder="e.g. CUS00001 or OFC00001" 
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <div class="label-row">
                <label for="password">Password *</label>
              </div>
              <div class="input-with-icon">
                <svg class="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input 
                  id="password"
                  [type]="showPassword ? 'text' : 'password'" 
                  class="form-control with-icon with-action" 
                  [(ngModel)]="password" 
                  name="password"
                  placeholder="Enter your account password" 
                  maxlength="30" 
                  required
                />
                <button type="button" class="input-action-btn" (click)="showPassword = !showPassword" aria-label="Toggle password visibility">
                  <svg *ngIf="!showPassword" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>
                  </svg>
                  <svg *ngIf="showPassword" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/>
                  </svg>
                </button>
              </div>
            </div>

            <button type="submit" class="btn btn-primary btn-block btn-lg" [disabled]="loading">
              <span *ngIf="loading" class="spinner-sm"></span>
              <span>{{ loading ? 'Authenticating...' : 'Sign In to Account' }}</span>
            </button>
          </form>

          <!-- Quick Test Credentials / Helper Box -->
          <div class="demo-box">
            <div class="demo-header">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
              <span>Instant Test Credentials (Click to Autofill):</span>
            </div>
            <div class="demo-buttons">
              <button type="button" class="demo-chip" (click)="fillDemo('OFC00001', 'Admin@123')">
                <span class="role-badge role-officer">Officer</span>
                <code>OFC00001</code>
              </button>
              <button type="button" class="demo-chip" (click)="fillDemo('CUS00001', 'Pass@123')">
                <span class="role-badge role-customer">Customer</span>
                <code>CUS00001</code>
              </button>
            </div>
          </div>

          <div class="auth-card-footer">
            <span>Don't have an account yet?</span>
            <a routerLink="/register">Register New Account</a>
          </div>
        </div>

        <div class="auth-subfooter">
          <a routerLink="/" class="back-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            Return to Homepage
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
      background: radial-gradient(circle at 50% 20%, rgba(37, 99, 235, 0.08) 0%, transparent 60%);
    }

    .auth-container {
      width: 100%;
      max-width: 440px;
    }

    .auth-brand-header {
      display: flex;
      justify-content: center;
      margin-bottom: 24px;
    }

    .brand-link {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
    }

    .brand-badge {
      width: 36px;
      height: 36px;
      border-radius: var(--radius-md);
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35);
    }

    .brand-name {
      font-family: var(--font-heading);
      font-size: 20px;
      font-weight: 800;
      color: var(--text-primary);
    }

    .auth-card {
      padding: 32px;
    }

    .auth-card-header {
      text-align: center;
      margin-bottom: 24px;
    }

    .auth-card-header h1 {
      font-size: 22px;
      font-weight: 800;
      color: var(--text-primary);
      margin-bottom: 6px;
    }

    .auth-card-header p {
      font-size: 13.5px;
      color: var(--text-secondary);
    }

    .input-with-icon {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-icon {
      position: absolute;
      left: 13px;
      color: var(--text-muted);
      pointer-events: none;
    }

    .form-control.with-icon {
      padding-left: 38px;
    }

    .form-control.with-action {
      padding-right: 40px;
    }

    .input-action-btn {
      position: absolute;
      right: 10px;
      background: transparent;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      padding: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .input-action-btn:hover {
      color: var(--text-secondary);
    }

    .label-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .demo-box {
      margin-top: 22px;
      padding: 14px;
      background: var(--bg-input);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-md);
    }

    .demo-header {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11.5px;
      font-weight: 600;
      color: var(--text-secondary);
      margin-bottom: 10px;
    }

    .demo-buttons {
      display: flex;
      gap: 8px;
    }

    .demo-chip {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 6px 10px;
      background: var(--bg-surface-raised);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .demo-chip:hover {
      background: var(--bg-surface-hover);
      border-color: var(--primary-border);
    }

    .demo-chip code {
      font-family: var(--font-mono);
      font-size: 11px;
      color: var(--text-primary);
    }

    .auth-card-footer {
      text-align: center;
      margin-top: 20px;
      padding-top: 18px;
      border-top: 1px solid var(--border-subtle);
      font-size: 13px;
      color: var(--text-secondary);
    }

    .auth-card-footer a {
      font-weight: 600;
      margin-left: 6px;
    }

    .auth-subfooter {
      text-align: center;
      margin-top: 20px;
    }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      color: var(--text-muted);
    }

    .back-link:hover {
      color: var(--text-primary);
    }

    .spinner-sm {
      display: inline-block;
      width: 14px;
      height: 14px;
      border: 2px solid rgba(255, 255, 255, 0.2);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.75s linear infinite;
    }
  `]
})
export class LoginComponent {
  customerId = '';
  password = '';
  loading = false;
  errorMessage = '';
  showPassword = false;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
    public themeService: ThemeService
  ) {}

  fillDemo(id: string, pass: string): void {
    this.customerId = id;
    this.password = pass;
    this.errorMessage = '';
  }

  onSubmit(): void {
    this.errorMessage = '';
    if (!this.customerId.trim()) {
      this.errorMessage = 'Please enter your User ID or Customer ID';
      return;
    }
    if (!this.password.trim()) {
      this.errorMessage = 'Please enter your account password';
      return;
    }

    this.loading = true;
    this.apiService.login(this.customerId.trim(), this.password).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res.success) {
          this.authService.login(res);
          if (res.role === 'OFFICER') {
            this.router.navigate(['/officer/home']);
          } else {
            this.router.navigate(['/customer/home']);
          }
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Authentication failed. Please verify your credentials.';
      }
    });
  }
}
