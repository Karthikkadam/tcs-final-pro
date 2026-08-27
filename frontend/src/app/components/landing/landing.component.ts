import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="landing-page">
      <!-- Top Navigation Bar -->
      <header class="top-nav">
        <div class="nav-container">
          <div class="brand">
            <div class="brand-badge">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m7.5 4.27 9 5.15"/>
                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
                <path d="m3.3 7 8.7 5 8.7-5"/>
                <path d="M12 22V12"/>
              </svg>
            </div>
            <div class="brand-text">
              <span class="brand-name">ParcelSwift</span>
              <span class="brand-desc">Enterprise Logistics</span>
            </div>
          </div>

          <div class="nav-links">
            <a href="#features" class="nav-link">Solutions</a>
            <a href="#how-it-works" class="nav-link">How It Works</a>
            <a href="#metrics" class="nav-link">Network</a>
          </div>

          <div class="nav-actions">
            <button class="theme-toggle-btn theme-icon-btn" (click)="themeService.toggleTheme()" [title]="themeService.isDark() ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
              <svg *ngIf="themeService.isDark()" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
              <svg *ngIf="!themeService.isDark()" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            </button>
            <a routerLink="/login" class="btn btn-secondary">Sign In</a>
            <a routerLink="/register" class="btn btn-primary">Create Account</a>
          </div>
        </div>
      </header>

      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-container">
          <div class="hero-badge">
            <span class="pulse-dot"></span>
            Next-Gen Parcel Management Platform
          </div>

          <h1 class="hero-title">
            Shipment Logistics, <br>
            <span class="highlight-text">Engineered for Precision</span>
          </h1>

          <p class="hero-subtitle">
            Experience end-to-end parcel booking, automated rate calculation, live multi-hub tracking, 
            and instant invoices built for enterprise reliability.
          </p>

          <!-- Quick Track & Action Bar -->
          <div class="hero-action-box card">
            <div class="tracking-search-form">
              <div class="input-icon-wrap">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
                </svg>
                <input 
                  type="text" 
                  [(ngModel)]="quickTrackingId" 
                  placeholder="Enter Booking ID (e.g. BKG00001) to track status..." 
                  class="track-input"
                  (keyup.enter)="quickTrack()"
                />
              </div>
              <button class="btn btn-primary btn-lg" (click)="quickTrack()">
                Track Shipment
              </button>
            </div>

            <div class="quick-links-row">
              <span class="quick-label">Quick Access:</span>
              <a routerLink="/login" class="chip-link">Customer Portal</a>
              <a routerLink="/login" class="chip-link">Officer Operations</a>
              <a routerLink="/register" class="chip-link">New Registration</a>
            </div>
          </div>
        </div>
      </section>

      <!-- How It Works / Lifecycle Section -->
      <section class="lifecycle-section" id="how-it-works">
        <div class="section-container">
          <div class="section-header text-center">
            <span class="section-tag">Logistics Workflow</span>
            <h2>Seamless 4-Stage Delivery Pipeline</h2>
            <p>From initial booking to recipient doorstep, every milestone is monitored with high precision.</p>
          </div>

          <div class="pipeline-grid">
            <div class="pipeline-card">
              <div class="step-num">01</div>
              <div class="step-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M16 16h6"/><path d="M19 13v6"/><path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>
                </svg>
              </div>
              <h3>Instant Booking</h3>
              <p>Configure weight, delivery speed, and packing preferences with instant dynamic pricing calculation.</p>
            </div>

            <div class="pipeline-card">
              <div class="step-num">02</div>
              <div class="step-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <h3>Scheduled Pickup</h3>
              <p>Automated officer dispatch and verified pickup scheduling aligned with your timeline.</p>
            </div>

            <div class="pipeline-card">
              <div class="step-num">03</div>
              <div class="step-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>
                </svg>
              </div>
              <h3>Hub Transit</h3>
              <p>Multi-checkpoint tracking with continuous status telemetry and verified handoffs.</p>
            </div>

            <div class="pipeline-card">
              <div class="step-num">04</div>
              <div class="step-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <h3>Verified Delivery</h3>
              <p>Direct doorstep delivery confirmation, automated tax invoice, and customer feedback capture.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Key Solutions / Features Grid -->
      <section class="features-section" id="features">
        <div class="section-container">
          <div class="section-header">
            <span class="section-tag">Enterprise Capabilities</span>
            <h2>Designed for Senders, Built for Officers</h2>
            <p>Everything you need for seamless parcel logistics in a single unified interface.</p>
          </div>

          <div class="features-grid">
            <div class="card feature-box">
              <div class="feature-icon-box">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </div>
              <h3>Dynamic Rate Calculator</h3>
              <p>Automatic weight scaling, speed surcharges, packing fees, and itemized 5% tax transparency.</p>
            </div>

            <div class="card feature-box">
              <div class="feature-icon-box">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
                </svg>
              </div>
              <h3>Secure Instant Payments</h3>
              <p>Seamless credit/debit card processing with full transaction receipt generation and status sync.</p>
            </div>

            <div class="card feature-box">
              <div class="feature-icon-box">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
                </svg>
              </div>
              <h3>Digital Tax Invoices</h3>
              <p>Printable corporate invoices with itemized cost breakdown, payment timestamps, and recipient logs.</p>
            </div>

            <div class="card feature-box">
              <div class="feature-icon-box">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <h3>Officer Operational Control</h3>
              <p>Book on customer behalf, update real-time status transitions, manage pickup timelines, and review metrics.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Network Metrics Section -->
      <section class="metrics-section" id="metrics">
        <div class="section-container">
          <div class="metrics-grid">
            <div class="metric-item">
              <div class="metric-val">100,000+</div>
              <div class="metric-lbl">Parcels Delivered</div>
            </div>
            <div class="metric-item">
              <div class="metric-val">99.98%</div>
              <div class="metric-lbl">On-Time Delivery SLA</div>
            </div>
            <div class="metric-item">
              <div class="metric-val">24 / 7</div>
              <div class="metric-lbl">Telemetry & Support</div>
            </div>
            <div class="metric-item">
              <div class="metric-val">5 Days</div>
              <div class="metric-lbl">Guaranteed Refund Processing</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="landing-footer">
        <div class="footer-container">
          <div class="footer-brand">
            <div class="brand">
              <div class="brand-badge">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="m7.5 4.27 9 5.15"/>
                  <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
                  <path d="m3.3 7 8.7 5 8.7-5"/>
                  <path d="M12 22V12"/>
                </svg>
              </div>
              <span class="brand-title">ParcelSwift</span>
            </div>
            <p class="footer-desc">Next-generation parcel and freight management platform for businesses, shippers, and delivery personnel.</p>
          </div>

          <div class="footer-compliance">
            <span class="compliance-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              256-Bit SSL Encrypted
            </span>
            <span class="compliance-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              ISO 9001 Compliant
            </span>
          </div>
        </div>
        <div class="footer-bottom">
          <p>© 2026 ParcelSwift Logistics Technologies Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .landing-page {
      background-color: var(--bg-app);
      color: var(--text-primary);
      min-height: 100vh;
    }

    /* Top Nav */
    .top-nav {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 72px;
      background: var(--bg-sidebar);
      backdrop-filter: blur(16px);
      border-bottom: 1px solid var(--border-default);
      z-index: 100;
      transition: background-color var(--transition-normal);
    }

    .nav-container {
      max-width: 1280px;
      margin: 0 auto;
      height: 100%;
      padding: 0 32px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
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
      font-size: 18px;
      font-weight: 800;
      color: var(--text-primary);
      display: block;
      line-height: 1.1;
    }

    .brand-desc {
      font-size: 10.5px;
      color: var(--text-muted);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .nav-links {
      display: flex;
      gap: 28px;
    }

    .nav-link {
      font-size: 13.5px;
      font-weight: 500;
      color: var(--text-secondary);
      transition: color var(--transition-fast);
    }

    .nav-link:hover {
      color: var(--text-primary);
    }

    .nav-actions {
      display: flex;
      gap: 12px;
    }

    /* Hero Section */
    .hero-section {
      padding: 160px 32px 100px;
      position: relative;
      background: radial-gradient(circle at 50% 10%, rgba(37, 99, 235, 0.12) 0%, transparent 60%);
      text-align: center;
    }

    .hero-container {
      max-width: 900px;
      margin: 0 auto;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 16px;
      background: var(--primary-subtle);
      border: 1px solid var(--primary-border);
      border-radius: var(--radius-full);
      font-size: 12.5px;
      font-weight: 600;
      color: #60a5fa;
      margin-bottom: 28px;
    }

    .pulse-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #3b82f6;
      box-shadow: 0 0 8px #3b82f6;
    }

    .hero-title {
      font-size: 54px;
      font-weight: 800;
      line-height: 1.12;
      letter-spacing: -0.03em;
      color: var(--text-primary);
      margin-bottom: 20px;
    }

    .highlight-text {
      background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #38bdf8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .hero-subtitle {
      font-size: 17px;
      color: var(--text-secondary);
      line-height: 1.6;
      max-width: 680px;
      margin: 0 auto 40px;
    }

    /* Quick Action Box */
    .hero-action-box {
      max-width: 720px;
      margin: 0 auto;
      padding: 24px;
      background: var(--bg-surface);
      border: 1px solid var(--border-default);
      text-align: left;
    }

    .tracking-search-form {
      display: flex;
      gap: 12px;
    }

    .input-icon-wrap {
      flex: 1;
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-icon-wrap svg {
      position: absolute;
      left: 14px;
      color: var(--text-muted);
    }

    .track-input {
      width: 100%;
      padding: 13px 14px 13px 44px;
      background: var(--bg-input);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-md);
      color: var(--text-primary);
      font-family: var(--font-sans);
      font-size: 14px;
      outline: none;
      transition: all var(--transition-fast);
    }

    .track-input:focus {
      border-color: var(--border-focus);
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
    }

    .quick-links-row {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-top: 18px;
      padding-top: 14px;
      border-top: 1px solid var(--border-subtle);
      flex-wrap: wrap;
    }

    .quick-label {
      font-size: 12px;
      color: var(--text-muted);
      font-weight: 600;
    }

    .chip-link {
      font-size: 12px;
      font-weight: 600;
      color: #60a5fa;
      background: rgba(37, 99, 235, 0.1);
      border: 1px solid rgba(37, 99, 235, 0.25);
      padding: 4px 10px;
      border-radius: var(--radius-sm);
      transition: all var(--transition-fast);
    }

    .chip-link:hover {
      background: rgba(37, 99, 235, 0.2);
      color: var(--text-primary);
    }

    /* Common Section Styles */
    .section-container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 80px 32px;
    }

    .section-header {
      margin-bottom: 48px;
    }

    .section-header.text-center {
      text-align: center;
    }

    .section-tag {
      font-size: 11px;
      font-weight: 700;
      color: var(--primary);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      display: block;
      margin-bottom: 8px;
    }

    .section-header h2 {
      font-size: 32px;
      font-weight: 800;
      color: var(--text-primary);
      margin-bottom: 10px;
    }

    .section-header p {
      font-size: 15px;
      color: var(--text-secondary);
      max-width: 600px;
      margin: 0 auto;
    }

    /* Pipeline Grid */
    .pipeline-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
    }

    .pipeline-card {
      background: var(--bg-surface);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-lg);
      padding: 28px 24px;
      position: relative;
      transition: all var(--transition-fast);
    }

    .pipeline-card:hover {
      border-color: var(--border-hover);
      transform: translateY(-2px);
    }

    .step-num {
      font-family: var(--font-mono);
      font-size: 12px;
      font-weight: 700;
      color: var(--primary);
      margin-bottom: 16px;
    }

    .step-icon {
      width: 44px;
      height: 44px;
      border-radius: var(--radius-md);
      background: var(--bg-surface-raised);
      border: 1px solid var(--border-default);
      color: #60a5fa;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
    }

    .pipeline-card h3 {
      font-size: 16px;
      font-weight: 700;
      margin-bottom: 8px;
      color: var(--text-primary);
    }

    .pipeline-card p {
      font-size: 13px;
      color: var(--text-secondary);
      line-height: 1.5;
    }

    /* Features Grid */
    .features-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
    }

    .feature-box {
      padding: 28px;
    }

    .feature-icon-box {
      width: 44px;
      height: 44px;
      border-radius: var(--radius-md);
      background: var(--primary-subtle);
      border: 1px solid var(--primary-border);
      color: #60a5fa;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
    }

    .feature-box h3 {
      font-size: 17px;
      font-weight: 700;
      margin-bottom: 8px;
      color: var(--text-primary);
    }

    .feature-box p {
      font-size: 13.5px;
      color: var(--text-secondary);
      line-height: 1.6;
    }

    /* Metrics Section */
    .metrics-section {
      border-top: 1px solid var(--border-subtle);
      border-bottom: 1px solid var(--border-subtle);
      background: rgba(255, 255, 255, 0.01);
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 32px;
      text-align: center;
    }

    .metric-val {
      font-family: var(--font-heading);
      font-size: 38px;
      font-weight: 800;
      color: var(--text-primary);
      letter-spacing: -0.03em;
      margin-bottom: 6px;
    }

    .metric-lbl {
      font-size: 12.5px;
      color: var(--text-muted);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    /* Footer */
    .landing-footer {
      padding: 60px 32px 30px;
      background: var(--bg-sidebar);
      border-top: 1px solid var(--border-default);
    }

    .footer-container {
      max-width: 1280px;
      margin: 0 auto 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 24px;
    }

    .footer-brand {
      max-width: 420px;
    }

    .footer-desc {
      font-size: 13px;
      color: var(--text-muted);
      margin-top: 12px;
      line-height: 1.5;
    }

    .footer-compliance {
      display: flex;
      gap: 12px;
    }

    .compliance-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      background: var(--bg-surface);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-sm);
      font-size: 11.5px;
      color: var(--text-secondary);
      font-weight: 500;
    }

    .footer-bottom {
      max-width: 1280px;
      margin: 0 auto;
      padding-top: 24px;
      border-top: 1px solid var(--border-subtle);
      text-align: center;
      font-size: 12.5px;
      color: var(--text-muted);
    }

    @media (max-width: 992px) {
      .hero-title { font-size: 40px; }
      .pipeline-grid { grid-template-columns: repeat(2, 1fr); }
      .metrics-grid { grid-template-columns: repeat(2, 1fr); }
      .nav-links { display: none; }
    }

    @media (max-width: 640px) {
      .hero-title { font-size: 32px; }
      .pipeline-grid, .features-grid, .metrics-grid { grid-template-columns: 1fr; }
      .tracking-search-form { flex-direction: column; }
    }
  `]
})
export class LandingComponent {
  quickTrackingId = '';

  constructor(
    private router: Router,
    public themeService: ThemeService
  ) {}

  quickTrack(): void {
    if (this.quickTrackingId.trim()) {
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
