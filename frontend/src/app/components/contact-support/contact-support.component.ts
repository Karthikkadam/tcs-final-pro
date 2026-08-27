import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-contact-support',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  template: `
    <div class="page-container">
      <app-navbar></app-navbar>

      <main class="main-content">
        <div class="page-header">
          <div>
            <h1>Customer Support & Help Center</h1>
            <p>24/7 assistance for shipment telemetry, billing inquiries, dispatch issues, and complaints</p>
          </div>
        </div>

        <div *ngIf="messageSent" class="alert alert-success">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          <div>
            <strong>Support Ticket Dispatched (#{{ ticketId }})</strong>
            <div style="margin-top: 4px; font-size: 12.5px;">
              An operations executive has been assigned to your ticket and will respond within 2 business hours.
            </div>
          </div>
        </div>

        <div class="support-grid">
          <!-- Contact Info Channels -->
          <div class="card contact-channels-card">
            <h3 class="section-title">Direct Contact Channels</h3>

            <div class="channel-list">
              <div class="channel-item">
                <div class="channel-icon-box primary">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </div>
                <div class="channel-details">
                  <span class="channel-label">24/7 Toll-Free Priority Helpline</span>
                  <strong>1800-PARCEL-SWIFT (1800-727-235)</strong>
                  <p>Instant phone support for active delivery issues</p>
                </div>
              </div>

              <div class="channel-item">
                <div class="channel-icon-box info">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                </div>
                <div class="channel-details">
                  <span class="channel-label">Electronic Mail Support</span>
                  <strong>support&#64;parcelswift.com</strong>
                  <p>Inquiries, corporate contracts, and billing verification</p>
                </div>
              </div>

              <div class="channel-item">
                <div class="channel-icon-box teal">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <div class="channel-details">
                  <span class="channel-label">Corporate Logistics Hub</span>
                  <strong>Parcel Management Tower, BKC, Mumbai - 400051</strong>
                  <p>Central terminal & officer hub operations</p>
                </div>
              </div>

              <div class="channel-item">
                <div class="channel-icon-box warning">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <div class="channel-details">
                  <span class="channel-label">Terminal Operating Hours</span>
                  <strong>Support: 24/7 | Hubs: 06:00 AM – 10:00 PM</strong>
                  <p>Couriers dispatch on all 7 calendar days</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Submit Ticket Form -->
          <div class="card ticket-form-card">
            <h3 class="section-title">Create Support Ticket</h3>

            <form (ngSubmit)="sendQuery()">
              <div class="form-group">
                <label>Related Booking ID (Optional)</label>
                <input 
                  type="text" 
                  class="form-control" 
                  [(ngModel)]="queryBookingId" 
                  name="bookingId" 
                  placeholder="e.g. BKG00001"
                />
              </div>

              <div class="form-group">
                <label>Inquiry Category *</label>
                <select class="form-control" [(ngModel)]="queryCategory" name="category" required>
                  <option value="Tracking / Delay">Milestone Tracking / In-Transit Delay</option>
                  <option value="Billing & Refund">Billing Verification / Payment / Refund</option>
                  <option value="Damage / Loss">Parcel Damage / Insurance Claim</option>
                  <option value="Pickup Rescheduling">Courier Pickup / Delivery Rescheduling</option>
                  <option value="General Inquiry">General Enterprise Inquiry</option>
                </select>
              </div>

              <div class="form-group">
                <label>Detailed Message *</label>
                <textarea 
                  class="form-control" 
                  [(ngModel)]="queryMessage" 
                  name="message" 
                  rows="4" 
                  placeholder="Describe your question or issue with relevant package context..." 
                  required
                ></textarea>
              </div>

              <button type="submit" class="btn btn-primary btn-block btn-lg" [disabled]="!queryMessage.trim()">
                Submit Support Request →
              </button>
            </form>
          </div>
        </div>

        <!-- FAQs Accordion Section -->
        <div class="card faq-card" style="margin-top: 24px;">
          <h3 class="section-title">Frequently Asked Questions</h3>

          <div class="faq-list">
            <div class="faq-item">
              <h4>How is the dynamic parcel service fee computed?</h4>
              <p>
                The total cost is calculated as: 
                <strong>(Base Rate ₹50 + Weight Surcharge ₹0.02/g + Delivery Speed Option + Packaging Preference + Officer Admin Fee if applicable) × 1.05 (5% GST)</strong>.
              </p>
            </div>

            <div class="faq-item">
              <h4>What is the refund timeline for cancelled bookings?</h4>
              <p>
                When a shipment in <strong>Booked</strong> state is cancelled, the transaction refund is processed back to the original source card within <strong>5 working days</strong>.
              </p>
            </div>

            <div class="faq-item">
              <h4>When can I submit feedback on a parcel?</h4>
              <p>
                Feedback ratings (1–5 Stars and review comments) can be submitted for any parcel once its status has officially transitioned to <strong>Delivered</strong>.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .support-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      align-items: start;
    }

    .contact-channels-card, .ticket-form-card, .faq-card {
      padding: 26px;
    }

    .section-title {
      font-size: 16px;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 20px;
    }

    .channel-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .channel-item {
      display: flex;
      align-items: flex-start;
      gap: 14px;
      padding: 12px;
      background: var(--bg-input);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-md);
    }

    .channel-icon-box {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .channel-icon-box.primary { background: var(--primary-subtle); color: #60a5fa; border: 1px solid var(--primary-border); }
    .channel-icon-box.info { background: var(--info-bg); color: #38bdf8; border: 1px solid var(--info-border); }
    .channel-icon-box.teal { background: rgba(13, 148, 136, 0.15); color: #2dd4bf; border: 1px solid rgba(13, 148, 136, 0.3); }
    .channel-icon-box.warning { background: var(--warning-bg); color: #fbbf24; border: 1px solid var(--warning-border); }

    .channel-details {
      flex: 1;
    }

    .channel-label {
      display: block;
      font-size: 11px;
      font-weight: 700;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .channel-details strong {
      display: block;
      font-size: 14px;
      color: var(--text-primary);
      margin: 2px 0;
    }

    .channel-details p {
      font-size: 12px;
      color: var(--text-secondary);
    }

    .faq-list {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .faq-item {
      background: var(--bg-input);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-md);
      padding: 16px 18px;
    }

    .faq-item h4 {
      font-size: 14.5px;
      font-weight: 700;
      color: #60a5fa;
      margin-bottom: 6px;
    }

    .faq-item p {
      font-size: 13px;
      color: var(--text-secondary);
      line-height: 1.5;
    }

    @media (max-width: 992px) {
      .support-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class ContactSupportComponent {
  queryBookingId = '';
  queryCategory = 'Tracking / Delay';
  queryMessage = '';
  messageSent = false;
  ticketId = '';

  sendQuery(): void {
    if (!this.queryMessage.trim()) return;
    this.ticketId = Math.floor(100000 + Math.random() * 900000).toString();
    this.messageSent = true;
    this.queryMessage = '';
    this.queryBookingId = '';
  }
}
