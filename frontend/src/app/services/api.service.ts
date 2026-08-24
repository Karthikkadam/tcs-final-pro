import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, Booking, Payment, Feedback, LoginResponse } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = window.location.hostname === 'localhost' && window.location.port === '4200' && false
    ? 'http://localhost:8080/api'
    : 'https://tcs-final-pro-backend.onrender.com/api';

  constructor(private http: HttpClient) {}

  // Auth
  register(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register`, user);
  }

  login(customerId: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, { customerId, password });
  }

  getUser(customerId: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/auth/user/${customerId}`);
  }

  getAllCustomers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/auth/customers`);
  }

  // Bookings
  createCustomerBooking(booking: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/bookings/customer`, booking);
  }

  createOfficerBooking(booking: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/bookings/officer`, booking);
  }

  getBooking(bookingId: string): Observable<Booking> {
    return this.http.get<Booking>(`${this.baseUrl}/bookings/${bookingId}`);
  }

  getCustomerBookings(customerId: string): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.baseUrl}/bookings/customer/${customerId}`);
  }

  getAllBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.baseUrl}/bookings/all`);
  }

  cancelBooking(bookingId: string, customerId: string, role: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/bookings/${bookingId}/cancel`, { customerId, role });
  }

  updateStatus(bookingId: string, status: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/bookings/${bookingId}/status`, { status });
  }

  updateSchedule(bookingId: string, pickupTime: string, dropoffTime: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/bookings/${bookingId}/schedule`, { pickupTime, dropoffTime });
  }

  calculateCost(weight: number, deliveryType: string, packingPreference: string, isOfficer: boolean): Observable<any> {
    return this.http.post(`${this.baseUrl}/bookings/calculate-cost`, { weight, deliveryType, packingPreference, isOfficer });
  }

  // Payments
  processPayment(paymentData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/payments`, paymentData);
  }

  getPayment(bookingId: string): Observable<Payment> {
    return this.http.get<Payment>(`${this.baseUrl}/payments/${bookingId}`);
  }

  // Feedback
  addFeedback(feedback: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/feedback`, feedback);
  }

  getAllFeedback(): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(`${this.baseUrl}/feedback/all`);
  }

  getFeedbackByBooking(bookingId: string): Observable<Feedback> {
    return this.http.get<Feedback>(`${this.baseUrl}/feedback/booking/${bookingId}`);
  }
}
