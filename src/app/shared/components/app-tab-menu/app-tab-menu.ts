import { Component, input, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AppIcon } from '../app-icon/app-icon';

/**
 * Interface defining the structure of a tab menu item.
 */
export interface TabMenuItem {
  label: string;
  href: string;
  iconName: string;
}

@Component({
  selector: 'app-tab-menu',
  imports: [RouterLink, AppIcon, RouterLinkActive],
  templateUrl: './app-tab-menu.html',
})
/**
 * Tab menu component for navigation.
 * Renders a list of links with icons.
 */
export class AppTabMenu {
  menuItems = input.required<TabMenuItem[]>();
}
