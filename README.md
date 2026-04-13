# Tech Support Frontend

Vue 3 frontend for the Tech Support system.

The frontend provides authentication screens, Google OAuth entry, Google registration completion flow, profile management, admin user pages, ticket pages, ticket chat, and realtime updates through Laravel Echo and Laravel Reverb.

## Stack

- Vue 3
- TypeScript
- Vite
- Vue Router
- Axios
- shadcn-vue
- Reka UI
- Laravel Echo
- Pusher JS
- Docker
- Docker Compose
- Nginx

## Main Features

- Login and registration by email and password
- Google OAuth login
- Completion form for new Google users
- Cookie-based authentication with Laravel Sanctum
- CSRF bootstrap before auth actions
- Profile editing
- Admin users list and edit page
- Ticket creation, listing, and status work
- Ticket chat
- Realtime updates for users, tickets, statuses, and chat messages
- Responsive UI
- Role-based access control in the interface
- Route guards for incomplete Google users

## Project Structure

- `src/components/` — reusable UI components
- `src/views/` — route pages
- `src/modules/user/` — auth and user logic
- `src/modules/ticket/` — tickets logic
- `src/shared/api/` — API clients
- `src/shared/realtime/` — Echo and Reverb connection
- `src/router/` — route config and guards
- `src/assets/` — global styles
- `src/tests/` — frontend unit tests
- `docker-compose.dev.yml` — development container
- `docker-compose.prod.yml` — production container

## Authentication

The frontend uses session cookies, not API tokens.

### Standard auth flow

1. Request `/sanctum/csrf-cookie`
2. Send login or register request with `withCredentials: true`
3. Backend creates authenticated session cookie
4. Frontend loads current user with `/api/user`
5. Route guards rely on current user state

This reduces risk compared to storing bearer tokens in localStorage.

### Google auth flow

1. User clicks `Продолжить через Google`
2. Frontend opens backend route `/auth/google/redirect`
3. Backend sends user to Google
4. After callback backend creates authenticated session
5. If user is fully ready, backend redirects to `/profile`
6. If user has no required department yet, backend redirects to `/auth/google/complete`
7. Frontend shows completion form with department and password
8. Frontend sends `POST /api/auth/google/complete-registration`
9. After success frontend reloads current user and redirects to profile

The router guard blocks incomplete Google users from opening the rest of the application until registration is completed.

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

The frontend connects to Reverb through nginx over secure WebSocket.

Typical local endpoint:

- `wss://127.0.0.1/app`

## Requirements

- Docker
- Docker Compose
- Running backend API
- Trusted local HTTPS backend at `https://127.0.0.1`
- Trusted local certificate in browser and system

## Environment Setup

Create environment file:

```bash
cp .env.example .env
```

Expected variables:

```env
VITE_BACKEND_URL=https://127.0.0.1
VITE_REVERB_APP_KEY=
VITE_REVERB_HOST=127.0.0.1
VITE_REVERB_PORT=443
VITE_REVERB_SCHEME=https
VITE_COMPANY_NAME=Tech Support
```

## Local Development

Start frontend dev container:

```bash
docker compose -f docker-compose.dev.yml down -v --remove-orphans
docker compose -f docker-compose.dev.yml up -d --build
```

Typical local URLs:

- frontend dev server: `http://127.0.0.1:5173`
- backend via nginx: `https://127.0.0.1`

If frontend is proxied through backend nginx, you can also open:

- `https://127.0.0.1`

## Tests and Build

Run inside the frontend container:

```bash
docker exec -it tech-support-front sh
npm run test
npm run build
```

Current frontend tests cover:

- router guard behavior
- login form
- register form
- current user initialization
- session service
- Google auth view logic
- Google registration completion form
- API client behavior

## Production Launch

Start production container:

```bash
docker compose -f docker-compose.prod.yml down -v --remove-orphans
docker compose -f docker-compose.prod.yml up -d --build
```

Before production launch, make sure:

- backend production URL is correct
- Reverb values are correct
- HTTPS is configured
- Google OAuth backend config matches production callback domain
- browser can establish secure cookie and WSS connection

## Notes

- Backend must be available before auth and realtime can work correctly
- Local HTTPS certificate must be trusted in the browser
- If cookies are not being sent, first check:
    - backend HTTPS
    - `withCredentials: true`
    - Sanctum stateful domains
    - session cookie domain and secure flag
    - CORS credentials support
- If Google login does not work, first check:
    - backend Google credentials
    - redirect URI
    - callback route availability
    - trusted HTTPS certificate
- If realtime is not working, first check:
    - Reverb container is running
    - nginx proxies `/app` and `/apps`
    - frontend Reverb env values are correct
    - browser can open WSS connection without certificate errors
