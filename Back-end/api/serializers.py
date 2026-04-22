from rest_framework import serializers
from .models import (Member, Lead, Payment, Plan, TeamMember, Announcement, Settings, 
                     TelegramReminder, DailyPass, Attendance, ShiftType, DailyShiftAssignment, 
                     StaffAttendanceRecord)
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
        fields = ['id', 'name', 'role', 'fitness_group', 'staff_id', 'pin', 'is_active', 'show_on_frontend', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
        extra_kwargs = {
            'pin': {'write_only': True}  # Don't expose PIN in API responses
        }
    
    def create(self, validated_data):
        """Auto-generate simple numeric staff_id if not provided"""
        if not validated_data.get('staff_id'):
            # Generate a simple numeric staff ID (001, 002, 003, etc.)
            last_member = TeamMember.objects.filter(
                staff_id__regex=r'^\d+$'
            ).extra(
                select={'staff_id_int': 'CAST(staff_id AS INTEGER)'}
            ).order_by('-staff_id_int').first()
            
            if last_member and last_member.staff_id:
                try:
                    last_num = int(last_member.staff_id)
                    new_num = last_num + 1
                except (ValueError, TypeError):
                    new_num = 1
            else:
                new_num = 1
            validated_data['staff_id'] = f'{new_num:03d}'  # 001, 002, 003, etc.
        
        return super().create(validated_data)


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


class AttendanceSerializer(serializers.ModelSerializer):
    member_name = serializers.CharField(source='member.name', read_only=True)
    member_phone = serializers.CharField(source='member.phone', read_only=True)
    member_status = serializers.CharField(source='member.status', read_only=True)
    is_checked_in = serializers.BooleanField(read_only=True)
    duration_minutes = serializers.IntegerField(read_only=True)

    class Meta:
        model = Attendance
        fields = ['id', 'member', 'member_name', 'member_phone', 'member_status',
                  'check_in', 'check_out', 'is_checked_in', 'duration_minutes']
        read_only_fields = ['id', 'check_in', 'check_out', 'is_checked_in', 'duration_minutes']


# Staff Attendance Serializers

class ShiftTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShiftType
        fields = ['id', 'name', 'start_time', 'end_time', 'grace_period_minutes', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class DailyShiftAssignmentSerializer(serializers.ModelSerializer):
    staff_name = serializers.CharField(source='staff.name', read_only=True)
    shift_type_name = serializers.CharField(source='shift_type.name', read_only=True)
    shift_start_time = serializers.TimeField(source='shift_type.start_time', read_only=True)
    shift_end_time = serializers.TimeField(source='shift_type.end_time', read_only=True)

    class Meta:
        model = DailyShiftAssignment
        fields = ['id', 'staff', 'staff_name', 'assignment_date', 'shift_type', 'shift_type_name', 
                  'shift_start_time', 'shift_end_time', 'assigned_by', 'assigned_at', 'override_reason']
        read_only_fields = ['id', 'assigned_at', 'staff_name', 'shift_type_name', 'shift_start_time', 'shift_end_time']


class StaffAttendanceRecordSerializer(serializers.ModelSerializer):
    staff_name = serializers.CharField(source='staff.name', read_only=True)
    staff_role = serializers.CharField(source='staff.role', read_only=True)
    shift_type_name = serializers.CharField(source='assigned_shift_type.name', read_only=True)
    shift_start_time = serializers.TimeField(source='assigned_shift_type.start_time', read_only=True)
    shift_end_time = serializers.TimeField(source='assigned_shift_type.end_time', read_only=True)
    duration_minutes = serializers.IntegerField(read_only=True)

    class Meta:
        model = StaffAttendanceRecord
        fields = ['id', 'staff', 'staff_name', 'staff_role', 'attendance_date', 'assigned_shift_type', 
                  'shift_type_name', 'shift_start_time', 'shift_end_time', 'check_in_time', 'check_out_time', 
                  'status', 'notes', 'created_by', 'updated_by', 'created_at', 'updated_at', 'duration_minutes']
        read_only_fields = ['id', 'created_at', 'updated_at', 'staff_name', 'staff_role', 'shift_type_name', 
                           'shift_start_time', 'shift_end_time', 'duration_minutes']