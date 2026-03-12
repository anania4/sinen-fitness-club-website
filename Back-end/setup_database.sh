#!/bin/bash

echo "Setting up Sinen Fitness Club Database..."

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py migrate

# Create superuser (if needed)
echo ""
echo "Create a superuser for Django admin:"
python manage.py createsuperuser

# Create default plans
echo ""
echo "Creating default pricing plans..."
python manage.py create_default_plans

echo ""
echo "Setup complete! You can now:"
echo "1. Run: python manage.py runserver"
echo "2. Visit: http://localhost:8000/admin"
echo "3. Login with your superuser credentials"
