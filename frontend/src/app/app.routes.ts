import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

import { LandingComponent } from './components/landing/landing.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { CustomerHomeComponent } from './components/customer-home/customer-home.component';
import { OfficerHomeComponent } from './components/officer-home/officer-home.component';
import { BookingComponent } from './components/booking/booking.component';
import { OfficerBookingComponent } from './components/officer-booking/officer-booking.component';
import { PaymentComponent } from './components/payment/payment.component';
import { InvoiceComponent } from './components/invoice/invoice.component';
import { TrackingCustomerComponent } from './components/tracking-customer/tracking-customer.component';
import { TrackingOfficerComponent } from './components/tracking-officer/tracking-officer.component';
import { PickupScheduleComponent } from './components/pickup-schedule/pickup-schedule.component';
import { DeliveryStatusComponent } from './components/delivery-status/delivery-status.component';
import { PreviousBookingsComponent } from './components/previous-bookings/previous-bookings.component';
import { ViewAllBookingsComponent } from './components/view-all-bookings/view-all-bookings.component';
import { CancelBookingComponent } from './components/cancel-booking/cancel-booking.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { ContactSupportComponent } from './components/contact-support/contact-support.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },

  // Customer routes
  { path: 'customer/home', component: CustomerHomeComponent, canActivate: [authGuard], data: { role: 'CUSTOMER' } },
  { path: 'customer/booking', component: BookingComponent, canActivate: [authGuard], data: { role: 'CUSTOMER' } },
  { path: 'customer/payment/:bookingId', component: PaymentComponent, canActivate: [authGuard], data: { role: 'CUSTOMER' } },
  { path: 'customer/invoice/:bookingId', component: InvoiceComponent, canActivate: [authGuard], data: { role: 'CUSTOMER' } },
  { path: 'customer/tracking', component: TrackingCustomerComponent, canActivate: [authGuard], data: { role: 'CUSTOMER' } },
  { path: 'customer/bookings', component: PreviousBookingsComponent, canActivate: [authGuard], data: { role: 'CUSTOMER' } },
  { path: 'customer/cancel', component: CancelBookingComponent, canActivate: [authGuard], data: { role: 'CUSTOMER' } },
  { path: 'customer/feedback', component: FeedbackComponent, canActivate: [authGuard], data: { role: 'CUSTOMER' } },
  { path: 'customer/support', component: ContactSupportComponent, canActivate: [authGuard], data: { role: 'CUSTOMER' } },

  // Officer routes
  { path: 'officer/home', component: OfficerHomeComponent, canActivate: [authGuard], data: { role: 'OFFICER' } },
  { path: 'officer/booking', component: OfficerBookingComponent, canActivate: [authGuard], data: { role: 'OFFICER' } },
  { path: 'officer/tracking', component: TrackingOfficerComponent, canActivate: [authGuard], data: { role: 'OFFICER' } },
  { path: 'officer/delivery-status', component: DeliveryStatusComponent, canActivate: [authGuard], data: { role: 'OFFICER' } },
  { path: 'officer/pickup-schedule', component: PickupScheduleComponent, canActivate: [authGuard], data: { role: 'OFFICER' } },
  { path: 'officer/bookings', component: ViewAllBookingsComponent, canActivate: [authGuard], data: { role: 'OFFICER' } },
  { path: 'officer/cancel', component: CancelBookingComponent, canActivate: [authGuard], data: { role: 'OFFICER' } },
  { path: 'officer/feedback', component: FeedbackComponent, canActivate: [authGuard], data: { role: 'OFFICER' } },
  { path: 'officer/invoice/:bookingId', component: InvoiceComponent, canActivate: [authGuard], data: { role: 'OFFICER' } },

  { path: '**', redirectTo: '' }
];
