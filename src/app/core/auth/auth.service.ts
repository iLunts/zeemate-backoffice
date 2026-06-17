import { Injectable, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { ACCESS_TOKEN } from '../constants/app.const';
import { AuthUtils } from './auth.utils';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly userSignal = signal<{ id?: string; name?: string; email?: string } | null>(null);

  readonly user = this.userSignal.asReadonly();
  readonly isAuthenticated = computed(() => {
    const token = this.accessToken;
    return !!token && !AuthUtils.isTokenExpired(token);
  });

  constructor(private readonly router: Router) {
    this.syncUserFromToken();
  }

  get accessToken(): string {
    return localStorage.getItem(ACCESS_TOKEN) ?? '';
  }

  set accessToken(token: string) {
    if (token) {
      localStorage.setItem(ACCESS_TOKEN, token);
    } else {
      localStorage.removeItem(ACCESS_TOKEN);
    }
    this.syncUserFromToken();
  }

  login(returnPath: string): void {
    const callbackUrl = `${environment.appUrl}/callback?navigate=${encodeURIComponent(returnPath)}`;
    const signInUrl = `${environment.authUrl}/sign-in?returnUrl=${encodeURIComponent(callbackUrl)}`;
    window.location.href = signInUrl;
  }

  handleCallback(accessToken: string, navigateTo: string | null): void {
    this.accessToken = accessToken;
    const path = navigateTo?.startsWith('/') ? navigateTo : '/dashboard';
    void this.router.navigateByUrl(path);
  }

  logout(): void {
    localStorage.removeItem(ACCESS_TOKEN);
    this.userSignal.set(null);
    void this.router.navigateByUrl('/login');
  }

  check(): boolean {
    const token = this.accessToken;
    if (!token || AuthUtils.isTokenExpired(token)) {
      return false;
    }
    this.syncUserFromToken();
    return true;
  }

  private syncUserFromToken(): void {
    const payload = AuthUtils.decodeToken(this.accessToken);
    if (!payload) {
      this.userSignal.set(null);
      return;
    }
    this.userSignal.set({
      id: payload.UserInformationID,
      name: (payload as { name?: string }).name,
      email: (payload as { email?: string }).email,
    });
  }
}
