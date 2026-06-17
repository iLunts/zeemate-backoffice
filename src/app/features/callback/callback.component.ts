import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-callback',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  template: `
    <div class="flex min-h-screen items-center justify-center">
      <mat-spinner diameter="48" />
    </div>
  `,
})
export class CallbackComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly auth = inject(AuthService);

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('access_token');
    const navigate = this.route.snapshot.queryParamMap.get('navigate');

    if (token) {
      this.auth.handleCallback(token, navigate);
    } else {
      this.auth.login('/dashboard');
    }
  }
}
