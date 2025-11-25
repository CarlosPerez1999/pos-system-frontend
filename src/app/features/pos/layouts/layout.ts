import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppHeader } from '../../../shared/components/app-header/app-header';

@Component({
  selector: 'app-pos-layout',
  imports: [RouterOutlet, AppHeader],
  templateUrl: './layout.html',
})
/**
 * Main layout for the POS section.
 * Includes the header for seller access.
 */
export default class PosLayout {}
