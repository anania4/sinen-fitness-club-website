from django.contrib import admin
from .models import Member, Lead, Payment, Plan, TeamMember


@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):
    list_display = ['name', 'plan', 'expiry_date', 'status', 'created_at']
    list_filter = ['status', 'plan']
    search_fields = ['name', 'plan']


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
