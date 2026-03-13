# Telegram Integration - Quick Setup

## 🚀 5-Minute Setup

### Step 1: Install Dependencies (1 min)
```bash
cd Back-end
pip install python-telegram-bot==20.7 APScheduler==3.10.4
```

### Step 2: Run Migrations (1 min)
```bash
python manage.py makemigrations
python manage.py migrate
```

### Step 3: Create Telegram Bot (2 min)
1. Open Telegram, search `@BotFather`
2. Send: `/newbot`
3. Name your bot: `Sinen Gym Bot`
4. Username: `sinen_gym_bot` (must end with 'bot')
5. **Copy the token** (looks like: `123456789:ABCdef...`)

### Step 4: Get Chat ID (1 min)

**Method 1: Using a Group (Recommended)**
1. Create a new Telegram group
2. Add your bot to the group
3. Send any message in the group
4. Visit: `https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates`
5. Find `"chat":{"id":-1001234567890}`
6. Copy the ID (with minus sign)

**Method 2: Personal Chat**
1. Search `@userinfobot` on Telegram
2. Start chat
3. Copy your user ID

### Step 5: Configure in App (30 sec)
1. Start your Django server: `python manage.py runserver`
2. Start your frontend: `cd Front-end && npm run dev`
3. Go to **Settings** page
4. Fill in:
   - Bot Token: `paste your token`
   - Chat ID: `paste your chat ID`
   - Gym Phone: `+251912345678` (optional)
5. Click **Save Settings**

### Step 6: Test It! (30 sec)
1. Go to **Telegram** page
2. Type: `Hello from Sinen Gym! 🏋️`
3. Click **Send Test**
4. Check your Telegram group/chat

## ✅ You're Done!

Reminders will now be sent automatically based on member expiry dates.

## 📅 Reminder Schedule

- **D-3**: "Hi [Name], your membership expires in 3 days..."
- **D-1**: "Hi [Name], your membership expires tomorrow..."
- **D-day**: "Hi [Name], your membership expires today..."
- **D+1, D+2, D+3**: "Hi [Name], your membership has expired..."

## 🔄 Manual Reminder Trigger

```bash
python manage.py send_telegram_reminders
```

## 🤖 Automated Daily Reminders

**Linux/Mac:**
```bash
crontab -e
# Add this line:
0 9 * * * cd /path/to/Back-end && python manage.py send_telegram_reminders
```

**Windows:**
Use Task Scheduler to run the command daily at 9 AM.

## 🆘 Troubleshooting

### Bot not sending?
- ✓ Check token is correct
- ✓ Verify chat ID (with minus sign for groups)
- ✓ Ensure bot is in the group
- ✓ Bot needs admin rights for channels

### Still not working?
1. Check Settings page shows "Configured"
2. Try sending a test message first
3. Check browser console for errors
4. Verify backend is running

## 📖 Full Documentation

See [TELEGRAM_INTEGRATION.md](TELEGRAM_INTEGRATION.md) for complete guide.

## 🎉 Features

- ✅ Automatic reminders at D-3, D-1, D-day, D+1, D+2, D+3
- ✅ Test message sending
- ✅ Manual reminder triggering
- ✅ Statistics dashboard
- ✅ Reminder history tracking
- ✅ Success/failure logging

Enjoy your automated gym reminders! 💪
