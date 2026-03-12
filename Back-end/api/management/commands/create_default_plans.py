from django.core.management.base import BaseCommand
from api.models import Plan


class Command(BaseCommand):
    help = 'Creates default pricing plans for Sinen Fitness Club'

    def handle(self, *args, **kwargs):
        plans_data = [
            {
                'name': 'Monthly',
                'price': 3000,
                'duration': 'Monthly',
                'features': 'Full Gym Access\nAll Group Classes\nLocker Service\nProgress Tracking'
            },
            {
                'name': '3 Months',
                'price': 8000,
                'duration': 'Quarterly',
                'features': 'Full Gym Access\nAll Group Classes\nLocker Service\nProgress Tracking\nNutrition Consultation'
            },
            {
                'name': '6 Months',
                'price': 15000,
                'duration': 'Annual',
                'features': 'Full Gym Access\nAll Group Classes\nLocker Service\nProgress Tracking\nNutrition Consultation\nPersonal Training Sessions'
            }
        ]

        for plan_data in plans_data:
            plan, created = Plan.objects.get_or_create(
                name=plan_data['name'],
                defaults=plan_data
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created plan: {plan.name}'))
            else:
                self.stdout.write(self.style.WARNING(f'Plan already exists: {plan.name}'))

        self.stdout.write(self.style.SUCCESS('Default plans setup complete!'))
