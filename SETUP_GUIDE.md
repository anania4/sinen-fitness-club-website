# Sinen Fitness Club - Full Stack Setup Guide

## Project Structure
- `Back-end/` - Django REST API
- `Front-end/` - React + TypeScript + Vite

## Backend Setup (Django REST API)

### 1. Navigate to Backend Directory
```bash
cd Back-end
```

### 2. Create Virtual Environment (Recommended)
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Run Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. Create Superuser (Optional - for Admin Panel)
```bash
python manage.py createsuperuser
```

### 6. Start Django Server
```bash
python manage.py runserver
```

The API will be available at: `http://localhost:8000`
Admin panel at: `http://localhost:8000/admin/`

## Frontend Setup (React)

### 1. Navigate to Frontend Directory
```bash
cd Front-end
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file (already created):
```
VITE_API_URL=http://localhost:8000
```

### 4. Start Development Server
```bash
npm run dev
```

The frontend will be available at: `http://localhost:5173`

## API Endpoints

### Members
- `GET /api/members/` - List all members
- `POST /api/members/` - Create member
- `GET /api/members/{id}/` - Get member
- `PATCH /api/members/{id}/` - Update member
- `DELETE /api/members/{id}/` - Delete member

### Leads
- `GET /api/leads/` - List all leads
- `POST /api/leads/` - Create lead
- `PATCH /api/leads/{id}/status/` - Update lead status
- `DELETE /api/leads/{id}/` - Delete lead

### Payments
- `GET /api/payments/` - List all payments
- `POST /api/payments/` - Record payment
- `DELETE /api/payments/{id}/` - Delete payment

### Plans
- `GET /api/plans/` - List all plans
- `POST /api/plans/` - Create plan
- `PATCH /api/plans/{id}/` - Update plan
- `DELETE /api/plans/{id}/` - Delete plan

### Team
- `GET /api/team/` - List team members
- `POST /api/team/` - Add team member
- `PATCH /api/team/{id}/` - Update team member
- `DELETE /api/team/{id}/` - Remove team member

### Dashboard
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/dashboard/expiring-members` - Members expiring in 14 days
- `GET /api/dashboard/leads` - Recent pending leads
- `GET /api/dashboard/payments` - Recent payments
- `GET /api/dashboard/revenue` - Revenue chart (6 months)

## Features Implemented

### Frontend (React)
✅ Dashboard with stats and charts
✅ Members management (CRUD)
✅ Leads management with status tracking
✅ Payments recording and tracking
✅ Plans management
✅ Team members management
✅ Search and filter functionality
✅ Responsive design

### Backend (Django)
✅ RESTful API with Django REST Framework
✅ CORS configuration for frontend
✅ Models: Member, Lead, Payment, Plan, TeamMember
✅ Admin panel integration
✅ Dashboard analytics endpoints
✅ Proper serialization and validation

## Testing the Integration

1. Start both servers (Django on 8000, React on 5173)
2. Open `http://localhost:5173` in your browser
3. Try creating a plan first (Plans page)
4. Add members using the created plans
5. Record payments for members
6. Add leads and update their status
7. Add team members
8. Check the dashboard for statistics

## Troubleshooting

### CORS Issues
If you see CORS errors, ensure:
- Django server is running on port 8000
- `corsheaders` is installed
- CORS settings in `settings.py` include `http://localhost:5173`

### API Connection Issues
- Verify `.env` file has correct `VITE_API_URL`
- Check both servers are running
- Inspect browser console for errors

### Database Issues
- Delete `db.sqlite3` and run migrations again
- Check migration files in `api/migrations/`

## Production Deployment Notes

### Backend
- Change `DEBUG = False` in settings.py
- Set proper `ALLOWED_HOSTS`
- Use PostgreSQL instead of SQLite
- Configure static files serving
- Set secure `SECRET_KEY`

### Frontend
- Build: `npm run build`
- Update `VITE_API_URL` to production API URL
- Deploy `dist/` folder to hosting service

## Tech Stack

### Backend
- Django 4.2+
- Django REST Framework 3.14+
- django-cors-headers 4.0+
- SQLite (development)

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Lucide React (icons)
- Motion (animations)
