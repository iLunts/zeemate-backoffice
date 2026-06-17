import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { ApiService } from '../../core/api/api.service';
import { VehiclesActions } from './vehicles.actions';

@Injectable()
export class VehiclesEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(ApiService);

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VehiclesActions.load),
      switchMap(() =>
        this.api.listVehicles().pipe(
          map((vehicles) => VehiclesActions.loadSuccess({ vehicles })),
          catchError((err) =>
            of(VehiclesActions.loadFailure({ error: err?.message ?? 'Failed to load vehicles' })),
          ),
        ),
      ),
    ),
  );
}
