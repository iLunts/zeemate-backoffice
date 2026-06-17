import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { VehicleDto } from '../../core/api/api.service';

export const VehiclesActions = createActionGroup({
  source: 'Vehicles',
  events: {
    Load: emptyProps(),
    'Load Success': props<{ vehicles: VehicleDto[] }>(),
    'Load Failure': props<{ error: string }>(),
    Select: props<{ vin: string | null }>(),
  },
});
