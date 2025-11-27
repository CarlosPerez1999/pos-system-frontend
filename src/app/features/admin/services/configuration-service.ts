import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import {
  Configuration,
  ConfigurationUpdate,
} from '../../../core/models/configuration.model';
import { catchError, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
/**
 * Service for managing store configuration.
 * Handles fetching and updating configuration settings.
 */
export class ConfigurationService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.API_URL}/configuration`;

  isLoading = signal<boolean>(false);
  private hasError = signal<string | null>(null);
  private configuration = signal<Configuration | null>(null);
  configuration$ = this.configuration.asReadonly();

  /**
   * Fetches the current configuration from the API.
   * @returns An observable of the configuration data.
   */
  getConfiguration() {
    this.isLoading.set(true);
    this.hasError.set(null);
    return this.http.get<Configuration>(this.apiUrl).pipe(
      tap((config) => {
        this.configuration.set(config);
        this.isLoading.set(false);
      }),
      catchError((error: HttpErrorResponse) => {
        this.hasError.set(error.error.message || 'Error loading configuration');
        this.isLoading.set(false);
        throw error;
      })
    );
  }

  /**
   * Updates the configuration.
   * The backend will create the configuration automatically if it doesn't exist.
   * @param data The configuration data to update.
   */
  updateConfiguration(data: ConfigurationUpdate) {
    this.isLoading.set(true);
    this.hasError.set(null);
    return this.http.patch<Configuration>(this.apiUrl, data).pipe(
      tap((config) => {
        this.configuration.set(config);
        this.isLoading.set(false);
      }),
      catchError((error: HttpErrorResponse) => {
        this.hasError.set(
          error.error.message || 'Error updating configuration'
        );
        this.isLoading.set(false);
        throw error;
      })
    );
  }
}
