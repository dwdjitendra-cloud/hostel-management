# Hostel Management System

Production-grade hostel management application built with a modern MERN stack. It provides separate experiences for administrators and students, robust authentication, clear data modeling, and a clean, responsive UI.

## Overview
- Admins manage students, hostels, rooms, and complaints; they can assign rooms and monitor system status via dashboards.
- Students can view their profile, hostel/room details, and submit and track complaints.
- The repository is organized as a two-project workspace: a Vite/React frontend in `client/` and an Express/MongoDB backend in `server/`.

## Features
### Admin
- Student management: create, update, delete, and list students.
- Hostel management: create and maintain hostels, metadata, warden details, and fees.
- Room management: define room types, capacity, amenities, and pricing.
- Room assignment: assign or reassign students to rooms and hostels.
- Complaint triage: view, filter, and update complaint status with comments.
- Dashboard: high-level metrics across students, rooms, hostels, and complaints.

### Student
- Profile management: view and update personal details.
- Hostel and room details: view assigned hostel, room, amenities, and fees.
- Complaint system: create complaints, view status history, and track resolutions.

### Cross-cutting
- Authentication and authorization: JWT-based auth with simple role separation.
- Validation and error handling: consistent API responses and input validation.
- CORS configuration: allow-list for the deployed client origin.
- Modern UI: Tailwind CSS with a small set of reusable components.

## Architecture
- Frontend: React 18, Vite, React Router, React Query, Tailwind CSS.
- Backend: Node.js (Express 4), MongoDB via Mongoose 7, JSON Web Tokens, bcryptjs.
- API surface: REST under `/api/*` with routes for auth, admin, student, hostels, rooms, and complaints.

```
project/
	client/        # React + Vite app
	server/        # Express API
	README.md
	render.yaml    # Optional Render blueprint (client + server)
```

## Environments and Configuration

### Client (Vite)
Environment variables live under `client/.env.*` and must be prefixed with `VITE_`.

Required:
```
VITE_API_BASE_URL=https://hostel-management-client.onrender.com
```

Notes:
- The value above is the API base URL used by the browser for all requests.
- Adjust this per environment as needed (e.g., local: `http://localhost:5000/api`).

### Server (Express)
Create `server/.env` with the following keys:
```
NODE_ENV=production
PORT=5000
MONGO_URI=<your_mongodb_uri>
JWT_SECRET=<your_jwt_secret>
JWT_EXPIRE=7d
```

Notes:
- CORS allow-list includes `https://hostel-management-client.onrender.com`.
- Health endpoint is exposed at `GET /api/health`.

## Quick Start (Local Development)

Backend:
```
cd server
npm install
npm run dev
```

Frontend:
```
cd client
npm install
npm run dev
```

Builds:
```
# Frontend build
cd client && npm run build

# Backend production start
cd ../server && npm start
```

## API Surface (Summary)
Authentication
- POST `/api/auth/admin/register`
- POST `/api/auth/student/register`
- POST `/api/auth/login`
- GET  `/api/auth/me`

Admin
- GET  `/api/admin/dashboard`
- GET  `/api/admin/students`
- DELETE `/api/admin/students/:id`
- PUT `/api/admin/students/:id/assign-room`

Hostel
- GET  `/api/hostels`
- GET  `/api/hostels/:id`
- POST `/api/hostels`
- PUT  `/api/hostels/:id`
- DELETE `/api/hostels/:id`

Room
- GET  `/api/rooms`
- GET  `/api/rooms/:id`
- POST `/api/rooms`
- PUT  `/api/rooms/:id`
- DELETE `/api/rooms/:id`

Complaint
- GET  `/api/complaints`
- GET  `/api/complaints/:id`
- POST `/api/complaints`
- PUT  `/api/complaints/:id`
- POST `/api/complaints/:id/comments`
- DELETE `/api/complaints/:id`

Student
- GET  `/api/student/dashboard`
- GET  `/api/student/profile`
- PUT  `/api/student/profile`

## Deployment

### Render (recommended)
This repository includes `render.yaml` for a blueprint deployment defining both services.

Services declared:
- Web service (API)
	- `rootDir: server`
	- `buildCommand: npm ci`
	- `startCommand: npm start`
	- `healthCheckPath: /api/health`
- Static site (client)
	- `rootDir: client`
	- `buildCommand: npm ci && npm run build`
	- `publishPath: dist`
	- `VITE_API_BASE_URL` environment variable

If you maintain Render services manually, ensure your Root Directory settings point to `server` and `client` respectively. Clear build caches when switching root directories.

## Development Notes
- Authentication: JWT stored client-side; 401 triggers logout on the client.
- CORS: Controlled in `server/server.js`. Update allow-list as you move environments.
- Tailwind: Custom color `border` is exposed under `theme.extend.colors.border` and used via `border-border` in component styles. Avoid applying this globally with the universal selector.

## Troubleshooting
- Client cannot find styles or classes: ensure `client/src/index.css` is imported in `client/src/main.jsx` and that Tailwind content globs include `./src/**/*.{js,ts,jsx,tsx}`.
- Unknown utility class errors: confirm the color exists in `tailwind.config.js` under `extend.colors` and restart the dev server.
- Render build looks for `hostel-management/*`: update service Root Directory to `client` or `server`, or deploy via `render.yaml`.
- Vite stale modules: remove `client/node_modules/.vite` and restart the dev server.

## License
Open source under the MIT license.
