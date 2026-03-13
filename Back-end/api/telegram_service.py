import asyncio
from datetime import datetime, timedelta
from telegram import Bot
from telegram.error import TelegramError
from django.utils import timezone
from .models import Member, Settings, TelegramReminder


class TelegramService:
    def __init__(self):
        self.settings = Settings.get_settings()
        self.bot = None
        if self.settings.telegram_bot_token:
            self.bot = Bot(token=self.settings.telegram_bot_token)

    def _get_reminder_message(self, member, reminder_type, gym_phone=None):
        """Generate reminder message based on type"""
        messages = {
            'd_minus_3': f"Hi {member.name}, your membership expires in 3 days. Renew to continue access.",
            'd_minus_1': f"Hi {member.name}, your membership expires tomorrow. Renew now!",
            'd_day': f"Hi {member.name}, your membership expires today. Don't lose access!",
            'd_plus_1': f"Hi {member.name}, your membership has expired. Renew to reactivate your membership.",
            'd_plus_2': f"Hi {member.name}, your membership expired 2 days ago. Renew to reactivate your membership.",
            'd_plus_3': f"Hi {member.name}, your membership expired 3 days ago. Renew to reactivate your membership.",
        }
        
        message = messages.get(reminder_type, "")
        
        if gym_phone:
            message += f"\n\n📞 Contact us: {gym_phone}"
        
        message += f"\n\n💳 Plan: {member.plan}\n📅 Expiry: {member.expiry_date.strftime('%d %b %Y')}"
        
        return message

    async def send_message_async(self, chat_id, message):
        """Send message asynchronously"""
        if not self.bot:
            raise ValueError("Telegram bot not configured")
        
        try:
            await self.bot.send_message(chat_id=chat_id, text=message)
            return True, None
        except TelegramError as e:
            return False, str(e)

    def send_message(self, chat_id, message):
        """Send message synchronously"""
        try:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            success, error = loop.run_until_complete(self.send_message_async(chat_id, message))
            loop.close()
            return success, error
        except Exception as e:
            return False, str(e)

    def send_reminder(self, member, reminder_type):
        """Send reminder to member and log it"""
        if not self.settings.telegram_chat_id:
            return False, "Chat ID not configured"
        
        message = self._get_reminder_message(member, reminder_type, self.settings.gym_phone)
        success, error = self.send_message(self.settings.telegram_chat_id, message)
        
        # Log the reminder
        TelegramReminder.objects.update_or_create(
            member=member,
            reminder_type=reminder_type,
            defaults={
                'message': message,
                'success': success,
                'error_message': error
            }
        )
        
        return success, error

    def check_and_send_reminders(self):
        """Check all members and send appropriate reminders"""
        if not self.settings.auto_reminders_enabled:
            return {'status': 'disabled', 'sent': 0}
        
        today = timezone.now().date()
        sent_count = 0
        errors = []
        
        # Get all active members
        members = Member.objects.filter(status='active')
        
        for member in members:
            days_until_expiry = (member.expiry_date - today).days
            reminder_type = None
            
            # Determine which reminder to send
            if days_until_expiry == 3:
                reminder_type = 'd_minus_3'
            elif days_until_expiry == 1:
                reminder_type = 'd_minus_1'
            elif days_until_expiry == 0:
                reminder_type = 'd_day'
            elif days_until_expiry == -1:
                reminder_type = 'd_plus_1'
            elif days_until_expiry == -2:
                reminder_type = 'd_plus_2'
            elif days_until_expiry == -3:
                reminder_type = 'd_plus_3'
            
            if reminder_type:
                # Check if reminder already sent today
                already_sent = TelegramReminder.objects.filter(
                    member=member,
                    reminder_type=reminder_type,
                    sent_at__date=today
                ).exists()
                
                if not already_sent:
                    success, error = self.send_reminder(member, reminder_type)
                    if success:
                        sent_count += 1
                    else:
                        errors.append(f"{member.name}: {error}")
        
        return {
            'status': 'success',
            'sent': sent_count,
            'errors': errors
        }

    def send_test_message(self, message):
        """Send a test message"""
        if not self.settings.telegram_chat_id:
            return False, "Chat ID not configured"
        
        return self.send_message(self.settings.telegram_chat_id, message)

    def send_announcement(self, announcement):
        """Send announcement to Telegram"""
        if not self.settings.telegram_chat_id:
            return False, "Chat ID not configured"
        
        message = f"📢 {announcement.title}\n\n{announcement.message}"
        return self.send_message(self.settings.telegram_chat_id, message)
