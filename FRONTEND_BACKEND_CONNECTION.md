# Frontend-Backend Connection Setup

## Changes Made

### Frontend (Registration.tsx)
✅ Connected registration form to Django REST API
✅ Form now submits data to `/api/leads/` endpoint
✅ Added form state management with React hooks
✅ Added loading state during submission
✅ Added error handling and user feedback
✅ Form data includes: name, phone, goal, preferred_time

### Frontend (Home.tsx - Pricing Section)
✅ Connected pricing section to Django REST API
✅ Fetches plans from `/api/plans/` endpoint
✅ Displays plans dynamically from database
✅ Falls back to default plans if API fails
✅ Admin can now manage pricing from Django admin panel

### Backend (Django)
✅ CORS already configured in settings.py
✅ Updated CORS to allow all origins in development mode
✅ Lead model already has all required fields
✅ LeadViewSet already configured with POST endpoint
✅ Plan model and PlanViewSet configured
✅ API endpoints: `POST /api/leads/`, `GET /api/plans/`
✅ Created management command to add default plans

## How It Works

### Lead Capture
1. User fills out the "Book Your Visit" form on the website
2. Form submits data to Django backend at `${API_BASE_URL}/api/leads/`
3. Backend creates a new Lead with status='pending'
4. Admin can view the lead in the admin dashboard
5. Success message shown to user, redirects to homepage

### Dynamic Pricing
1. Homepage loads and fetches plans from `${API_BASE_URL}/api/plans/`
2. Plans are displayed with pricing, duration, and features
3. Admin can add/edit/delete plans from Django admin panel
4. Changes reflect immediately on the website
5. If API fails, falls back to default hardcoded plans

## Testing Locally

### 1. Start Django Backend
```bash
cd Back-end
python manage.py runserver
```
Backend will run on http://localhost:8000

### 2. Create Default Plans (First Time Only)
```bash
cd Back-end
python manage.py create_default_plans
```
This creates the 3 default pricing plans in the database.

### 3. Start Frontend
```bash
cd Front-end
npm run dev
```
Frontend will run on http://localhost:5173

### 4. Test the Features
- Go to http://localhost:5173
- Check pricing section - should show plans from database
- Click "Book Your Visit" or "Join the Revolution"
- Fill out and submit the form
- Check Django admin at http://localhost:8000/admin to see the new lead

### 5. Manage Plans from Admin
- Go to http://localhost:8000/admin
- Login with superuser credentials
- Click "Plans" to add/edit/delete pricing plans
- Refresh the homepage to see changes

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000
```

For production (Vercel), set:
```
VITE_API_URL=https://your-django-backend-url.com
```

## API Endpoint Details

### Create Lead
**Endpoint:** `POST /api/leads/`

**Request Body:**
```json
{
  "name": "John Doe",
  "phone": "0911234567",
  "goal": "weight-loss",
  "preferred_time": "morning",
  "status": "pending"
}
```

**Response (Success):**
```json
{
  "id": 1,
  "name": "John Doe",
  "phone": "0911234567",
  "goal": "weight-loss",
  "preferred_time": "morning",
  "status": "pending",
  "created_at": "2024-01-01T12:00:00Z",
  "updated_at": "2024-01-01T12:00:00Z"
}
```

### Get Plans
**Endpoint:** `GET /api/plans/`

**Response:**
```json
[
  {
    "id": 1,
    "name": "Monthly",
    "price": "3000.00",
    "duration": "Monthly",
    "features": "Full Gym Access\nAll Group Classes\nLocker Service\nProgress Tracking",
    "created_at": "2024-01-01T12:00:00Z",
    "updated_at": "2024-01-01T12:00:00Z"
  },
  {
    "id": 2,
    "name": "3 Months",
    "price": "8000.00",
    "duration": "Quarterly",
    "features": "Full Gym Access\nAll Group Classes\nLocker Service\nProgress Tracking\nNutrition Consultation",
    "created_at": "2024-01-01T12:00:00Z",
    "updated_at": "2024-01-01T12:00:00Z"
  }
]
```

## Next Steps for Production

1. **Deploy Django Backend** (e.g., Railway, Render, PythonAnywhere)
2. **Run migrations and create default plans** on production server
3. **Update Frontend .env** with production API URL
4. **Update Django CORS settings** to only allow your Vercel domain
5. **Set DEBUG=False** in Django production settings
6. **Use environment variables** for sensitive data

## Files Modified

- `Front-end/src/Registration.tsx` - Added API integration for leads
- `Front-end/src/Home.tsx` - Added API integration for pricing plans
- `Back-end/sinengym/settings.py` - Updated CORS settings
- `Back-end/api/management/commands/create_default_plans.py` - Created management command

## Testing Checklist

- [ ] Backend server running
- [ ] Default plans created in database
- [ ] Frontend server running
- [ ] Pricing section displays plans from API
- [ ] Form submits successfully
- [ ] Lead appears in Django admin
- [ ] Can edit plans in Django admin
- [ ] Plan changes reflect on homepage
- [ ] Error handling works (try with backend offline)
- [ ] Success message displays
- [ ] Redirects to homepage after success
