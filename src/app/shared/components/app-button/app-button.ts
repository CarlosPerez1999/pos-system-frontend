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
  focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-0
  disabled:cursor-not-allowed disabled:opacity-60
  `;

  variants: Record<ButtonVariant, string> = {
    primary: 'bg-blue-500 text-white shadow-md hover:bg-blue-600 ',
    secondary: 'ring-2 ring-zinc-300  hover:ring-blue-600 hover:bg-background',
    ghost: 'hover:text-foreground hover:bg-background',
    destructive: 'bg-red-500 text-white shadow-md hover:bg-red-600',
    success: 'bg-green-500 text-white shadow-md hover:bg-green-600',
    danger: 'bg-amber-500 text-white shadow-md hover:bg-amber-600',
    info: 'bg-cyan-600 text-white shadow-md hover:bg-cyan-700',
  };

  sizes: Record<ButtonSize, string> = {
    icon: 'p-2.5 size-10 aspect-square',
    auto: 'py-1.5 px-3 text-sm sm:px-4 sm:text-base md:px-5 md:text-lg'
  };

  get styles(): string {
    const sizeClass = this.sizes[this.size()];
    const fullWidth = sizeClass !== this.sizes.icon ? 'w-full' : '';
    return `${this.baseStyles} ${fullWidth} ${
      this.variants[this.variant()]
    } ${sizeClass}`;
  }

  onClick() {
    if (this.disabled()) return;
    this.clickEmitter.emit();
  }
}
