# Sinen Fitness Club Management System

A full-stack gym management platform built for **Sinen Fitness Club** to digitize and streamline daily operations.

## Key Features

- **Member Management** — Register, track, and manage gym members with auto-expiry detection and status tracking (active, expired, frozen, suspended).
- **Attendance Check-in** — Reception-operated check-in/check-out system with live "In Gym" counter and session duration tracking.
- **Payments & Revenue** — Record payments, track monthly revenue trends with visual charts, and export financial reports to Excel.
- **Daily Passes** — Handle walk-in visitors with one-day passes (100 ETB).
- **Lead Management** — Capture trial requests from the public website and track follow-up status.
- **Plans & Pricing** — Manage membership plans displayed on the public-facing website.
- **Team Management** — Organize trainers and staff by role and fitness group.
- **Announcements** — Publish gym announcements to the website and Telegram.
- **Telegram Integration** — Automated membership expiry reminders via Telegram bot.
- **Excel Reporting** — One-click export to Excel on every section for offline record-keeping.

## Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS + Recharts + Lucide Icons
- **Backend**: Django REST Framework
- **Database**: SQLite3
- **Security**: Session-based authentication with superuser access control

## Development

### Backend
1.  `cd Back-end`
2.  `python -m venv venv`
3.  `source venv/bin/activate` (or `venv\Scripts\activate` on Windows)
4.  `pip install -r requirements.txt`
5.  `python manage.py runserver`

### Frontend
1.  `cd Front-end`
2.  `npm install`
3.  `npm run dev`

---
**Built by:** Anania Minda Tadesse. for Sinen Fitness Club, Addis Ababa 🇪🇹
