import { Component, inject, input, signal } from '@angular/core';
import { AppButton } from "../app-button/app-button";
import { ThemeService } from '../../../core/services/theme-service';

@Component({
  selector: 'app-header',
  imports: [AppButton],
  templateUrl: './app-header.html',
})
export class AppHeader {
  title = "POS System"
  subTitle = input<string>('') 
  themeService = inject(ThemeService)

}
