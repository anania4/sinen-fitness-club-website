from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from django.db.models import Count, Sum, Q
from django.utils import timezone
from datetime import timedelta
from .models import Member, Lead, Payment, Plan, TeamMember, Announcement
from .serializers import (
    MemberSerializer, LeadSerializer, PaymentSerializer, 
    PlanSerializer, TeamMemberSerializer, AnnouncementSerializer
)


class MemberViewSet(viewsets.ModelViewSet):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer
    
    def list(self, request, *args, **kwargs):
        """Auto-update all member statuses before listing"""
        self._update_all_member_statuses()
        return super().list(request, *args, **kwargs)
    
    def retrieve(self, request, *args, **kwargs):
        """Auto-update member status before retrieving"""
        instance = self.get_object()
        self._update_member_status(instance)
        return super().retrieve(request, *args, **kwargs)
    
    def _update_all_member_statuses(self):
        """Update status for all members based on current date and payment"""
        today = timezone.now().date()
        
        # Auto-expire members whose expiry date has passed (except frozen/suspended)
        Member.objects.filter(
            expiry_date__lt=today
        ).exclude(status__in=['frozen', 'suspended']).update(status='expired')
        
        # Auto-activate members with paid status and valid expiry
        Member.objects.filter(
            expiry_date__gte=today,
            payment_status='paid'
        ).exclude(status__in=['frozen', 'suspended']).update(status='active')
        
        # Auto-suspend members with overdue payment
        Member.objects.filter(
            payment_status='overdue'
        ).exclude(status__in=['frozen', 'suspended']).update(status='suspended')
    
    def _update_member_status(self, member):
        """Update status for a single member"""
        if member.status in ['frozen', 'suspended']:
            return  # Don't auto-update manual statuses
        
        today = timezone.now().date()
        
        if member.expiry_date < today:
            member.status = 'expired'
        elif member.payment_status == 'overdue':
            member.status = 'suspended'
        elif member.payment_status == 'paid':
            member.status = 'active'
        else:
            member.status = 'active'
        
        member.save()


class LeadViewSet(viewsets.ModelViewSet):
    queryset = Lead.objects.all()
    serializer_class = LeadSerializer

    @action(detail=True, methods=['patch'])
    def status(self, request, pk=None):
        lead = self.get_object()
        new_status = request.data.get('status')
        if new_status in dict(Lead.STATUS_CHOICES):
            lead.status = new_status
            lead.save()
            return Response(LeadSerializer(lead).data)
        return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)


class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer


class PlanViewSet(viewsets.ModelViewSet):
    queryset = Plan.objects.all()
    serializer_class = PlanSerializer


class TeamMemberViewSet(viewsets.ModelViewSet):
    queryset = TeamMember.objects.all()
    serializer_class = TeamMemberSerializer


class AnnouncementViewSet(viewsets.ModelViewSet):
    queryset = Announcement.objects.all()
    serializer_class = AnnouncementSerializer


@api_view(['GET'])
def dashboard_stats(request):
    """Update all member statuses before calculating stats"""
    today = timezone.now().date()
    
    # Auto-update statuses
    Member.objects.filter(expiry_date__lt=today).exclude(
        status__in=['frozen', 'suspended']
    ).update(status='expired')
    
    Member.objects.filter(
        expiry_date__gte=today,
        payment_status='paid'
    ).exclude(status__in=['frozen', 'suspended']).update(status='active')
    
    total_members = Member.objects.count()
    active_members = Member.objects.filter(status='active').count()
    
    # Count both expired and expiring soon (within 14 days)
    expired_count = Member.objects.filter(expiry_date__lt=today).exclude(
        status__in=['frozen', 'suspended']
    ).count()
    
    expiring_soon_count = Member.objects.filter(
        expiry_date__gte=today,
        expiry_date__lte=today + timedelta(days=14)
    ).exclude(status__in=['frozen', 'suspended']).count()
    
    expiring_soon = expired_count + expiring_soon_count
    
    new_leads = Lead.objects.filter(status='pending').count()
    
    return Response({
        'totalMembers': total_members,
        'activeMembers': active_members,
        'expiringSoon': expiring_soon,
        'newLeads': new_leads
    })


@api_view(['GET'])
def expiring_members(request):
    """
    Return members sorted by urgency:
    1. Expired members (past expiry date)
    2. Expiring soon (within 14 days)
    3. Sorted by days remaining (worst first)
    """
    today = timezone.now().date()
    
    # Get expired members
    expired = Member.objects.filter(expiry_date__lt=today).exclude(status__in=['frozen', 'suspended'])
    
    # Get expiring soon (next 14 days)
    expiring_soon = Member.objects.filter(
        expiry_date__gte=today,
        expiry_date__lte=today + timedelta(days=14)
    ).exclude(status__in=['frozen', 'suspended'])
    
    # Combine and sort by expiry date (earliest first = most urgent)
    all_members = list(expired) + list(expiring_soon)
    all_members.sort(key=lambda m: m.expiry_date)
    
    serializer = MemberSerializer(all_members, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def dashboard_leads(request):
    leads = Lead.objects.filter(status='pending')[:5]
    serializer = LeadSerializer(leads, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def recent_payments(request):
    payments = Payment.objects.all()[:5]
    serializer = PaymentSerializer(payments, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def revenue_chart(request):
    # Get revenue data for last 6 months
    today = timezone.now().date()
    months = []
    
    for i in range(5, -1, -1):
        month_date = today - timedelta(days=30 * i)
        month_name = month_date.strftime('%b')
        
        # Calculate revenue for this month
        start_date = month_date.replace(day=1)
        if month_date.month == 12:
            end_date = start_date.replace(year=start_date.year + 1, month=1, day=1)
        else:
            end_date = start_date.replace(month=start_date.month + 1, day=1)
        
        revenue = Payment.objects.filter(
            date__gte=start_date,
            date__lt=end_date
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        months.append({
            'month': month_name,
            'amount': float(revenue)
        })
    
    return Response(months)


# Telegram Integration Views
from .models import Settings, TelegramReminder
from .serializers import SettingsSerializer, TelegramReminderSerializer
from .telegram_service import TelegramService


class SettingsViewSet(viewsets.ModelViewSet):
    queryset = Settings.objects.all()
    serializer_class = SettingsSerializer
    
    def list(self, request, *args, **kwargs):
        """Always return the single settings instance"""
        settings = Settings.get_settings()
        serializer = self.get_serializer(settings)
        return Response(serializer.data)
    
    def create(self, request, *args, **kwargs):
        """Update existing settings instead of creating new"""
        settings = Settings.get_settings()
        serializer = self.get_serializer(settings, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    
    def update(self, request, *args, **kwargs):
        """Update settings"""
        settings = Settings.get_settings()
        serializer = self.get_serializer(settings, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class TelegramReminderViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TelegramReminder.objects.all()
    serializer_class = TelegramReminderSerializer
    
    def get_queryset(self):
        """Filter by member if provided"""
        queryset = TelegramReminder.objects.all()
        member_id = self.request.query_params.get('member_id', None)
        if member_id:
            queryset = queryset.filter(member_id=member_id)
        return queryset


@api_view(['POST'])
def send_test_telegram(request):
    """Send a test message to Telegram"""
    message = request.data.get('message', '')
    
    if not message:
        return Response(
            {'error': 'Message is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    telegram_service = TelegramService()
    success, error = telegram_service.send_test_message(message)
    
    if success:
        return Response({'success': True, 'message': 'Test message sent successfully'})
    else:
        return Response(
            {'success': False, 'error': error},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['POST'])
def send_telegram_reminders(request):
    """Manually trigger sending reminders to all eligible members"""
    telegram_service = TelegramService()
    result = telegram_service.check_and_send_reminders()
    
    return Response(result)


@api_view(['POST'])
def send_announcement_telegram(request):
    """Send an announcement to Telegram"""
    announcement_id = request.data.get('announcement_id')
    
    if not announcement_id:
        return Response(
            {'error': 'Announcement ID is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        announcement = Announcement.objects.get(id=announcement_id)
    except Announcement.DoesNotExist:
        return Response(
            {'error': 'Announcement not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    telegram_service = TelegramService()
    success, error = telegram_service.send_announcement(announcement)
    
    if success:
        return Response({'success': True, 'message': 'Announcement sent to Telegram'})
    else:
        return Response(
            {'success': False, 'error': error},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['GET'])
def telegram_stats(request):
    """Get Telegram reminder statistics"""
    today = timezone.now().date()
    
    # Count reminders sent today
    sent_today = TelegramReminder.objects.filter(sent_at__date=today).count()
    successful_today = TelegramReminder.objects.filter(sent_at__date=today, success=True).count()
    failed_today = TelegramReminder.objects.filter(sent_at__date=today, success=False).count()
    
    # Count total reminders
    total_sent = TelegramReminder.objects.count()
    total_successful = TelegramReminder.objects.filter(success=True).count()
    
    # Get settings
    settings = Settings.get_settings()
    
    return Response({
        'configured': bool(settings.telegram_bot_token and settings.telegram_chat_id),
        'auto_reminders_enabled': settings.auto_reminders_enabled,
        'sent_today': sent_today,
        'successful_today': successful_today,
        'failed_today': failed_today,
        'total_sent': total_sent,
        'total_successful': total_successful,
        'success_rate': round((total_successful / total_sent * 100) if total_sent > 0 else 0, 1)
    })
