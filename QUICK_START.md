# Quick Start Guide - Sinen Fitness Club

## First Time Setup

### 1. Setup Backend (Django)

```bash
cd Back-end

# Create virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser for admin access
python manage.py createsuperuser
# Enter username, email, and password when prompted

# Create default plans
python manage.py create_default_plans

# Start the backend server
python manage.py runserver
```

Backend will run on: http://localhost:8000

### 2. Setup Frontend (React)

Open a new terminal:

```bash
cd Front-end

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:8000" > .env

# Start the frontend
npm run dev
```

Frontend will run on: http://localhost:5173

## Testing the Connection

### Test 1: Check Backend API
Open browser and go to:
- http://localhost:8000/api/plans/ - Should show empty list or plans
- http://localhost:8000/admin - Django admin panel

### Test 2: Check Frontend
- http://localhost:5173 - Public website
- http://localhost:5173/admin - Admin dashboard (login required)

### Test 3: Create a Plan
1. Go to http://localhost:5173/admin
2. Click "Plans" in sidebar
3. Click "Add Plan" button
4. Fill in:
   - Name: "Monthly"
   - Price: 3000
   - Duration: Monthly
   - Features: "Full Gym Access\nAll Group Classes\nLocker Service"
5. Click "Create"
6. Go to homepage - should see the plan in pricing section!

## Common Issues

### Issue: "Failed to fetch plans"
**Solution:** Make sure Django backend is running on port 8000
```bash
cd Back-end
python manage.py runserver
```

### Issue: CORS errors in browser console
**Solution:** Check that CORS is enabled in `Back-end/sinengym/settings.py`
```python
CORS_ALLOW_ALL_ORIGINS = DEBUG  # Should be True in development
```

### Issue: "Table doesn't exist"
**Solution:** Run migrations
```bash
cd Back-end
python manage.py migrate
```

### Issue: Can't login to admin
**Solution:** Create a superuser
```bash
cd Back-end
python manage.py createsuperuser
```

## Daily Development

### Start Backend
```bash
cd Back-end
python manage.py runserver
```

### Start Frontend
```bash
cd Front-end
npm run dev
```

## API Endpoints

- `GET /api/plans/` - List all plans
- `POST /api/plans/` - Create new plan
- `GET /api/plans/{id}/` - Get specific plan
- `PATCH /api/plans/{id}/` - Update plan
- `DELETE /api/plans/{id}/` - Delete plan
- `POST /api/leads/` - Create new lead (from registration form)

## Admin Dashboard Features

- **Dashboard** - Overview stats
- **Members** - Manage gym members
- **Leads** - View people who booked visits
- **Payments** - Track payments
- **Plans** - Manage pricing plans (connected to homepage!)
- **Team** - Manage team members

## Need Help?

Check the browser console (F12) for error messages. Most issues are:
1. Backend not running
2. Wrong API URL in .env
3. Database not migrated
4. CORS not configured
