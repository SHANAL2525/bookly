# Bookly

Bookly is a full-stack booking and business management app built with:

- `Next.js 14` frontend
- `Spring Boot 3` backend
- `H2` default local database
- `MySQL` ready configuration for deployment

It supports:

- user registration and login
- business profile management
- services management
- staff management
- bookings management
- public booking endpoints

## Project Structure

```text
bookly/
  backend/    Spring Boot API
  frontend/   Next.js app
  scripts/    local dev scripts
```

## Requirements

- `Node.js`
- `npm`
- `Java 17+`
- `Maven`

## Run Locally

From the project root:

```powershell
npm run dev
```

This starts:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8080`

Useful check:

- Backend health: `http://localhost:8080/actuator/health`

To stop local services:

```powershell
npm run stop
```

## Frontend

Frontend lives in `frontend/`.

Run only the frontend:

```powershell
cd frontend
npm run dev
```

Default frontend API URL:

- `http://localhost:8080/api`

Example env file:

- `frontend/.env.local.example`

## Backend

Backend lives in `backend/`.

Run only the backend:

```powershell
cd backend
mvn spring-boot:run
```

Default backend port:

- `8080`

Default local database:

- `H2 file database`

Backend health endpoint:

- `GET /actuator/health`

## Authentication

Public endpoints include:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/public/services`
- `GET /api/public/staff`
- `POST /api/public/bookings`

Most other `/api` endpoints require a JWT token.

## Database

By default, the backend uses:

- `jdbc:h2:file:./data/bookly_db;MODE=MySQL`

You can switch to MySQL using environment variables such as:

- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`
- `DB_DRIVER`

## Build Commands

Frontend:

```powershell
cd frontend
npm run build
```

Backend tests:

```powershell
mvn -f backend\pom.xml test
```

## Deployment Files

This repo also includes:

- `docker-compose.yml`
- `backend/Dockerfile`
- `frontend/Dockerfile`
- `render.yaml`

## Notes

- Root `npm run dev` uses a Windows-friendly PowerShell runner in `scripts/dev.ps1`
- Local runtime logs and build outputs are ignored in git
