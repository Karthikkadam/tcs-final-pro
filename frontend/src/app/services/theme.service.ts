import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'dark' | 'light';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'parcel_theme';
  private currentThemeSubject = new BehaviorSubject<Theme>('dark');
  currentTheme$ = this.currentThemeSubject.asObservable();

  constructor() {
    this.initTheme();
  }

  private initTheme(): void {
    const savedTheme = localStorage.getItem(this.THEME_KEY) as Theme | null;
    const initialTheme: Theme = savedTheme === 'light' ? 'light' : 'dark';
    this.setTheme(initialTheme);
  }

  get currentTheme(): Theme {
    return this.currentThemeSubject.value;
  }

  isDark(): boolean {
    return this.currentTheme === 'dark';
  }

  toggleTheme(): void {
    const newTheme: Theme = this.isDark() ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  setTheme(theme: Theme): void {
    this.currentThemeSubject.next(theme);
    localStorage.setItem(this.THEME_KEY, theme);
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.add('light-theme');
      document.documentElement.classList.remove('dark-theme');
    } else {
      document.documentElement.classList.add('dark-theme');
      document.documentElement.classList.remove('light-theme');
    }
  }
}
