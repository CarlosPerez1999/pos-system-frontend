import { Component, input, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-input-form',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './app-input-form.html',
})
export class AppInputForm {
  type = input<
    'text' | 'textarea' | 'number' | 'password' | 'email' | 'checkbox'
  >('text');
  label = input.required<string>();
  control = input.required<FormControl>();
  inputName = input.required<string>();

  get showError(): boolean {
    return (
      this.control().invalid && (this.control().touched || this.control().dirty)
    );
  }
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
