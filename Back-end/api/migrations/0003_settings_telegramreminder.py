# Generated migration for Telegram integration

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_announcement'),
    ]

    operations = [
        migrations.CreateModel(
            name='Settings',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('telegram_bot_token', models.CharField(blank=True, max_length=255, null=True)),
                ('telegram_chat_id', models.CharField(blank=True, max_length=255, null=True)),
                ('reminder_days', models.IntegerField(default=7)),
                ('auto_reminders_enabled', models.BooleanField(default=True)),
                ('gym_phone', models.CharField(blank=True, max_length=20, null=True)),
                ('gym_name', models.CharField(default='Sinen Gym', max_length=255)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name_plural': 'Settings',
            },
        ),
        migrations.CreateModel(
            name='TelegramReminder',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('reminder_type', models.CharField(choices=[('d_minus_3', 'D-3 days'), ('d_minus_1', 'D-1 day'), ('d_day', 'D-day'), ('d_plus_1', 'D+1 day'), ('d_plus_2', 'D+2 days'), ('d_plus_3', 'D+3 days')], max_length=20)),
                ('sent_at', models.DateTimeField(auto_now_add=True)),
                ('message', models.TextField()),
                ('success', models.BooleanField(default=False)),
                ('error_message', models.TextField(blank=True, null=True)),
                ('member', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='telegram_reminders', to='api.member')),
            ],
            options={
                'ordering': ['-sent_at'],
                'unique_together': {('member', 'reminder_type')},
            },
        ),
    ]
