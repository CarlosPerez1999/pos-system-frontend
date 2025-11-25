import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
/**
 * Service to manage the application's theme (light/dark).
 * Persists the user's preference in local storage.
 */
export class ThemeService {
  private storageThemeKey = 'theme';
  isDarkMode = signal<boolean>(this.getInitialTheme());
  theme = computed(() => (this.isDarkMode() ? 'dark' : 'light'));

  constructor() {
    this.applyTheme(this.isDarkMode());
  }

  /**
   * Applies the selected theme to the document root.
   * @param isDark True for dark mode, false for light mode.
   */
  private applyTheme(isDark: boolean) {
    const theme = isDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
  }

  /**
   * Determines the initial theme based on local storage or system preference.
   * @returns True if dark mode is preferred, false otherwise.
   */
  private getInitialTheme(): boolean {
    const storedTheme = localStorage.getItem(this.storageThemeKey);
    if (storedTheme === 'dark') return true;
    if (storedTheme === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  /**
   * Toggles the current theme between light and dark.
   * Updates the signal, applies the theme, and saves to local storage.
   */
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
