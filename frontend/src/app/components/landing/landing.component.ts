import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="landing">
      <div class="bg-effects">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>
      </div>

      <header class="landing-header">
        <div class="logo">
          <span>📦</span>
          <span class="logo-text">ParcelSwift</span>
        </div>
        <div class="header-actions">
          <a routerLink="/login" class="btn btn-secondary">Log In</a>
          <a routerLink="/register" class="btn btn-primary">Get Started</a>
        </div>
      </header>

      <main class="hero">
        <div class="hero-content">
          <div class="hero-badge">🚀 Fast & Reliable Parcel Delivery</div>
          <h1>Ship Your Parcels<br><span class="gradient-text">Anywhere, Anytime</span></h1>
          <p class="hero-description">
            The most streamlined platform for parcel booking, real-time tracking,
            and complete delivery management. Built for speed, designed for simplicity.
          </p>
          <div class="hero-actions">
            <a routerLink="/register" class="btn btn-primary btn-lg">Start Shipping →</a>
            <a routerLink="/login" class="btn btn-secondary btn-lg">Sign In</a>
          </div>
          <div class="hero-stats">
            <div class="stat">
              <span class="stat-number">10K+</span>
              <span class="stat-label">Parcels Delivered</span>
            </div>
            <div class="stat">
              <span class="stat-number">99.9%</span>
              <span class="stat-label">Delivery Rate</span>
            </div>
            <div class="stat">
              <span class="stat-number">24/7</span>
              <span class="stat-label">Live Tracking</span>
            </div>
          </div>
        </div>

        <div class="hero-visual">
          <div class="feature-cards">
            <div class="feature-card glass-card" style="animation-delay: 0s;">
              <div class="feature-icon">📋</div>
              <h3>Easy Booking</h3>
              <p>Book parcels in minutes with our streamlined booking system</p>
            </div>
            <div class="feature-card glass-card" style="animation-delay: 0.1s;">
              <div class="feature-icon">🔍</div>
              <h3>Real-time Tracking</h3>
              <p>Track your parcels in real-time with detailed status updates</p>
            </div>
            <div class="feature-card glass-card" style="animation-delay: 0.2s;">
              <div class="feature-icon">💳</div>
              <h3>Secure Payments</h3>
              <p>Pay securely with multiple payment options available</p>
            </div>
            <div class="feature-card glass-card" style="animation-delay: 0.3s;">
              <div class="feature-icon">⭐</div>
              <h3>Rate & Feedback</h3>
              <p>Share your experience and help us improve our services</p>
            </div>
          </div>
        </div>
      </main>

      <footer class="landing-footer">
        <p>© 2026 ParcelSwift. Built for seamless parcel management.</p>
      </footer>
    </div>
  `,
  styles: [`
    .landing {
      min-height: 100vh;
      position: relative;
      overflow: hidden;
    }
    .bg-effects {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 0;
    }
    .orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.4;
    }
    .orb-1 {
      width: 400px;
      height: 400px;
      background: #667eea;
      top: -100px;
      right: -100px;
      animation: float 8s ease-in-out infinite;
    }
    .orb-2 {
      width: 300px;
      height: 300px;
      background: #764ba2;
      bottom: -50px;
      left: -50px;
      animation: float 10s ease-in-out infinite reverse;
    }
    .orb-3 {
      width: 200px;
      height: 200px;
      background: #00d4aa;
      top: 50%;
      left: 50%;
      animation: float 12s ease-in-out infinite;
    }
    .landing-header {
      position: relative;
      z-index: 10;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px 48px;
    }
    .logo {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 24px;
    }
    .logo-text {
      font-family: 'Outfit', sans-serif;
      font-weight: 800;
      font-size: 24px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .header-actions {
      display: flex;
      gap: 12px;
    }
    .hero {
      position: relative;
      z-index: 10;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 60px;
      padding: 60px 48px 40px;
      max-width: 1400px;
      margin: 0 auto;
      align-items: center;
    }
    .hero-badge {
      display: inline-block;
      padding: 8px 20px;
      background: rgba(102, 126, 234, 0.15);
      border: 1px solid rgba(102, 126, 234, 0.3);
      border-radius: 30px;
      font-size: 13px;
      font-weight: 600;
      color: #667eea;
      margin-bottom: 24px;
      animation: slideDown 0.5s ease;
    }
    .hero h1 {
      font-size: 52px;
      line-height: 1.1;
      margin-bottom: 20px;
      animation: slideDown 0.6s ease;
    }
    .gradient-text {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #00d4aa 100%);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: gradientShift 4s ease infinite;
    }
    .hero-description {
      font-size: 17px;
      color: #a0a3bd;
      line-height: 1.7;
      margin-bottom: 32px;
      max-width: 520px;
      animation: slideDown 0.7s ease;
    }
    .hero-actions {
      display: flex;
      gap: 16px;
      margin-bottom: 48px;
      animation: slideDown 0.8s ease;
    }
    .hero-stats {
      display: flex;
      gap: 40px;
      animation: slideDown 0.9s ease;
    }
    .stat {
      display: flex;
      flex-direction: column;
    }
    .stat-number {
      font-family: 'Outfit', sans-serif;
      font-size: 28px;
      font-weight: 800;
      color: #fff;
    }
    .stat-label {
      font-size: 12px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .feature-cards {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    .feature-card {
      padding: 24px;
      animation: slideUp 0.6s ease both;
    }
    .feature-card:hover {
      transform: translateY(-4px);
    }
    .feature-icon {
      font-size: 32px;
      margin-bottom: 12px;
    }
    .feature-card h3 {
      font-size: 16px;
      margin-bottom: 8px;
    }
    .feature-card p {
      font-size: 13px;
      color: #a0a3bd;
      line-height: 1.5;
    }
    .landing-footer {
      position: relative;
      z-index: 10;
      text-align: center;
      padding: 32px;
      color: #6b7280;
      font-size: 13px;
    }
    @media (max-width: 768px) {
      .hero {
        grid-template-columns: 1fr;
        padding: 32px 20px;
      }
      .hero h1 { font-size: 36px; }
      .landing-header { padding: 16px 20px; }
    }
  `]
})
export class LandingComponent {}
