import { createReducer, on } from '@ngrx/store';
import { VehicleDto } from '../../core/api/api.service';
import { VehiclesActions } from './vehicles.actions';

export interface VehiclesState {
  items: VehicleDto[];
  selectedVin: string | null;
  loading: boolean;
  error: string | null;
}

export const initialState: VehiclesState = {
  items: [],
  selectedVin: null,
  loading: false,
  error: null,
};

export const vehiclesReducer = createReducer(
  initialState,
  on(VehiclesActions.load, (state) => ({ ...state, loading: true, error: null })),
  on(VehiclesActions.loadSuccess, (state, { vehicles }) => ({
    ...state,
    items: vehicles,
    selectedVin: state.selectedVin ?? vehicles[0]?.vin ?? null,
    loading: false,
  })),
  on(VehiclesActions.loadFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(VehiclesActions.select, (state, { vin }) => ({ ...state, selectedVin: vin })),
);
