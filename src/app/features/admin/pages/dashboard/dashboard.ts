import { Component, inject, computed, OnInit } from '@angular/core';
import { ChartData } from 'chart.js';
import { SalesService } from '../../../sales/services/sales-service';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { KpiCard } from '../../../../shared/components/kpi-card/kpi-card';
import { BarChart } from '../../../../shared/components/bar-chart/bar-chart';

@Component({
  selector: 'app-dashboard',
  imports: [KpiCard, DatePipe, CurrencyPipe, BarChart],
  templateUrl: './dashboard.html',
})
/**
 * Dashboard page displaying key performance indicators and sales charts.
 */
export class DashboardPage implements OnInit {
  salesService = inject(SalesService);

  /**
   * Computes the top products from the sales summary.
   */
  topProducts = computed(() => {
    const summary = this.salesService.summary();
    return summary ? summary.topProducts : [];
  });

  /**
   * Prepares the data for the bar chart based on top products.
   * Updates dynamically when sales summary changes.
   */
  barChartData = computed<ChartData<'bar'>>(() => {
    const summary = this.salesService.summary();
    if (summary) {
      const labels = summary.topProducts.map((p) => p.name);
      const data = summary.topProducts.map((p) => p.quantity);
      return {
        labels,
        datasets: [
          {
            data,
            label: 'Sales',
            backgroundColor: '#4556daff',
            borderColor: 'rgba(75,192,192,1)',
            borderWidth: 2,
          },
        ],
      };
    }
    return {
      labels: [],
      datasets: [
        {
          data: [],
          label: 'Sales',
          backgroundColor: '#4556dff',
          borderColor: 'rgba(75,192,192,1)',
          borderWidth: 2,
        },
      ],
    };
  });

  ngOnInit(): void {
    this.salesService.getSummary();
    this.salesService.getTodaySales();
  }
}
