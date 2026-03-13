# Telegram Integration - Quick Reference Card

## 🚀 Quick Commands

```bash
# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Send reminders manually
python manage.py send_telegram_reminders

# Start Django server
python manage.py runserver

# Start frontend
cd Front-end && npm run dev
```

## 📋 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/settings/` | Get settings |
| PATCH | `/api/settings/1/` | Update settings |
| POST | `/api/telegram/test` | Send test message |
| POST | `/api/telegram/send-reminders` | Trigger reminders |
| GET | `/api/telegram/stats` | Get statistics |
| GET | `/api/telegram-reminders/` | Reminder history |

## 🤖 Bot Setup Steps

1. **Create Bot**: Message `@BotFather` → `/newbot`
2. **Get Token**: Copy from BotFather
3. **Create Group**: Add bot to group
4. **Get Chat ID**: Visit `https://api.telegram.org/bot<TOKEN>/getUpdates`
5. **Configure**: Paste in Settings page
6. **Test**: Send test message

## 📅 Reminder Schedule

| Timing | Message |
|--------|---------|
| D-3 | "Expires in 3 days" |
| D-1 | "Expires tomorrow" |
| D-day | "Expires today" |
| D+1 | "Expired 1 day ago" |
| D+2 | "Expired 2 days ago" |
| D+3 | "Expired 3 days ago" |

## 🗄️ Database Models

### Settings
```python
telegram_bot_token    # Bot token from BotFather
telegram_chat_id      # Target chat/group ID
reminder_days         # Days before expiry (default: 7)
auto_reminders_enabled # Enable/disable auto reminders
gym_phone            # Contact phone
gym_name             # Gym name
```

### TelegramReminder
```python
member               # Foreign key to Member
reminder_type        # d_minus_3, d_minus_1, etc.
sent_at             # Timestamp
message             # Full message text
success             # Boolean
error_message       # Error details if failed
```

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `Back-end/requirements.txt` | Python dependencies |
| `Back-end/api/telegram_service.py` | Core service |
| `Back-end/api/models.py` | Database models |
| `Front-end/src/pages/TelegramPage.tsx` | UI page |
| `Front-end/src/pages/SettingsPage.tsx` | Config page |

## 📊 Statistics Tracked

- Reminders sent today
- Successful sends today
- Failed sends today
- Total reminders sent
- Total successful
- Success rate (%)

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Bot not sending | Check token & chat ID |
| Messages not received | Verify bot in group |
| Reminders not automatic | Check cron job |
| Statistics not updating | Refresh page |
| Import errors | Run `pip install -r requirements.txt` |

## 🔐 Security Checklist

- [ ] Keep bot token secret
- [ ] Don't commit tokens to git
- [ ] Use environment variables in production
- [ ] Set up proper CORS
- [ ] Enable HTTPS in production

## 📱 Frontend Pages

| Page | URL | Purpose |
|------|-----|---------|
| Settings | `/settings` | Configure bot |
| Telegram | `/telegram` | Test & monitor |
| Dashboard | `/dashboard` | View stats |

## 🎯 Testing Checklist

- [ ] Install dependencies
- [ ] Run migrations
- [ ] Create bot via BotFather
- [ ] Get chat ID
- [ ] Configure in Settings
- [ ] Send test message
- [ ] Create test member
- [ ] Trigger manual reminder
- [ ] Check Telegram for message
- [ ] Verify statistics
- [ ] Set up cron job

## 📖 Documentation Files

| File | Content |
|------|---------|
| `TELEGRAM_INTEGRATION.md` | Complete guide |
| `TELEGRAM_SETUP_QUICK.md` | 5-minute setup |
| `TELEGRAM_CHECKLIST.md` | Implementation checklist |
| `TELEGRAM_SUMMARY.md` | Implementation summary |
| `TELEGRAM_FLOW.md` | System flow diagrams |
| `TELEGRAM_API_EXAMPLES.md` | API examples |
| `TELEGRAM_QUICK_REFERENCE.md` | This file |

## 🔄 Cron Job Setup

### Linux/Mac
```bash
crontab -e
# Add:
0 9 * * * cd /path/to/Back-end && python manage.py send_telegram_reminders
```

### Windows Task Scheduler
- Program: `python`
- Arguments: `manage.py send_telegram_reminders`
- Start in: `C:\path\to\Back-end`
- Trigger: Daily at 9:00 AM

## 💡 Pro Tips

1. **Test First**: Always send test message before production
2. **Monitor Stats**: Check success rate regularly
3. **Review History**: Check reminder logs for errors
4. **Backup Settings**: Save bot token securely
5. **Use Groups**: Easier to manage than individual chats
6. **Set Reminders**: Multiple reminder points increase renewals
7. **Include Contact**: Add gym phone to messages
8. **Check Logs**: Review Django logs for issues

## 🎨 Message Format

```
Hi [Member Name], your membership expires in [X] days. Renew to continue access.

📞 Contact us: [Gym Phone]

💳 Plan: [Plan Name]
📅 Expiry: [Expiry Date]
```

## 🚦 Status Indicators

| Status | Meaning |
|--------|---------|
| ✅ Configured | Bot ready to send |
| ⚠️ Not Set | Configuration needed |
| 🟢 Success | Message sent |
| 🔴 Failed | Error occurred |

## 📞 Support Resources

- Telegram Bot API: https://core.telegram.org/bots/api
- python-telegram-bot: https://docs.python-telegram-bot.org/
- Django REST: https://www.django-rest-framework.org/

## 🎯 Success Metrics

- Configuration complete: ✅
- Test message sent: ✅
- Reminders sending: ✅
- Success rate > 95%: ✅
- No duplicates: ✅
- Statistics accurate: ✅

---

**Quick Start**: Run `setup_telegram.sh` (Linux/Mac) or `setup_telegram.bat` (Windows)

**Need Help?** Check `TELEGRAM_INTEGRATION.md` for detailed instructions

**Version**: 1.0.0 | **Last Updated**: March 12, 2026
