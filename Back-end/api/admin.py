from django.contrib import admin
from .models import Member, Lead, Payment, Plan, TeamMember, Announcement, Settings, TelegramReminder


@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):
    list_display = ['name', 'phone', 'plan', 'start_date', 'expiry_date', 'payment_status', 'status', 'created_at']
    list_filter = ['status', 'payment_status', 'plan']
    search_fields = ['name', 'phone', 'plan']


@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = ['name', 'phone', 'goal', 'status', 'created_at']
    list_filter = ['status']
    search_fields = ['name', 'phone']


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['member_name', 'amount', 'date', 'method', 'created_at']
    list_filter = ['method', 'date']
    search_fields = ['member_name']


@admin.register(Plan)
class PlanAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'duration', 'created_at']
    list_filter = ['duration']
    search_fields = ['name']


@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ['name', 'role', 'fitness_group', 'created_at']
    list_filter = ['role']
    search_fields = ['name', 'role', 'fitness_group']


@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    list_display = ['title', 'is_active', 'created_at']
    list_filter = ['is_active']
    search_fields = ['title', 'message']


@admin.register(Settings)
class SettingsAdmin(admin.ModelAdmin):
    list_display = ['gym_name', 'gym_phone', 'auto_reminders_enabled', 'reminder_days', 'updated_at']
    
    def has_add_permission(self, request):
        # Only allow one settings instance
        return not Settings.objects.exists()
    
    def has_delete_permission(self, request, obj=None):
        # Don't allow deleting settings
        return False


@admin.register(TelegramReminder)
class TelegramReminderAdmin(admin.ModelAdmin):
    list_display = ['member', 'reminder_type', 'sent_at', 'success']
    list_filter = ['reminder_type', 'success', 'sent_at']
    search_fields = ['member__name', 'message']
    readonly_fields = ['member', 'reminder_type', 'sent_at', 'message', 'success', 'error_message']
    
    def has_add_permission(self, request):
        # Reminders are created automatically
        return False

