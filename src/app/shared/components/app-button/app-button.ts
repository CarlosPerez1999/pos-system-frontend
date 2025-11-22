import { Component, input, output } from '@angular/core';
import { ButtonSize, ButtonVariant } from './app-button-types';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './app-button.html',
})
export class AppButton {
  variant = input<ButtonVariant>('primary');
  size = input<ButtonSize>('auto');
  disabled = input<boolean>(false);

  clickEmitter = output();

  baseStyles = `
  flex gap-2 justify-center items-center font-bold cursor-pointer rounded-lg  transition-color duration-300 
  focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-0
  disabled:cursor-not-allowed disabled:opacity-60
  `;

  variants: Record<ButtonVariant, string> = {
    primary: 'bg-primary text-white shadow-md hover:bg-primary-hover ',
    secondary: 'ring-2 ring-border-strong  hover:ring-primary hover:bg-background',
    ghost: 'hover:text-foreground hover:bg-background',
    destructive: 'bg-error text-white shadow-md hover:bg-error-hover',
    success: 'bg-success text-white shadow-md hover:bg-success-hover',
    danger: 'bg-warning text-white shadow-md hover:bg-warning-hover',
    info: 'bg-info text-white shadow-md hover:bg-info-hover',
  };

  sizes: Record<ButtonSize, string> = {
    icon: 'p-2.5 size-10 aspect-square',
    auto: 'py-1.5 px-3 text-sm sm:px-4 sm:text-base md:px-5 md:text-lg'
  };

  get styles(): string {
    const sizeClass = this.sizes[this.size()];
    const fullWidth = sizeClass !== this.sizes.icon ? 'w-full' : '';
    return `${this.baseStyles} ${fullWidth} ${this.variants[this.variant()]
      } ${sizeClass}`;
  }

  onClick() {
    if (this.disabled()) return;
    this.clickEmitter.emit();
  }
}
