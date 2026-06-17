import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface VehicleDto {
  vin: string;
  name?: string;
  model?: string;
  batteryCapacityKwh?: number;
  createdAt: string;
}

export interface TripListItemDto {
  id: number;
  clientTripId: number;
  startMs: number;
  endMs: number;
  distanceKm?: number;
  consumedKwh?: number;
  avgConsumptionKwhPer100Km?: number;
  costByn?: number;
}

export interface TripPointDto {
  timestampMs: number;
  lat: number;
  lon: number;
  speedKmh?: number;
  soc?: number;
}

export interface TripDetailDto extends TripListItemDto {
  durationMs?: number;
  startSoc?: number;
  endSoc?: number;
  avgSpeedKmh?: number;
  maxSpeedKmh?: number;
  startLat?: number;
  startLon?: number;
  endLat?: number;
  endLon?: number;
  points: TripPointDto[];
}

export interface ChargeSessionListItemDto {
  id: number;
  clientSessionId: number;
  startMs: number;
  endMs: number;
  energyKwh?: number;
  avgPowerKw?: number;
  chargeType: string;
  costByn?: number;
}

export interface VehicleStatisticsDto {
  vin: string;
  tripCount: number;
  totalDistanceKm: number;
  totalConsumedKwh: number;
  avgConsumptionKwhPer100Km: number;
  totalTripCostByn: number;
  chargeSessionCount: number;
  totalChargedKwh: number;
  totalChargeCostByn: number;
  latestOdometerKm?: number;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private readonly http: HttpClient) {}

  listVehicles(): Observable<VehicleDto[]> {
    return this.http.get<VehicleDto[]>('/api/vehicles');
  }

  getStatistics(vin: string): Observable<VehicleStatisticsDto> {
    return this.http.get<VehicleStatisticsDto>(`/api/vehicles/${encodeURIComponent(vin)}/statistics`);
  }

  listTrips(vin: string, limit = 50): Observable<TripListItemDto[]> {
    return this.http.get<TripListItemDto[]>(
      `/api/vehicles/${encodeURIComponent(vin)}/trips?limit=${limit}`,
    );
  }

  getTrip(vin: string, tripId: number): Observable<TripDetailDto> {
    return this.http.get<TripDetailDto>(
      `/api/vehicles/${encodeURIComponent(vin)}/trips/${tripId}`,
    );
  }

  listChargeSessions(vin: string, limit = 50): Observable<ChargeSessionListItemDto[]> {
    return this.http.get<ChargeSessionListItemDto[]>(
      `/api/vehicles/${encodeURIComponent(vin)}/charge-sessions?limit=${limit}`,
    );
  }

  confirmPairing(code: string): Observable<{ vin: string; deviceTokenId: string }> {
    return this.http.post<{ vin: string; deviceTokenId: string }>('/api/pairing/confirm', { code });
  }
}
