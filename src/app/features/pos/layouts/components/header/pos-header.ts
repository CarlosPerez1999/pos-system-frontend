import { Component, inject } from '@angular/core';
import { AppButton } from "../../../../../shared/components/app-button/app-button";
import { ThemeService } from '../../../../../core/services/theme-service';

@Component({
  selector: 'pos-header',
  imports: [AppButton],
  templateUrl: './pos-header.html',
})
export class Header {
  themeService = inject(ThemeService)
}
