# Sinen Fitness Club - Gym Management System

A comprehensive gym management system with member tracking, payment management, and automated Telegram reminders.

## Features

### Core Features
- 👥 Member Management (add, edit, track status)
- 💰 Payment Tracking & History
- 📊 Dashboard with Analytics
- 📢 Announcements System
- 🎯 Lead Management
- 👨‍💼 Team Management
- 📋 Membership Plans

### Telegram Integration 🤖
- ✅ Automated membership expiry reminders
- ✅ Smart reminder schedule (D-3, D-1, D-day, D+1, D+2, D+3)
- ✅ Manual test messaging
- ✅ Reminder history & statistics
- ✅ Configurable settings

## Project Structure

```
sinen-fitness-club/
├── Front-end/              # React + TypeScript frontend
│   ├── src/
│   │   ├── pages/         # Dashboard pages
│   │   └── components/    # Reusable components
│   └── package.json
├── Back-end/              # Django REST API
│   ├── api/              # Main API app
│   │   ├── models.py     # Database models
│   │   ├── views.py      # API endpoints
│   │   ├── serializers.py
│   │   └── telegram_service.py  # Telegram integration
│   ├── manage.py
│   └── requirements.txt
└── TELEGRAM_INTEGRATION.md  # Telegram setup guide
```

## Quick Start

### Backend Setup

1. Install Python dependencies:
```bash
cd Back-end
pip install -r requirements.txt
```

2. Run migrations:
```bash
python manage.py migrate
```

3. Create default plans:
```bash
python manage.py create_default_plans
```

4. Start the server:
```bash
python manage.py runserver
```

### Frontend Setup

1. Install dependencies:
```bash
cd Front-end
npm install
```

2. Configure API URL in `Front-end/src/config.ts`

3. Start development server:
```bash
npm run dev
```

## Telegram Integration Setup

### Quick Setup
```bash
cd Back-end
chmod +x setup_telegram.sh
./setup_telegram.sh
```

### Manual Setup
1. Create a Telegram bot via @BotFather
2. Get your chat ID
3. Configure in Settings page
4. Test in Telegram page

📖 **See [TELEGRAM_INTEGRATION.md](TELEGRAM_INTEGRATION.md) for detailed instructions**

### Automated Reminders

Run manually:
```bash
python manage.py send_telegram_reminders
```

Or set up a cron job for daily execution:
```bash
# Run every day at 9 AM
0 9 * * * cd /path/to/Back-end && python manage.py send_telegram_reminders
```

## API Endpoints

### Members
- `GET /api/members/` - List all members
- `POST /api/members/` - Create member
- `GET /api/members/{id}/` - Get member details
- `PATCH /api/members/{id}/` - Update member
- `DELETE /api/members/{id}/` - Delete member

### Telegram
- `GET /api/settings/` - Get settings
- `PATCH /api/settings/1/` - Update settings
- `POST /api/telegram/test` - Send test message
- `POST /api/telegram/send-reminders` - Trigger reminders
- `GET /api/telegram/stats` - Get statistics
- `GET /api/telegram-reminders/` - Get reminder history

### Dashboard
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/dashboard/expiring-members` - Members expiring soon
- `GET /api/dashboard/revenue` - Revenue chart data

## Documentation

- [TELEGRAM_INTEGRATION.md](TELEGRAM_INTEGRATION.md) - Telegram setup & usage
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Detailed setup instructions
- [QUICK_START.md](QUICK_START.md) - Quick start guide
- [ANNOUNCEMENTS_FEATURE.md](ANNOUNCEMENTS_FEATURE.md) - Announcements system
- [MEMBER_STATUS_AUTOMATION.md](MEMBER_STATUS_AUTOMATION.md) - Status automation

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- TailwindCSS
- Lucide Icons

### Backend
- Django 6.0
- Django REST Framework
- Python Telegram Bot
- APScheduler
- SQLite (development)

## Environment Variables

Create `.env` file in `Front-end/`:
```
VITE_API_BASE_URL=http://localhost:8000
```

## Production Deployment

1. Set `DEBUG = False` in Django settings
2. Configure allowed hosts
3. Use PostgreSQL instead of SQLite
4. Set up proper CORS settings
5. Use environment variables for secrets
6. Set up automated backup for database
7. Configure cron job for Telegram reminders

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use for your gym!

## Support

For issues or questions, check the documentation files or create an issue in the repository.
