# Sinen Fitness Club - Django REST API

## Setup Instructions

1. Install dependencies:
```bash
cd Back-end
pip install -r requirements.txt
```

2. Run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

3. Create a superuser (optional):
```bash
python manage.py createsuperuser
```

4. Run the development server:
```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000/api/`

## API Endpoints

### Members
- `GET /api/members/` - List all members
- `POST /api/members/` - Create new member
- `GET /api/members/{id}/` - Get member details
- `PATCH /api/members/{id}/` - Update member
- `DELETE /api/members/{id}/` - Delete member

### Leads
- `GET /api/leads/` - List all leads
- `POST /api/leads/` - Create new lead
- `GET /api/leads/{id}/` - Get lead details
- `PATCH /api/leads/{id}/` - Update lead
- `PATCH /api/leads/{id}/status` - Update lead status
- `DELETE /api/leads/{id}/` - Delete lead

### Payments
- `GET /api/payments/` - List all payments
- `POST /api/payments/` - Record new payment
- `GET /api/payments/{id}/` - Get payment details
- `DELETE /api/payments/{id}/` - Delete payment

### Plans
- `GET /api/plans/` - List all plans
- `POST /api/plans/` - Create new plan
- `GET /api/plans/{id}/` - Get plan details
- `PATCH /api/plans/{id}/` - Update plan
- `DELETE /api/plans/{id}/` - Delete plan

### Team
- `GET /api/team/` - List all team members
- `POST /api/team/` - Add team member
- `GET /api/team/{id}/` - Get team member details
- `PATCH /api/team/{id}/` - Update team member
- `DELETE /api/team/{id}/` - Remove team member

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/expiring-members` - Get members expiring in 14 days
- `GET /api/dashboard/leads` - Get recent pending leads
- `GET /api/dashboard/payments` - Get recent payments
- `GET /api/dashboard/revenue` - Get revenue chart data (last 6 months)

## Admin Panel

Access the Django admin panel at `http://localhost:8000/admin/` after creating a superuser.
