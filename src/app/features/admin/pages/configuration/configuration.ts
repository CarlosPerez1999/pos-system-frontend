import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfigurationService } from '../../services/configuration-service';
import { ToastService } from '../../../../core/services/toast-service';
import { AppInputForm } from '../../../../shared/components/app-input-form/app-input-form';
import { AppButton } from '../../../../shared/components/app-button/app-button';

@Component({
  selector: 'app-configuration',
  imports: [ReactiveFormsModule, AppInputForm, AppButton],
  templateUrl: './configuration.html',
})
/**
 * Store Configuration Page Component
 *
 * Provides an interface for administrators to manage store-wide settings
 * such as the store name.
 *
 * Features:
 * - Loads current configuration on component initialization
 * - Validates required fields before submission
 * - Updates configuration via PATCH (backend creates if doesn't exist)
 * - Shows loading states during API operations
 * - Provides user feedback via toast notifications
 * - Handles API errors gracefully
 *
 * Access: Admin users only (protected by route guard)
 */
export class ConfigurationPage {
  fb = inject(FormBuilder);
  configurationService = inject(ConfigurationService);
  toastService = inject(ToastService);

  configurationForm = this.fb.group({
    storeName: this.fb.control<string>('', {
      validators: [Validators.required, Validators.minLength(2)],
      nonNullable: true,
    }),
  });

  ngOnInit(): void {
    this.loadConfiguration();
  }

  /**
   * Loads the current configuration from the API.
   * Populates the form with the retrieved data.
   */
  loadConfiguration() {
    this.configurationService.getConfiguration().subscribe({
      next: (config) => {
        this.configurationForm.patchValue(config);
      },
      error: (err) => {
        console.error('Error loading configuration:', err);
        // Don't show error toast - backend will create it on first save
      },
    });
  }

  /**
   * Saves the configuration via PATCH.
   * Backend automatically creates configuration if it doesn't exist.
   */
  onSave() {
    if (this.configurationForm.valid) {
      const data = this.configurationForm.getRawValue();

      this.configurationService.updateConfiguration(data).subscribe({
        next: () => {
          this.toastService.showToast({
            type: 'success',
            message: 'Configuration saved successfully',
          });
          // Reload configuration to update the signal
          this.loadConfiguration();
        },
        error: (err) => {
          console.error('Error saving configuration:', err);
          this.toastService.showToast({
            type: 'error',
            message: err.error?.message || 'Error saving configuration',
          });
        },
      });
    } else {
      this.toastService.showToast({
        type: 'warning',
        message: 'Please fill in all required fields',
      });
    }
  }
}
