#!/usr/bin/env python
import os
import sys
import django

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sinengym.settings')
django.setup()

from api.models import ShiftType
from datetime import time

def create_default_shifts():
    # Create Morning Shift
    morning_shift, created = ShiftType.objects.get_or_create(
        name='Morning Shift',
        defaults={
            'start_time': time(6, 0),  # 06:00
            'end_time': time(14, 0),   # 14:00
            'grace_period_minutes': 15,
            'is_active': True
        }
    )
    if created:
        print("Created Morning Shift (06:00 - 14:00)")
    else:
        print("Morning Shift already exists")

    # Create Evening Shift
    evening_shift, created = ShiftType.objects.get_or_create(
        name='Evening Shift',
        defaults={
            'start_time': time(14, 0),  # 14:00
            'end_time': time(22, 0),    # 22:00
            'grace_period_minutes': 15,
            'is_active': True
        }
    )
    if created:
        print("Created Evening Shift (14:00 - 22:00)")
    else:
        print("Evening Shift already exists")

    print("Default shifts setup complete!")

if __name__ == '__main__':
    create_default_shifts()