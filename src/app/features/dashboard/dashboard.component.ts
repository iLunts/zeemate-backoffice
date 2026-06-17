import { AsyncPipe, DecimalPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Store } from '@ngrx/store';
import { switchMap, of } from 'rxjs';
import { ApiService, VehicleStatisticsDto } from '../../core/api/api.service';
import { selectSelectedVin } from '../../store/vehicles/vehicles.selectors';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatCardModule, AsyncPipe, DecimalPipe],
  template: `
    <h1 class="text-2xl font-semibold mb-4">Dashboard</h1>
    @if (stats$ | async; as stats) {
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <mat-card class="p-4"><div class="text-sm text-gray-500">Trips</div><div class="text-2xl">{{ stats.tripCount }}</div></mat-card>
        <mat-card class="p-4"><div class="text-sm text-gray-500">Distance</div><div class="text-2xl">{{ stats.totalDistanceKm | number:'1.0-1' }} km</div></mat-card>
        <mat-card class="p-4"><div class="text-sm text-gray-500">Energy used</div><div class="text-2xl">{{ stats.totalConsumedKwh | number:'1.0-1' }} kWh</div></mat-card>
        <mat-card class="p-4"><div class="text-sm text-gray-500">Odometer</div><div class="text-2xl">{{ stats.latestOdometerKm ?? '—' }} km</div></mat-card>
      </div>
    } @else {
      <p>Select a linked vehicle or complete QR pairing in the car app.</p>
    }
  `,
})
export class DashboardComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly api = inject(ApiService);

  stats$ = this.store.select(selectSelectedVin).pipe(
    switchMap((vin) => (vin ? this.api.getStatistics(vin) : of(null))),
  );

  ngOnInit(): void {}
}
