import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="bg-effects">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
      </div>
      <div class="auth-container">
        <a routerLink="/" class="back-link">← Back to Home</a>
        <div class="auth-card glass-card">
          <div class="auth-header">
            <span class="auth-icon">📦</span>
            <h1>Create Account</h1>
            <p>Join ParcelSwift to start shipping</p>
          </div>

          <div *ngIf="successMessage" class="alert alert-success">✅ {{ successMessage }}</div>
          <div *ngIf="errorMessage" class="alert alert-error">❌ {{ errorMessage }}</div>

          <!-- Acknowledgment Screen -->
          <div *ngIf="registrationSuccess" class="ack-screen">
            <div class="ack-card">
              <div class="ack-icon">🎉</div>
              <h2>Registration Successful!</h2>
              <div class="ack-details">
                <div class="ack-row"><span>Customer ID</span><strong>{{ ackData.customerId }}</strong></div>
                <div class="ack-row"><span>Name</span><strong>{{ ackData.name }}</strong></div>
                <div class="ack-row"><span>Email</span><strong>{{ ackData.email }}</strong></div>
              </div>
              <a routerLink="/login" class="btn btn-primary btn-block">Proceed to Login →</a>
            </div>
          </div>

          <!-- Registration Form -->
          <form *ngIf="!registrationSuccess" (ngSubmit)="onSubmit()">
            <div class="form-section-title">Personal Information</div>
            <div class="form-group">
              <label>Customer Name *</label>
              <input type="text" class="form-control" [(ngModel)]="user.name" name="name" 
                     placeholder="Enter your full name" maxlength="50" required>
            </div>
            <div class="form-group">
              <label>Email *</label>
              <input type="email" class="form-control" [(ngModel)]="user.email" name="email"
                     placeholder="Enter your email" required>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Country Code *</label>
                <select class="form-control" [(ngModel)]="user.countryCode" name="countryCode">
                  <option value="+91">🇮🇳 +91 India</option>
                  <option value="+1">🇺🇸 +1 USA</option>
                  <option value="+44">🇬🇧 +44 UK</option>
                  <option value="+61">🇦🇺 +61 Australia</option>
                  <option value="+81">🇯🇵 +81 Japan</option>
                  <option value="+49">🇩🇪 +49 Germany</option>
                </select>
              </div>
              <div class="form-group">
                <label>Mobile Number *</label>
                <input type="text" class="form-control" [(ngModel)]="user.mobile" name="mobile"
                       placeholder="10-digit mobile" maxlength="10" required>
              </div>
            </div>
            <div class="form-group">
              <label>Address (with ZIP/Postal Code) *</label>
              <textarea class="form-control" [(ngModel)]="user.address" name="address"
                        placeholder="Enter complete mailing address" required></textarea>
            </div>

            <div class="form-section-title">Password</div>
            <div class="form-row">
              <div class="form-group">
                <label>Password *</label>
                <input type="password" class="form-control" [(ngModel)]="user.password" name="password"
                       placeholder="Create password" maxlength="30" required>
              </div>
              <div class="form-group">
                <label>Confirm Password *</label>
                <input type="password" class="form-control" [(ngModel)]="confirmPassword" name="confirmPassword"
                       placeholder="Re-enter password" maxlength="30" required>
              </div>
            </div>
            <div class="password-hints">
              <span [class.valid]="hasUppercase()">✓ Uppercase</span>
              <span [class.valid]="hasLowercase()">✓ Lowercase</span>
              <span [class.valid]="hasSpecial()">✓ Special char</span>
            </div>

            <div class="form-section-title">Preferences</div>
            <div class="form-group">
              <label>Delivery & Notification Preferences</label>
              <select class="form-control" [(ngModel)]="user.preferences" name="preferences">
                <option value="Email notifications for all updates">Email notifications for all updates</option>
                <option value="SMS notifications only">SMS notifications only</option>
                <option value="Email + SMS for important updates">Email + SMS for important updates</option>
                <option value="No notifications">No notifications</option>
              </select>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-primary btn-block" [disabled]="loading">
                {{ loading ? 'Registering...' : 'Register' }}
              </button>
              <button type="reset" class="btn btn-secondary btn-block" (click)="resetForm()">Reset</button>
            </div>
          </form>

          <div *ngIf="!registrationSuccess" class="auth-footer">
            Already have an account? <a routerLink="/login">Sign In</a>
          </div>
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
      position: relative;
    }
    .bg-effects { position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; }
    .orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.3; }
    .orb-1 { width: 400px; height: 400px; background: #667eea; top: -100px; right: -100px; animation: float 8s ease-in-out infinite; }
    .orb-2 { width: 300px; height: 300px; background: #764ba2; bottom: -50px; left: -50px; animation: float 10s ease-in-out infinite reverse; }
    .auth-container { position: relative; z-index: 10; width: 100%; max-width: 560px; }
    .back-link { display: inline-block; margin-bottom: 16px; color: #a0a3bd; font-size: 14px; }
    .back-link:hover { color: #fff; }
    .auth-card { animation: slideUp 0.5s ease; }
    .auth-header { text-align: center; margin-bottom: 32px; }
    .auth-icon { font-size: 40px; display: block; margin-bottom: 12px; }
    .auth-header h1 { font-size: 28px; margin-bottom: 8px; }
    .auth-header p { color: #a0a3bd; font-size: 14px; }
    .form-section-title {
      font-family: 'Outfit', sans-serif;
      font-size: 14px;
      font-weight: 700;
      color: #667eea;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin: 24px 0 16px;
      padding-bottom: 8px;
      border-bottom: 1px solid rgba(102,126,234,0.2);
    }
    .password-hints {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
      flex-wrap: wrap;
    }
    .password-hints span {
      font-size: 12px;
      color: #6b7280;
      transition: all 0.3s;
    }
    .password-hints span.valid { color: #00d4aa; }
    .form-actions { display: flex; gap: 12px; margin-top: 24px; }
    .auth-footer { text-align: center; margin-top: 20px; color: #a0a3bd; font-size: 14px; }
    .ack-screen { text-align: center; }
    .ack-icon { font-size: 48px; margin-bottom: 16px; }
    .ack-screen h2 { color: #00d4aa; margin-bottom: 24px; }
    .ack-details {
      background: rgba(0,212,170,0.08);
      border: 1px solid rgba(0,212,170,0.2);
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 24px;
    }
    .ack-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    .ack-row:last-child { border-bottom: none; }
    .ack-row span { color: #a0a3bd; font-size: 14px; }
    .ack-row strong { color: #fff; font-size: 14px; }
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

  constructor(private apiService: ApiService, private router: Router) {}

  hasUppercase(): boolean { return /[A-Z]/.test(this.user.password); }
  hasLowercase(): boolean { return /[a-z]/.test(this.user.password); }
  hasSpecial(): boolean { return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(this.user.password); }

  resetForm(): void {
    this.user = { name: '', email: '', countryCode: '+91', mobile: '', address: '', zipCode: '', password: '', preferences: 'Email notifications for all updates' };
    this.confirmPassword = '';
    this.errorMessage = '';
    this.successMessage = '';
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.user.name || !this.user.email || !this.user.mobile || !this.user.address || !this.user.password) {
      this.errorMessage = 'All fields are required';
      return;
    }
    if (this.user.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }
    if (!this.user.mobile.match(/^\d{10}$/)) {
      this.errorMessage = 'Mobile number must be exactly 10 digits';
      return;
    }

    this.loading = true;
    this.apiService.register(this.user).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res.success) {
          this.successMessage = res.message;
          this.registrationSuccess = true;
          this.ackData = { customerId: res.customerId, name: res.name, email: res.email };
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Registration failed. Please try again.';
      }
    });
  }
}
