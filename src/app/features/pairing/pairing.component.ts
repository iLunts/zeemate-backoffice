import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from '../../core/api/api.service';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-pairing',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatProgressSpinnerModule],
  template: `
    <div class="flex min-h-screen items-center justify-center p-4">
      <mat-card class="w-full max-w-lg p-8">
        <h1 class="text-xl font-semibold mb-4">Link your vehicle</h1>

        @if (loading) {
          <div class="flex justify-center py-8"><mat-spinner diameter="40" /></div>
        } @else if (error) {
          <p class="text-red-600 mb-4">{{ error }}</p>
          @if (!auth.isAuthenticated()) {
            <button mat-flat-button color="primary" (click)="signIn()">Sign in to continue</button>
          }
        } @else if (success) {
          <p class="text-green-700">Vehicle {{ vin }} linked successfully. You can close this page.</p>
        }
      </mat-card>
    </div>
  `,
})
export class PairingComponent implements OnInit {
  readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(ApiService);

  loading = false;
  error: string | null = null;
  success = false;
  vin = '';

  ngOnInit(): void {
    const code = this.route.snapshot.queryParamMap.get('code');
    if (!code) {
      this.error = 'Missing pairing code';
      return;
    }

    if (!this.auth.check()) {
      this.auth.login(`/pair?code=${encodeURIComponent(code)}`);
      return;
    }

    this.confirm(code);
  }

  signIn(): void {
    const code = this.route.snapshot.queryParamMap.get('code');
    this.auth.login(code ? `/pair?code=${encodeURIComponent(code)}` : '/pair');
  }

  private confirm(code: string): void {
    this.loading = true;
    this.api.confirmPairing(code).subscribe({
      next: (result) => {
        this.loading = false;
        this.success = true;
        this.vin = result.vin;
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.error ?? 'Failed to confirm pairing';
      },
    });
  }
}
