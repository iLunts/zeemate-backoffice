import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatCardModule, MatButtonModule],
  template: `
    <div class="flex min-h-screen items-center justify-center p-4">
      <mat-card class="w-full max-w-md p-8 text-center">
        <h1 class="text-2xl font-semibold mb-2">ZeeMate</h1>
        <p class="text-gray-600 mb-6">Sign in to view your vehicle statistics</p>
        <button mat-flat-button color="primary" (click)="signIn()">Sign in with 1CRM</button>
      </mat-card>
    </div>
  `,
})
export class LoginComponent {
  private readonly auth = inject(AuthService);

  signIn(): void {
    this.auth.login('/dashboard');
  }
}
