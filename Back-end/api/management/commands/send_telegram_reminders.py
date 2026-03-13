from django.core.management.base import BaseCommand
from api.telegram_service import TelegramService


class Command(BaseCommand):
    help = 'Send Telegram reminders to members with expiring memberships'

    def handle(self, *args, **options):
        self.stdout.write('Checking for members needing reminders...')
        
        telegram_service = TelegramService()
        result = telegram_service.check_and_send_reminders()
        
        if result['status'] == 'disabled':
            self.stdout.write(self.style.WARNING('Auto reminders are disabled'))
        elif result['status'] == 'success':
            self.stdout.write(
                self.style.SUCCESS(f'Successfully sent {result["sent"]} reminders')
            )
            
            if result['errors']:
                self.stdout.write(self.style.ERROR('Errors:'))
                for error in result['errors']:
                    self.stdout.write(self.style.ERROR(f'  - {error}'))
        else:
            self.stdout.write(self.style.ERROR('Failed to send reminders'))
