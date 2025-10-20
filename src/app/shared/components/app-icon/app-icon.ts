import { Component, CUSTOM_ELEMENTS_SCHEMA, input } from '@angular/core';
import 'iconify-icon';

@Component({
  selector: 'app-icon',
  imports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app-icon.html',
})
export class AppIcon {
  icon = input.required<string>()
  width = input<string>('24')
  height = input<string>('24')
}
