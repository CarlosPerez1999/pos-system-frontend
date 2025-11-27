import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppHeader } from '../../../shared/components/app-header/app-header';
import {
  TabMenuItem,
  AppTabMenu,
} from '../../../shared/components/app-tab-menu/app-tab-menu';
import { ChangePasswordModal } from '../../../shared/components/change-password-modal/change-password-modal';

@Component({
  selector: 'admin-layout',
  imports: [RouterOutlet, AppHeader, AppTabMenu, ChangePasswordModal],
  templateUrl: './layout.html',
})
/**
 * Main layout for the Admin section.
 * Includes the header and tab menu navigation.
 */
export class AdminLayout {
  tabMenuItems: TabMenuItem[] = [
    {
      label: 'Dashboard',
      href: '/admin/dashboard',
      iconName: 'ix:dashboard',
    },
    {
      label: 'Products',
      href: '/admin/products',
      iconName: 'lucide:package',
    },
    {
      label: 'Inventory',
      href: '/admin/inventory',
      iconName: 'material-symbols:inventory',
    },
    {
      label: 'Users',
      href: '/admin/users',
      iconName: 'flowbite:users-solid',
    },
    {
      label: 'Configuration',
      href: '/admin/configuration',
      iconName: 'mdi:gear',
    },
  ];
}
