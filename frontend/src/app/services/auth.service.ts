import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_KEY = 'parcel_user';

  login(userData: any): void {
    sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(userData));
  }

  logout(): void {
    sessionStorage.removeItem(this.STORAGE_KEY);
  }

  isLoggedIn(): boolean {
    return sessionStorage.getItem(this.STORAGE_KEY) !== null;
  }

  getUser(): any {
    const data = sessionStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  }

  getRole(): string {
    const user = this.getUser();
    return user ? user.role : '';
  }

  getCustomerId(): string {
    const user = this.getUser();
    return user ? user.customerId : '';
  }

  getName(): string {
    const user = this.getUser();
    return user ? user.name : '';
  }
}
