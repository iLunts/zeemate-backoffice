import { AsyncPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { switchMap, of } from 'rxjs';
import { ApiService } from '../../core/api/api.service';
import { selectSelectedVin } from '../../store/vehicles/vehicles.selectors';

@Component({
  selector: 'app-charging',
  standalone: true,
  imports: [MatTableModule, AsyncPipe, DatePipe, DecimalPipe],
  template: `
    <h1 class="text-2xl font-semibold mb-4">Charging sessions</h1>
    @if (sessions$ | async; as sessions) {
      <table mat-table [dataSource]="sessions" class="w-full bg-white rounded shadow-sm">
        <ng-container matColumnDef="start">
          <th mat-header-cell *matHeaderCellDef>Start</th>
          <td mat-cell *matCellDef="let row">{{ row.startMs | date:'short' }}</td>
        </ng-container>
        <ng-container matColumnDef="energy">
          <th mat-header-cell *matHeaderCellDef>Energy</th>
          <td mat-cell *matCellDef="let row">{{ row.energyKwh | number:'1.1-1' }} kWh</td>
        </ng-container>
        <ng-container matColumnDef="power">
          <th mat-header-cell *matHeaderCellDef>Avg power</th>
          <td mat-cell *matCellDef="let row">{{ row.avgPowerKw | number:'1.1-1' }} kW</td>
        </ng-container>
        <ng-container matColumnDef="type">
          <th mat-header-cell *matHeaderCellDef>Type</th>
          <td mat-cell *matCellDef="let row">{{ row.chargeType }}</td>
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
export class ChargingComponent {
  private readonly store = inject(Store);
  private readonly api = inject(ApiService);

  columns = ['start', 'energy', 'power', 'type', 'cost'];
  sessions$ = this.store.select(selectSelectedVin).pipe(
    switchMap((vin) => (vin ? this.api.listChargeSessions(vin) : of([]))),
  );
}
