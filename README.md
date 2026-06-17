# ZeeMate Back-Office

Angular 19 + Material client portal for vehicle statistics.

## Development

```bash
npm install --legacy-peer-deps
npm start
# → http://localhost:4202
```

Backend API must be running at http://localhost:5001 (or use docker compose).

## Auth

SSO via `account.1crm.io` → `/callback?access_token=...` → JWT in localStorage.

## Pairing

Open `/pair?code=<code>` after scanning QR in Sentry-Agent to link vehicle to your account.

## Generate API client

```bash
npm run generate:models
```

Requires backend Swagger at http://localhost:5001/swagger/v1/swagger.json.

## Docker

Built via root `zeemate-backend/docker-compose.yml` as `backoffice` service.
