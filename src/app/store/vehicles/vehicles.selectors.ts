import { createFeatureSelector, createSelector } from '@ngrx/store';
import { VehiclesState } from './vehicles.reducer';

export const selectVehiclesState = createFeatureSelector<VehiclesState>('vehicles');

export const selectAllVehicles = createSelector(selectVehiclesState, (s) => s.items);
export const selectSelectedVin = createSelector(selectVehiclesState, (s) => s.selectedVin);
export const selectSelectedVehicle = createSelector(selectVehiclesState, (s) =>
  s.items.find((v) => v.vin === s.selectedVin) ?? null,
);
export const selectVehiclesLoading = createSelector(selectVehiclesState, (s) => s.loading);
