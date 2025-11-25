import {
  Component,
  input,
  ViewChild,
  effect,
  inject,
  computed,
  signal,
  DestroyRef,
} from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartOptions, ChartData } from 'chart.js';
import { ThemeService } from '../../../core/services/theme-service';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-bar-chart',
  imports: [BaseChartDirective],
  template: `
    <div class="w-full h-full ">
      <canvas
        class="overflow-x-scroll"
        baseChart
        [data]="data()"
        [options]="chartOptions()"
        type="bar"
      ></canvas>
    </div>
  `,
})
/**
 * Bar chart component using Chart.js.
 * Handles resizing and theme changes automatically.
 */
export class BarChart {
  data = input.required<ChartData<'bar'>>();
  private themeService = inject(ThemeService);
  private destroyRef = inject(DestroyRef);
  private resizeSignal = signal<number>(Date.now());

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  constructor() {
    const resizeSub = fromEvent(window, 'resize')
      .pipe(debounceTime(200))
      .subscribe(() => {
        this.resizeSignal.set(Date.now());
      });

    this.destroyRef.onDestroy(() => resizeSub.unsubscribe());
  }

  /**
   * Returns the text color based on the current theme.
   */
  private getTextColor(): string {
    return this.themeService.theme() === 'dark' ? '#e4e4e7' : '#38383b';
  }

  /**
   * Computes chart options, updating on resize or theme change.
   */
  chartOptions = computed<ChartOptions<'bar'>>(() => {
    // Dependency on resizeSignal to trigger re-computation on window resize
    this.resizeSignal();
    const textColor = this.getTextColor();
    const labels = (this.data().labels ?? []) as string[];
    return {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: false,
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColor,
          },
          grid: {
            color: 'rgba(113, 113, 123, 0.1)',
          },
        },
        y: {
          ticks: {
            color: textColor,
            callback: (value: string | number) => {
              const index = Number(value);
              const label = labels[index] ?? '';
              return label.length > 10 ? label.slice(0, 10) + '...' : label;
            },
          },
          grid: {
            color: 'rgba(113, 113, 123, 0.1)',
          },
        },
      },
    };
  });

  // Effect to update chart when data or options change
  updateChartEffect = effect(() => {
    const chartData = this.data();
    const options = this.chartOptions(); // Track options changes (including theme and resize)

    if (this.chart) {
      this.chart.update();
    }
  });
}
