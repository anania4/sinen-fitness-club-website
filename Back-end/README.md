# Gym Management System - Backend

Backend API server for the gym management system.

## Structure

```
Back-end/
├── server.ts          # Express API server
├── gym.db            # SQLite database
├── package.json      # Backend dependencies
└── admin/            # Admin dashboard (separate frontend)
    ├── src/          # React components
    ├── package.json  # Frontend dependencies
    └── vite.config.ts
```

## Setup

1. Install backend dependencies:
```bash
npm install
```

2. Install admin dashboard dependencies:
```bash
cd admin
npm install
cd ..
```

3. Create `.env` file (copy from `.env.example`)

## Development

Run the API server:
```bash
npm run dev
```

Run the admin dashboard (in a separate terminal):
```bash
cd admin
npm run dev
```

## Production

Build the admin dashboard:
```bash
cd admin
npm run build
cd ..
```

Run the server (serves API + built admin):
```bash
NODE_ENV=production npm start
```
