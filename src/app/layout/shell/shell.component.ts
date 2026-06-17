import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthService } from '../../core/auth/auth.service';
import { VehiclesActions } from '../../store/vehicles/vehicles.actions';
import { selectAllVehicles, selectSelectedVin } from '../../store/vehicles/vehicles.selectors';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule,
    AsyncPipe,
  ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly auth = inject(AuthService);

  vehicles$ = this.store.select(selectAllVehicles);
  selectedVin$ = this.store.select(selectSelectedVin);

  ngOnInit(): void {
    this.store.dispatch(VehiclesActions.load());
  }

  onVinChange(vin: string): void {
    this.store.dispatch(VehiclesActions.select({ vin }));
  }

  logout(): void {
    this.auth.logout();
  }
}
