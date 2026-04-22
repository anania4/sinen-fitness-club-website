from django.core.management.base import BaseCommand
from api.models import TeamMember

class Command(BaseCommand):
    help = 'Create test staff members with PINs for kiosk testing'

    def handle(self, *args, **options):
        # Create test staff members
        test_staff = [
            {
                'name': 'Abreham Shiferaw',
                'role': 'Head Trainer',
                'fitness_group': 'Strength & Conditioning',
                'pin': '1234',
                'is_active': True,
                'show_on_frontend': True
            },
            {
                'name': 'Adane Bacha',
                'role': 'Aerobics Instructor',
                'fitness_group': 'Cardio & Group Classes',
                'pin': '5678',
                'is_active': True,
                'show_on_frontend': True
            },
            {
                'name': 'Alemu Abera',
                'role': 'Security Guard',
                'fitness_group': 'Security',
                'pin': '9999',
                'is_active': True,
                'show_on_frontend': False
            }
        ]

        for staff_data in test_staff:
            staff, created = TeamMember.objects.get_or_create(
                name=staff_data['name'],
                defaults=staff_data
            )
            
            if created:
                self.stdout.write(
                    self.style.SUCCESS(
                        f'Created staff: {staff.name} (ID: {staff.staff_id}, PIN: {staff.pin})'
                    )
                )
            else:
                self.stdout.write(
                    self.style.WARNING(
                        f'Staff already exists: {staff.name} (ID: {staff.staff_id})'
                    )
                )

        self.stdout.write(
            self.style.SUCCESS('Test staff creation completed!')
        )