# Hostel Management System

A full-stack hostel management app with separate frontend (Vite + React + Tailwind) and backend (Express + MongoDB).

## Structure
- `client/` — React + Vite frontend
- `server/` — Express + MongoDB backend

## Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

## Quick Start

### Server
```
cd server
npm install
# Create .env (see below) then:
npm run dev
```

Required `.env` in `server/`:
```
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongo_uri
JWT_SECRET=your_secret
JWT_EXPIRE=7d
```

### Client
```
cd client
npm install
npm run dev
```

Environment (Vite) in `client/` (already set):
```
VITE_API_BASE_URL=https://hostel-management-client.onrender.com
```

## Production
- Build client: `cd client && npm run build`
- Start server: `cd ../server && npm start`

## Notes
- CORS is configured to allow `https://hostel-management-client.onrender.com`.
- Health check: `GET /api/health` on the server URL.

## Credits
Built by dwdjitendra.
