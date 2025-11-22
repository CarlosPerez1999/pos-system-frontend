import { Component, input } from '@angular/core';
import { AppIcon } from '../app-icon/app-icon';
import { CurrencyPipe, DecimalPipe } from '@angular/common';

@Component({
    selector: 'app-kpi-card',
    imports: [AppIcon, CurrencyPipe, DecimalPipe],
    templateUrl: './kpi-card.html',
})
export class KpiCard {
    title = input.required<string>();
    value = input.required<number>();
    icon = input.required<string>();
    format = input<'currency' | 'number'>('number');
}
