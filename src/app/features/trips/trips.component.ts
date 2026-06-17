import { AsyncPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { switchMap, of } from 'rxjs';
import { ApiService, TripListItemDto } from '../../core/api/api.service';
import { selectSelectedVin } from '../../store/vehicles/vehicles.selectors';

@Component({
  selector: 'app-trips',
  standalone: true,
  imports: [MatTableModule, AsyncPipe, DatePipe, DecimalPipe],
  template: `
    <h1 class="text-2xl font-semibold mb-4">Trips</h1>
    @if (trips$ | async; as trips) {
      <table mat-table [dataSource]="trips" class="w-full bg-white rounded shadow-sm">
        <ng-container matColumnDef="start">
          <th mat-header-cell *matHeaderCellDef>Start</th>
          <td mat-cell *matCellDef="let row">{{ row.startMs | date:'short' }}</td>
        </ng-container>
        <ng-container matColumnDef="distance">
          <th mat-header-cell *matHeaderCellDef>Distance</th>
          <td mat-cell *matCellDef="let row">{{ row.distanceKm | number:'1.1-1' }} km</td>
        </ng-container>
        <ng-container matColumnDef="energy">
          <th mat-header-cell *matHeaderCellDef>Energy</th>
          <td mat-cell *matCellDef="let row">{{ row.consumedKwh | number:'1.1-1' }} kWh</td>
        </ng-container>
        <ng-container matColumnDef="consumption">
          <th mat-header-cell *matHeaderCellDef>Avg consumption</th>
          <td mat-cell *matCellDef="let row">{{ row.avgConsumptionKwhPer100Km | number:'1.1-1' }} kWh/100km</td>
        </ng-container>
        <ng-container matColumnDef="cost">
          <th mat-header-cell *matHeaderCellDef>Cost</th>
          <td mat-cell *matCellDef="let row">{{ row.costByn | number:'1.2-2' }} BYN</td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="columns"></tr>
        <tr mat-row *matRowDef="let row; columns: columns"></tr>
      </table>
    }
  `,
})
export class TripsComponent {
  private readonly store = inject(Store);
  private readonly api = inject(ApiService);

  columns = ['start', 'distance', 'energy', 'consumption', 'cost'];
  trips$ = this.store.select(selectSelectedVin).pipe(
    switchMap((vin) => (vin ? this.api.listTrips(vin) : of([]))),
  );
}
