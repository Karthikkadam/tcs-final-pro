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
      <div class="main-content">
        <div class="page-header">
          <h1>Help & Support</h1>
          <p>We're here to help with your deliveries, tracking, and inquiries</p>
        </div>

        <div *ngIf="messageSent" class="alert alert-success">
          ✅ Thank you for contacting ParcelSwift support! Our executive will get in touch within 2 business hours. Ticket ID: #{{ ticketId }}
        </div>

        <div class="support-grid">
          <!-- Contact Options -->
          <div class="glass-card contact-info-card">
            <h3 class="section-title">📞 Quick Contact Channels</h3>
            
            <div class="channel-item">
              <div class="channel-icon">☎️</div>
              <div class="channel-details">
                <strong>24/7 Toll-Free Helpline</strong>
                <p>1800-PARCEL-SWIFT (1800-727-235)</p>
              </div>
            </div>

            <div class="channel-item">
              <div class="channel-icon">✉️</div>
              <div class="channel-details">
                <strong>Email Support</strong>
                <p>support&#64;parcelswift.com</p>
              </div>
            </div>

            <div class="channel-item">
              <div class="channel-icon">🏢</div>
              <div class="channel-details">
                <strong>Headquarters</strong>
                <p>Parcel Management Tower, BKC, Mumbai - 400051</p>
              </div>
            </div>

            <div class="channel-item">
              <div class="channel-icon">⏰</div>
              <div class="channel-details">
                <strong>Operating Hours</strong>
                <p>Support: 24/7 | Hubs: 06:00 AM - 10:00 PM</p>
              </div>
            </div>
          </div>

          <!-- Contact Form -->
          <div class="glass-card form-card">
            <h3 class="section-title">📝 Send a Support Query</h3>
            <form (ngSubmit)="sendQuery()">
              <div class="form-group">
                <label>Related Booking ID (Optional)</label>
                <input type="text" class="form-control" [(ngModel)]="queryBookingId" name="bookingId" placeholder="e.g. BKG00001">
              </div>

              <div class="form-group">
                <label>Issue Category *</label>
                <select class="form-control" [(ngModel)]="queryCategory" name="category" required>
                  <option value="Tracking / Delay">Tracking / Delivery Delay</option>
                  <option value="Billing & Refund">Billing / Payment / Refund</option>
                  <option value="Damage / Loss">Parcel Damage / Lost Item</option>
                  <option value="Pickup Rescheduling">Pickup / Drop Rescheduling</option>
                  <option value="General Inquiry">General Inquiry</option>
                </select>
              </div>

              <div class="form-group">
                <label>Message / Description *</label>
                <textarea class="form-control" [(ngModel)]="queryMessage" name="message" rows="4" 
                          placeholder="Describe your issue with as much detail as possible..." required></textarea>
              </div>

              <button type="submit" class="btn btn-primary btn-block" [disabled]="!queryMessage.trim()">
                Send Message →
              </button>
            </form>
          </div>
        </div>

        <!-- FAQs Section -->
        <div class="glass-card faq-section" style="margin-top: 24px;">
          <h3 class="section-title">❓ Frequently Asked Questions</h3>
          
          <div class="faq-item">
            <h4>How is the Parcel Service Cost calculated?</h4>
            <p>
              Cost = (Base Rate ₹50 + Weight Charge ₹0.02/g + Delivery Type Charge + Packing Preference Charge) × (1 + 5% Tax).
              Officer bookings include an additional ₹50 administrative booking fee.
            </p>
          </div>

          <div class="faq-item">
            <h4>When can I cancel my parcel booking?</h4>
            <p>
              Customers can cancel parcels that have the status 'Booked'. Cancelled parcels are refunded to your bank account within 5 working days. Once a parcel is 'In Transit' or 'Delivered', cancellation is no longer possible.
            </p>
          </div>

          <div class="faq-item">
            <h4>How do I provide feedback on my shipment?</h4>
            <p>
              Feedback can be submitted for any parcel once its delivery status is marked as 'Delivered'. You can rate your experience from 1 to 5 stars and provide review comments.
            </p>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .support-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .section-title { font-size: 16px; margin-bottom: 20px; }
    .channel-item { display: flex; align-items: flex-start; gap: 14px; padding: 14px 0; border-bottom: 1px solid rgba(255,255,255,0.06); }
    .channel-item:last-child { border-bottom: none; }
    .channel-icon { font-size: 24px; }
    .channel-details strong { display: block; font-size: 14px; color: #fff; margin-bottom: 2px; }
    .channel-details p { font-size: 13px; color: #a0a3bd; }
    .faq-section { padding: 24px; }
    .faq-item { padding: 16px 0; border-bottom: 1px solid rgba(255,255,255,0.06); }
    .faq-item:last-child { border-bottom: none; }
    .faq-item h4 { font-size: 15px; color: #667eea; margin-bottom: 6px; }
    .faq-item p { font-size: 13px; color: #a0a3bd; line-height: 1.6; }
    @media (max-width: 768px) {
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
