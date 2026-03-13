# Telegram Integration Guide

## Overview
The Telegram integration automatically sends membership expiry reminders to members via a Telegram bot. Reminders are sent at strategic intervals before and after membership expiration.

## Features
- ✅ Automated reminder schedule (D-3, D-1, D-day, D+1, D+2, D+3)
- ✅ Manual test message sending
- ✅ Manual reminder triggering
- ✅ Reminder history tracking
- ✅ Success/failure logging
- ✅ Configurable settings
- ✅ Statistics dashboard

## Reminder Schedule

| Timing | Message Example |
|--------|----------------|
| **D-3 days** | "Hi [Name], your membership expires in 3 days. Renew to continue access." |
| **D-1 day** | "Hi [Name], your membership expires tomorrow. Renew now!" |
| **D-day** | "Hi [Name], your membership expires today. Don't lose access!" |
| **D+1 day** | "Hi [Name], your membership has expired. Renew to reactivate your membership." |
| **D+2 days** | "Hi [Name], your membership expired 2 days ago. Renew to reactivate your membership." |
| **D+3 days** | "Hi [Name], your membership expired 3 days ago. Renew to reactivate your membership." |

Each message includes:
- Member's name
- Gym contact phone (if configured)
- Member's plan name
- Expiry date

## Setup Instructions

### 1. Create a Telegram Bot

1. Open Telegram and search for `@BotFather`
2. Send `/newbot` command
3. Follow the instructions to name your bot
4. Copy the bot token (looks like: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

### 2. Get Your Chat ID

**Option A: Using a Group**
1. Create a new Telegram group
2. Add your bot to the group
3. Send a message in the group
4. Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
5. Look for `"chat":{"id":-1001234567890}` in the response
6. Copy the chat ID (including the minus sign)

**Option B: Using @userinfobot**
1. Search for `@userinfobot` on Telegram
2. Start a chat with it
3. It will show your user ID
4. Use this as your chat ID

### 3. Configure in the App

1. Go to **Settings** page in the admin dashboard
2. Fill in:
   - **Bot Token**: Paste your bot token
   - **Chat ID**: Paste your chat ID
   - **Gym Phone**: Your gym's contact number (optional)
   - **Reminder Days**: Keep default (7)
   - **Enable Automatic Reminders**: Check this box
3. Click **Save Settings**

### 4. Test the Integration

1. Go to **Telegram** page in the admin dashboard
2. Type a test message
3. Click **Send Test**
4. Check your Telegram group/chat for the message

## Backend Setup

### Install Dependencies

```bash
cd Back-end
pip install -r requirements.txt
```

### Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### Manual Reminder Sending

You can manually trigger reminders using the Django management command:

```bash
python manage.py send_telegram_reminders
```

### Automated Scheduling (Optional)

For production, set up a cron job or task scheduler:

**Linux/Mac (crontab)**
```bash
# Run every day at 9 AM
0 9 * * * cd /path/to/Back-end && python manage.py send_telegram_reminders
```

**Windows (Task Scheduler)**
1. Open Task Scheduler
2. Create Basic Task
3. Set trigger: Daily at 9:00 AM
4. Action: Start a program
5. Program: `python`
6. Arguments: `manage.py send_telegram_reminders`
7. Start in: `C:\path\to\Back-end`

**Using APScheduler (Recommended)**
Add to `Back-end/sinengym/settings.py`:

```python
from apscheduler.schedulers.background import BackgroundScheduler
from django.conf import settings

def start_scheduler():
    scheduler = BackgroundScheduler()
    scheduler.add_job(
        'api.telegram_service.TelegramService.check_and_send_reminders',
        'cron',
        hour=9,
        minute=0
    )
    scheduler.start()
```

## API Endpoints

### Get Settings
```
GET /api/settings/
```

### Update Settings
```
PATCH /api/settings/1/
Content-Type: application/json

{
  "telegram_bot_token": "your-token",
  "telegram_chat_id": "your-chat-id",
  "reminder_days": 7,
  "auto_reminders_enabled": true,
  "gym_phone": "+251912345678",
  "gym_name": "Sinen Gym"
}
```

### Send Test Message
```
POST /api/telegram/test
Content-Type: application/json

{
  "message": "Test message"
}
```

### Send Reminders Manually
```
POST /api/telegram/send-reminders
```

### Get Telegram Stats
```
GET /api/telegram/stats
```

### Get Reminder History
```
GET /api/telegram-reminders/
GET /api/telegram-reminders/?member_id=123
```

## Database Models

### Settings
- `telegram_bot_token`: Bot token from BotFather
- `telegram_chat_id`: Target chat/group ID
- `reminder_days`: Days before expiry to start reminders (default: 7)
- `auto_reminders_enabled`: Enable/disable automatic reminders
- `gym_phone`: Contact phone number
- `gym_name`: Gym name for messages

### TelegramReminder
- `member`: Foreign key to Member
- `reminder_type`: Type of reminder (d_minus_3, d_minus_1, etc.)
- `sent_at`: Timestamp when sent
- `message`: Full message text
- `success`: Whether sending succeeded
- `error_message`: Error details if failed

## Troubleshooting

### Bot not sending messages
1. Check bot token is correct
2. Verify chat ID is correct (including minus sign for groups)
3. Ensure bot is added to the group
4. Check bot has permission to send messages

### Messages not received
1. Check if bot is blocked
2. Verify group privacy settings
3. Ensure bot is an admin (for channels)

### Reminders not automatic
1. Check "Enable Automatic Reminders" is checked
2. Verify cron job or scheduler is running
3. Check Django logs for errors

## Security Notes

- Keep your bot token secret
- Don't commit tokens to version control
- Use environment variables for production
- Regularly rotate bot tokens
- Monitor unauthorized access

## Future Enhancements

- [ ] Support for multiple languages
- [ ] Custom message templates
- [ ] Member-specific chat IDs (direct messages)
- [ ] Payment links in messages
- [ ] Announcement broadcasting
- [ ] Two-way communication (member replies)
- [ ] Rich media support (images, buttons)

## Support

For issues or questions:
1. Check the Telegram page for configuration status
2. Review reminder history in admin panel
3. Check Django logs for errors
4. Test with manual message sending first
