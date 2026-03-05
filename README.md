# Sinen Fitness Club Website

Gym management system with public website and admin dashboard.

## Project Structure

```
sinen-fitness-club/
├── Front-end/        # Public-facing website
│   ├── src/          # Home, Registration pages
│   └── package.json
└── Back-end/         # API server + Admin dashboard
    ├── server.ts     # Express API
    ├── package.json  # Backend dependencies
    └── admin/        # Admin dashboard
        ├── src/      # Dashboard components
        └── package.json
```

## Setup

1. Install frontend dependencies:
```bash
cd Front-end
npm install
```

2. Install backend dependencies:
```bash
cd Back-end
npm install
```

3. Install admin dashboard dependencies:
```bash
cd Back-end/admin
npm install
```

## Development

Run frontend:
```bash
cd Front-end
npm run dev
```

Run backend API:
```bash
cd Back-end
npm run dev
```

Run admin dashboard:
```bash
cd Back-end/admin
npm run dev
```
