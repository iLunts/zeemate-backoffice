import { AsyncPipe, DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { NgApexchartsModule } from 'ng-apexcharts';
import { switchMap, of } from 'rxjs';
import { ApexChart, ApexNonAxisChartSeries, ApexPlotOptions, ApexXAxis } from 'ng-apexcharts';
import { ApiService } from '../../core/api/api.service';
import { selectSelectedVin } from '../../store/vehicles/vehicles.selectors';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [NgApexchartsModule, AsyncPipe, DecimalPipe],
  template: `
    <h1 class="text-2xl font-semibold mb-4">Statistics</h1>
    @if (chartOptions$ | async; as chart) {
      <div class="bg-white rounded shadow-sm p-4">
        <apx-chart
          [series]="chart.series"
          [chart]="chart.chart"
          [labels]="chart.labels"
          [plotOptions]="chart.plotOptions"
        />
      </div>
      @if (stats$ | async; as stats) {
        <div class="grid grid-cols-2 gap-4 mt-4 text-sm">
          <div>Avg consumption: {{ stats.avgConsumptionKwhPer100Km | number:'1.1-1' }} kWh/100km</div>
          <div>Total charged: {{ stats.totalChargedKwh | number:'1.1-1' }} kWh</div>
          <div>Trip cost: {{ stats.totalTripCostByn | number:'1.2-2' }} BYN</div>
          <div>Charge cost: {{ stats.totalChargeCostByn | number:'1.2-2' }} BYN</div>
        </div>
      }
    }
  `,
})
export class StatisticsComponent {
  private readonly store = inject(Store);
  private readonly api = inject(ApiService);

  stats$ = this.store.select(selectSelectedVin).pipe(
    switchMap((vin) => (vin ? this.api.getStatistics(vin) : of(null))),
  );

  chartOptions$ = this.stats$.pipe(
    switchMap((stats) => {
      if (!stats) {
        return of(null);
      }
      return of({
        series: [stats.totalConsumedKwh, stats.totalChargedKwh] as ApexNonAxisChartSeries,
        chart: { type: 'donut', height: 320 } as ApexChart,
        labels: ['Energy used (trips)', 'Energy charged'],
        plotOptions: { pie: { donut: { size: '60%' } } } as ApexPlotOptions,
      });
    }),
  );
}
