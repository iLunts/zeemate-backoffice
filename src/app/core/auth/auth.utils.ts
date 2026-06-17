export class AuthUtils {
  static isTokenExpired(token: string, offsetSeconds = 0): boolean {
    if (!token) {
      return true;
    }

    const exp = this.getTokenExpirationDate(token);
    if (!exp) {
      return true;
    }

    return exp.valueOf() <= Date.now() + offsetSeconds * 1000;
  }

  static getTokenExpirationDate(token: string): Date | null {
    const payload = this.decodeToken(token);
    if (!payload?.exp) {
      return null;
    }

    return new Date(payload.exp * 1000);
  }

  static decodeToken(token: string): { exp?: number; UserInformationID?: string } | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }
      const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const decoded = decodeURIComponent(
        atob(payload)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join(''),
      );
      return JSON.parse(decoded);
    } catch {
      return null;
    }
  }
}
