# Tech Support Frontend

Vue 3 frontend for the Tech Support system.  
The project provides authentication, profile management, user administration, tickets, ticket chat, and realtime updates through Laravel Reverb.

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

## Features

- Login and registration
- Token-based session handling
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

## Requirements

- Docker
- Docker Compose
- Running backend API
- HTTPS backend available at `https://127.0.0.1`

## HTTPS

The frontend is configured to work with an HTTPS backend.

Main local URLs:

- Frontend dev: `http://127.0.0.1`
- Frontend prod container: `http://127.0.0.1`
- Backend API: `https://127.0.0.1`
- Realtime / Reverb: `wss://127.0.0.1/app`

Because the backend uses HTTPS and secure WebSocket connections, the local backend certificate must be trusted by your system and browser.

## Environment Setup

Create the environment file:

```bash
cp .env.example .env
```

## Deployment

### Dev

```bash
docker compose -f docker-compose.dev.yml down -v --remove-orphans
docker compose -f docker-compose.dev.yml up -d --build
```

### Prod

```bash
docker compose -f docker-compose.prod.yml down -v --remove-orphans
docker compose -f docker-compose.prod.yml up -d --build
```

## Notes

- The frontend uses variables from `.env`.
- The backend must be started before checking API requests, authentication, or realtime features.
- If the backend certificate is not trusted, API requests and WebSocket connections may fail in the browser.
