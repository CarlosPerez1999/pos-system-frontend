import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private storageThemeKey = 'theme';
  isDarkMode = signal<boolean>(this.getInitialTheme());
  theme = computed(() => this.isDarkMode() ? 'dark' : 'light');

  constructor() {
    this.applyTheme(this.isDarkMode());
  }

  private applyTheme(isDark: boolean) {
    const theme = isDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
  }

  private getInitialTheme(): boolean {
    const storedTheme = localStorage.getItem(this.storageThemeKey);
    if (storedTheme === 'dark') return true;
    if (storedTheme === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  toggleTheme() {
    const newThemeIsDark = !this.isDarkMode();
    this.isDarkMode.set(newThemeIsDark);
    this.applyTheme(newThemeIsDark);
    localStorage.setItem(
      this.storageThemeKey,
      newThemeIsDark ? 'dark' : 'light'
    );
  }
}
