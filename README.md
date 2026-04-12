# Tech Support Frontend

Vue 3 frontend for the Tech Support system.

The frontend provides authentication screens, profile management, admin user pages, ticket pages, ticket chat, and realtime updates through Laravel Echo and Laravel Reverb.

## Stack

- Vue 3
- TypeScript
- Vite
- Vue Router
- Axios
- Laravel Echo
- Pusher JS
- Docker
- Docker Compose
- Nginx

## Main Features

- Login and registration
- Cookie-based authentication with Laravel Sanctum
- CSRF bootstrap before auth actions
- Profile editing
- Admin users list and edit page
- Ticket creation and editing
- Ticket chat
- Realtime updates for users, tickets, statuses, and chat messages
- Responsive UI
- Role-based access control in the interface

## Project Structure

- `src/components/` — reusable UI components
- `src/views/` — route pages
- `src/modules/user/` — auth and user logic
- `src/modules/ticket/` — tickets logic
- `src/shared/api/` — API clients
- `src/shared/realtime/` — Echo / Reverb connection
- `src/assets/` — global styles
- `docker-compose.dev.yml` — development container
- `docker-compose.prod.yml` — production container

## Authentication

The frontend uses **session cookies**, not API tokens.

Flow:

1. Request `/sanctum/csrf-cookie`
2. Send login or register request with `withCredentials: true`
3. Backend creates authenticated session cookie
4. Frontend loads current user with `/api/user`
5. Route guards rely on stored current user data and session state

This reduces the risk compared to storing bearer tokens in localStorage.

## Realtime

Realtime is implemented with:

- Laravel Echo
- Pusher JS client
- Laravel Reverb on the backend

Used for:

- current user updates
- admin users list updates
- ticket status updates
- ticket chat updates
- ticket list updates

The frontend connects to Reverb through nginx over:

- `wss://127.0.0.1/app`

## Requirements

- Docker
- Docker Compose
- Running backend API
- Trusted local HTTPS backend at `https://127.0.0.1`

## Environment Setup

Create environment file:

```bash
cp .env.example .env
```

Expected variables:

- `VITE_BACKEND_URL`
- `VITE_REVERB_APP_KEY`
- `VITE_REVERB_HOST`
- `VITE_REVERB_PORT`
- `VITE_REVERB_SCHEME`
- `VITE_COMPANY_NAME`

## Local Development

Start frontend dev container:

```bash
docker compose -f docker-compose.dev.yml down -v --remove-orphans
docker compose -f docker-compose.dev.yml up -d --build
```

Typical local URLs:

- frontend dev: `http://127.0.0.1:5173`
- backend via nginx: `https://127.0.0.1`

If you proxy frontend through backend nginx, you can also open:

- `https://127.0.0.1`

## Tests and Build

Run inside the frontend container:

```bash
docker exec -it tech-support-front sh
npm run test
npm run build
```

## Production Launch

Start production container:

```bash
docker compose -f docker-compose.prod.yml down -v --remove-orphans
docker compose -f docker-compose.prod.yml up -d --build
```

## Notes

- Backend must be available before auth and realtime can work correctly
- Local HTTPS certificate must be trusted in the browser
- If cookies are not being sent, first check:
    - backend HTTPS
    - `withCredentials: true`
    - Sanctum stateful domains
    - session cookie domain and secure flag
    - CORS credentials support
- If realtime is not working, first check:
    - Reverb container is running
    - nginx proxies `/app` and `/apps`
    - frontend Reverb env values are correct
    - browser can open WSS connection without certificate errors