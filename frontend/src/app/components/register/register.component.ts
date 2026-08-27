import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-register',
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
          <!-- Acknowledgment Screen if registration was successful -->
          <div *ngIf="registrationSuccess" class="ack-screen">
            <div class="ack-icon-badge">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h2>Account Created Successfully</h2>
            <p class="ack-desc">Your customer profile is active and ready for parcel booking & tracking.</p>

            <div class="ack-details-card">
              <div class="ack-row">
                <span>Customer ID</span>
                <div class="id-copy-wrap">
                  <strong class="font-mono">{{ ackData.customerId }}</strong>
                  <button type="button" class="btn-copy" (click)="copyId()" title="Copy ID">
                    {{ copied ? 'Copied!' : 'Copy' }}
                  </button>
                </div>
              </div>
              <div class="ack-row">
                <span>Account Holder</span>
                <strong>{{ ackData.name }}</strong>
              </div>
              <div class="ack-row">
                <span>Email Address</span>
                <strong>{{ ackData.email }}</strong>
              </div>
            </div>

            <p class="id-save-note">
              Please save your <strong>Customer ID</strong>. You will need it to sign in to your dashboard.
            </p>

            <a routerLink="/login" class="btn btn-primary btn-block btn-lg">
              Proceed to Sign In →
            </a>
          </div>

          <!-- Registration Form -->
          <div *ngIf="!registrationSuccess">
            <div class="auth-card-header">
              <h1>Create Customer Account</h1>
              <p>Register to book shipments, schedule pickups, and track packages</p>
            </div>

            <div *ngIf="errorMessage" class="alert alert-error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              <span>{{ errorMessage }}</span>
            </div>

            <form (ngSubmit)="onSubmit()" class="auth-form">
              <!-- Section: Identity -->
              <div class="section-title">
                <span>01</span> Personal Details
              </div>

              <div class="form-group">
                <label>Full Name *</label>
                <input 
                  type="text" 
                  class="form-control" 
                  [(ngModel)]="user.name" 
                  name="name" 
                  placeholder="e.g. Rahul Sharma" 
                  maxlength="50" 
                  required
                />
              </div>

              <div class="form-group">
                <label>Email Address *</label>
                <input 
                  type="email" 
                  class="form-control" 
                  [(ngModel)]="user.email" 
                  name="email"
                  placeholder="e.g. rahul.sharma@example.com" 
                  required
                />
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Country Code *</label>
                  <select class="form-control" [(ngModel)]="user.countryCode" name="countryCode">
                    <option value="+91">+91 (India)</option>
                    <option value="+1">+1 (USA / Canada)</option>
                    <option value="+44">+44 (UK)</option>
                    <option value="+61">+61 (Australia)</option>
                    <option value="+81">+81 (Japan)</option>
                    <option value="+49">+49 (Germany)</option>
                    <option value="+971">+971 (UAE)</option>
                    <option value="+65">+65 (Singapore)</option>
                  </select>
                </div>

                <div class="form-group">
                  <label>Mobile Number *</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    [(ngModel)]="user.mobile" 
                    name="mobile"
                    placeholder="10-digit number" 
                    maxlength="10" 
                    required
                  />
                </div>
              </div>

              <div class="form-group">
                <label>Address (with Postal / PIN Code) *</label>
                <textarea 
                  class="form-control" 
                  [(ngModel)]="user.address" 
                  name="address"
                  placeholder="Building, street, area, city, PIN code" 
                  rows="3"
                  required
                ></textarea>
              </div>

              <!-- Section: Security -->
              <div class="section-title" style="margin-top: 24px;">
                <span>02</span> Account Security
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Password *</label>
                  <input 
                    type="password" 
                    class="form-control" 
                    [(ngModel)]="user.password" 
                    name="password"
                    placeholder="Create strong password" 
                    maxlength="30" 
                    required
                  />
                </div>

                <div class="form-group">
                  <label>Confirm Password *</label>
                  <input 
                    type="password" 
                    class="form-control" 
                    [(ngModel)]="confirmPassword" 
                    name="confirmPassword"
                    placeholder="Re-enter password" 
                    maxlength="30" 
                    required
                  />
                </div>
              </div>

              <!-- Password Criteria Pills -->
              <div class="criteria-bar">
                <span class="criteria-chip" [class.valid]="hasMinLength()">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  8+ Chars
                </span>
                <span class="criteria-chip" [class.valid]="hasUppercase()">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Uppercase
                </span>
                <span class="criteria-chip" [class.valid]="hasLowercase()">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Lowercase
                </span>
                <span class="criteria-chip" [class.valid]="hasSpecial()">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Special Char
                </span>
              </div>

              <!-- Section: Preferences -->
              <div class="section-title" style="margin-top: 24px;">
                <span>03</span> Notification Preferences
              </div>

              <div class="form-group">
                <label>Dispatch & Tracking Notifications</label>
                <select class="form-control" [(ngModel)]="user.preferences" name="preferences">
                  <option value="Email notifications for all updates">Email notifications for all milestone updates</option>
                  <option value="SMS notifications only">SMS text alerts only</option>
                  <option value="Email + SMS for important updates">Email + SMS for critical delivery events</option>
                  <option value="No notifications">No automated notifications</option>
                </select>
              </div>

              <div class="form-actions-row">
                <button type="submit" class="btn btn-primary btn-lg btn-block" [disabled]="loading">
                  <span *ngIf="loading" class="spinner-sm"></span>
                  <span>{{ loading ? 'Creating Account...' : 'Complete Registration' }}</span>
                </button>
              </div>
            </form>

            <div class="auth-card-footer">
              <span>Already registered with ParcelSwift?</span>
              <a routerLink="/login">Sign In Here</a>
            </div>
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
      background: radial-gradient(circle at 50% 15%, rgba(37, 99, 235, 0.08) 0%, transparent 60%);
    }

    .auth-container {
      width: 100%;
      max-width: 580px;
    }

    .auth-brand-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
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
      padding: 36px;
    }

    .auth-card-header {
      text-align: center;
      margin-bottom: 28px;
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

    .section-title {
      font-size: 12px;
      font-weight: 700;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-bottom: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
      border-bottom: 1px solid var(--border-subtle);
      padding-bottom: 8px;
    }

    .section-title span {
      font-family: var(--font-mono);
      color: var(--primary);
    }

    .criteria-bar {
      display: flex;
      gap: 8px;
      margin-top: -8px;
      margin-bottom: 18px;
      flex-wrap: wrap;
    }

    .criteria-chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 3px 8px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sm);
      font-size: 11px;
      color: var(--text-muted);
      transition: all var(--transition-fast);
    }

    .criteria-chip svg {
      opacity: 0.4;
    }

    .criteria-chip.valid {
      background: var(--success-bg);
      border-color: var(--success-border);
      color: #34d399;
    }

    .criteria-chip.valid svg {
      opacity: 1;
    }

    .form-actions-row {
      margin-top: 24px;
    }

    .auth-card-footer {
      text-align: center;
      margin-top: 24px;
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

    /* Acknowledgment Screen */
    .ack-screen {
      text-align: center;
      padding: 10px 0;
    }

    .ack-icon-badge {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: var(--success-bg);
      border: 1px solid var(--success-border);
      color: #34d399;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
    }

    .ack-screen h2 {
      font-size: 22px;
      font-weight: 800;
      color: var(--text-primary);
      margin-bottom: 8px;
    }

    .ack-desc {
      font-size: 14px;
      color: var(--text-secondary);
      margin-bottom: 24px;
    }

    .ack-details-card {
      background: var(--bg-input);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-md);
      padding: 16px 20px;
      margin-bottom: 20px;
      text-align: left;
    }

    .ack-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 9px 0;
      border-bottom: 1px solid var(--border-subtle);
      font-size: 13.5px;
    }

    .ack-row:last-child {
      border-bottom: none;
    }

    .ack-row span {
      color: var(--text-secondary);
    }

    .ack-row strong {
      color: var(--text-primary);
    }

    .id-copy-wrap {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .btn-copy {
      padding: 2px 8px;
      background: var(--primary-subtle);
      border: 1px solid var(--primary-border);
      border-radius: var(--radius-sm);
      color: #60a5fa;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
    }

    .id-save-note {
      font-size: 12.5px;
      color: #fbbf24;
      background: var(--warning-bg);
      border: 1px solid var(--warning-border);
      border-radius: var(--radius-sm);
      padding: 10px 14px;
      margin-bottom: 24px;
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
export class RegisterComponent {
  user = {
    name: '', email: '', countryCode: '+91', mobile: '', address: '', zipCode: '',
    password: '', preferences: 'Email notifications for all updates'
  };
  confirmPassword = '';
  loading = false;
  successMessage = '';
  errorMessage = '';
  registrationSuccess = false;
  ackData: any = {};
  copied = false;

  constructor(
    private apiService: ApiService,
    private router: Router,
    public themeService: ThemeService
  ) {}

  hasMinLength(): boolean { return (this.user.password || '').length >= 8; }
  hasUppercase(): boolean { return /[A-Z]/.test(this.user.password); }
  hasLowercase(): boolean { return /[a-z]/.test(this.user.password); }
  hasSpecial(): boolean { return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(this.user.password); }

  copyId(): void {
    if (this.ackData.customerId) {
      navigator.clipboard.writeText(this.ackData.customerId);
      this.copied = true;
      setTimeout(() => { this.copied = false; }, 2000);
    }
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.user.name.trim() || !this.user.email.trim() || !this.user.mobile.trim() || !this.user.address.trim() || !this.user.password) {
      this.errorMessage = 'Please complete all required fields';
      return;
    }
    if (this.user.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }
    if (!this.user.mobile.match(/^\d{10}$/)) {
      this.errorMessage = 'Mobile number must contain exactly 10 digits';
      return;
    }

    this.loading = true;
    this.apiService.register(this.user).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res.success) {
          this.registrationSuccess = true;
          this.ackData = { customerId: res.customerId, name: res.name, email: res.email };
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Registration failed. Please try again with valid information.';
      }
    });
  }
}
