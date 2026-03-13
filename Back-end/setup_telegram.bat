@echo off
echo 🤖 Setting up Telegram Integration...
echo.

REM Install dependencies
echo 📦 Installing Python dependencies...
pip install python-telegram-bot==20.7 APScheduler==3.10.4

REM Run migrations
echo 🗄️  Running database migrations...
python manage.py makemigrations
python manage.py migrate

REM Create settings instance
echo ⚙️  Creating settings instance...
python manage.py shell < setup_settings.py

echo.
echo ✅ Telegram integration setup complete!
echo.
echo Next steps:
echo 1. Create a Telegram bot using @BotFather
echo 2. Get your chat ID
echo 3. Configure in Settings page
echo 4. Test in Telegram page
echo.
echo 📖 See TELEGRAM_INTEGRATION.md for detailed instructions
pause
