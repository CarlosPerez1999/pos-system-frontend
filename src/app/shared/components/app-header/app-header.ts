import { Component, inject, input, signal } from '@angular/core';
import { AppButton } from "../app-button/app-button";
import { ThemeService } from '../../../core/services/theme-service';
import { AppIcon } from "../app-icon/app-icon";


@Component({
  selector: 'app-header',
  imports: [AppButton, AppIcon],
  templateUrl: './app-header.html',
})
export class AppHeader {
  title = "POS System"
  subTitle = input<string>('') 
  themeService = inject(ThemeService)

}
