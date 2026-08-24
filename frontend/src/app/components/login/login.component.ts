import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
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
            <span class="auth-icon">🔐</span>
            <h1>Welcome Back</h1>
            <p>Sign in to your account</p>
          </div>

          <div *ngIf="errorMessage" class="alert alert-error">❌ {{ errorMessage }}</div>

          <form (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label>Customer ID *</label>
              <input type="text" class="form-control" [(ngModel)]="customerId" name="customerId"
                     placeholder="Enter your Customer ID (e.g. CUS00001)" required>
            </div>
            <div class="form-group">
              <label>Password *</label>
              <input type="password" class="form-control" [(ngModel)]="password" name="password"
                     placeholder="Enter your password" maxlength="30" required>
            </div>
            <button type="submit" class="btn btn-primary btn-block btn-lg" [disabled]="loading">
              {{ loading ? 'Signing in...' : 'Sign In' }}
            </button>
          </form>

          <div class="auth-footer">
            Don't have an account? <a routerLink="/register">Create Account</a>
          </div>

          <div class="demo-credentials">
            <div class="demo-title">Demo Credentials</div>
            <div class="demo-row">
              <span>Officer:</span>
              <code>OFC00001 / Admin&#64;123</code>
            </div>
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
    .auth-container { position: relative; z-index: 10; width: 100%; max-width: 440px; }
    .back-link { display: inline-block; margin-bottom: 16px; color: #a0a3bd; font-size: 14px; }
    .back-link:hover { color: #fff; }
    .auth-card { animation: slideUp 0.5s ease; }
    .auth-header { text-align: center; margin-bottom: 32px; }
    .auth-icon { font-size: 40px; display: block; margin-bottom: 12px; }
    .auth-header h1 { font-size: 28px; margin-bottom: 8px; }
    .auth-header p { color: #a0a3bd; font-size: 14px; }
    .auth-footer { text-align: center; margin-top: 20px; color: #a0a3bd; font-size: 14px; }
    .demo-credentials {
      margin-top: 24px;
      padding: 16px;
      background: rgba(102,126,234,0.08);
      border: 1px solid rgba(102,126,234,0.2);
      border-radius: 10px;
    }
    .demo-title {
      font-size: 11px;
      font-weight: 700;
      color: #667eea;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 8px;
    }
    .demo-row {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      color: #a0a3bd;
      padding: 4px 0;
    }
    code {
      color: #00d4aa;
      font-size: 12px;
      background: rgba(0,212,170,0.1);
      padding: 2px 8px;
      border-radius: 4px;
    }
  `]
})
export class LoginComponent {
  customerId = '';
  password = '';
  loading = false;
  errorMessage = '';

  constructor(private apiService: ApiService, private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.errorMessage = '';
    if (!this.customerId.trim()) { this.errorMessage = 'Customer ID is required'; return; }
    if (!this.password.trim()) { this.errorMessage = 'Password is required'; return; }

    this.loading = true;
    this.apiService.login(this.customerId, this.password).subscribe({
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
        this.errorMessage = err.error?.message || 'Login failed. Please check your credentials.';
      }
    });
  }
}
