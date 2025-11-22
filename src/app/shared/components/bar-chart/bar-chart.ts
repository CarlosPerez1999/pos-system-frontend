import { Component, input, ViewChild, effect, inject, computed, signal, DestroyRef } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartOptions, ChartData } from 'chart.js';
import { ThemeService } from '../../../core/services/theme-service';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
    selector: 'app-bar-chart',
    imports: [BaseChartDirective],
    template: `
    <div class="w-full">
      <canvas baseChart [data]="data()" [options]="chartOptions()" type='bar'></canvas>
    </div>
  `,
})
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

    private getTextColor(): string {
        return this.themeService.theme() === 'dark' ? '#e4e4e7' : '#38383b';
    }

    chartOptions = computed<ChartOptions<'bar'>>(() => {
        // Dependency on resizeSignal to trigger re-computation on window resize
        this.resizeSignal();
        const textColor = this.getTextColor();

        return {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: false
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: textColor
                    },
                    grid: {
                        color: 'rgba(113, 113, 123, 0.1)'
                    }
                },
                y: {
                    ticks: {
                        color: textColor
                    },
                    grid: {
                        color: 'rgba(113, 113, 123, 0.1)'
                    }
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
