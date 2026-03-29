from rest_framework import serializers
from .models import Member, Lead, Payment, Plan, TeamMember, Announcement, Settings, TelegramReminder, DailyPass
from django.utils import timezone


class MemberSerializer(serializers.ModelSerializer):
    days_until_expiry = serializers.SerializerMethodField()
    
    class Meta:
        model = Member
        fields = ['id', 'name', 'phone', 'emergency_contact', 'plan', 'start_date', 'expiry_date', 
                  'payment_status', 'status', 'profile_photo', 'created_at', 'updated_at', 'days_until_expiry']
        read_only_fields = ['id', 'created_at', 'updated_at', 'days_until_expiry']
    
    def get_days_until_expiry(self, obj):
        """Calculate days until expiry"""
        today = timezone.now().date()
        delta = obj.expiry_date - today
        return delta.days
    
    def create(self, validated_data):
        """Auto-set status based on payment and expiry date when creating"""
        member = Member(**validated_data)
        member.status = self._calculate_status(member)
        member.save()
        return member
    
    def update(self, instance, validated_data):
        """Auto-update status based on payment and expiry date when updating"""
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        # Only auto-update status if not frozen or suspended (manual statuses)
        if instance.status not in ['frozen', 'suspended']:
            instance.status = self._calculate_status(instance)
        
        instance.save()
        return instance
    
    def _calculate_status(self, member):
        """Calculate member status based on expiry date and payment status"""
        today = timezone.now().date()
        
        # If expiry date has passed, mark as expired
        if member.expiry_date < today:
            return 'expired'
        
        # If payment is overdue, mark as suspended
        if member.payment_status == 'overdue':
            return 'suspended'
        
        # If payment is paid and expiry is in future, mark as active
        if member.payment_status == 'paid':
            return 'active'
        
        # Default to active if payment is pending but not overdue
        return 'active'


class LeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lead
        fields = ['id', 'name', 'phone', 'goal', 'preferred_time', 'status', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'member_name', 'amount', 'date', 'method', 'created_at']
        read_only_fields = ['id', 'created_at']


class PlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plan
        fields = ['id', 'name', 'price', 'duration', 'features', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class TeamMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMember
        fields = ['id', 'name', 'role', 'fitness_group', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class AnnouncementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Announcement
        fields = ['id', 'title', 'message', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']



class SettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Settings
        fields = ['id', 'telegram_bot_token', 'telegram_chat_id', 'reminder_days',
                  'auto_reminders_enabled', 'gym_phone', 'gym_name', 'updated_at']
        read_only_fields = ['id', 'updated_at']


class TelegramReminderSerializer(serializers.ModelSerializer):
    member_name = serializers.CharField(source='member.name', read_only=True)

    class Meta:
        model = TelegramReminder
        fields = ['id', 'member', 'member_name', 'reminder_type', 'sent_at',
                  'message', 'success', 'error_message']
        read_only_fields = ['id', 'sent_at']



class SettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Settings
        fields = ['id', 'telegram_bot_token', 'telegram_chat_id', 'reminder_days', 
                  'auto_reminders_enabled', 'gym_phone', 'gym_name', 'updated_at']
        read_only_fields = ['id', 'updated_at']


class TelegramReminderSerializer(serializers.ModelSerializer):
    member_name = serializers.CharField(source='member.name', read_only=True)
    
    class Meta:
        model = TelegramReminder
        fields = ['id', 'member', 'member_name', 'reminder_type', 'sent_at', 
                  'message', 'success', 'error_message']
        read_only_fields = ['id', 'sent_at']


class DailyPassSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyPass
        fields = ['id', 'name', 'phone', 'date', 'amount', 'payment_method', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
