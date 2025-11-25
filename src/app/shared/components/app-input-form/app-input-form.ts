import { TitleCasePipe } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-input-form',
  imports: [FormsModule, ReactiveFormsModule, TitleCasePipe],
  templateUrl: './app-input-form.html',
})
/**
 * Reusable form input component supporting various input types.
 * Handles validation display and value parsing.
 */
export class AppInputForm {
  type = input<
    | 'text'
    | 'textarea'
    | 'number'
    | 'password'
    | 'email'
    | 'checkbox'
    | 'select'
  >('text');
  selectOptions = input<string[]>([]);
  label = input.required<string>();
  control = input.required<FormControl>();
  inputName = input.required<string>();

  /**
   * Checks if the control has validation errors and has been touched or dirty.
   */
  get showError(): boolean {
    return (
      this.control().invalid && (this.control().touched || this.control().dirty)
    );
  }
  /**
   * Handles input changes for number types to ensure correct parsing.
   * @param event The input change event.
   * @param control The form control to update.
   */
  onNumberChange(event: Event, control: AbstractControl): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (this.type() === 'number') {
      if (value === '') {
        control.setValue(null);
      } else {
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          control.setValue(numValue);
        }
      }
    }
  }
}
