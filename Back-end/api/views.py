from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from django.db.models import Count, Sum, Q
from django.utils import timezone
from django.views.decorators.csrf import ensure_csrf_cookie
from datetime import timedelta
from .models import (Member, Lead, Payment, Plan, TeamMember, Announcement, DailyPass, 
                     Attendance, ShiftType, DailyShiftAssignment, StaffAttendanceRecord)
from .serializers import (
    MemberSerializer, LeadSerializer, PaymentSerializer, 
    PlanSerializer, TeamMemberSerializer, AnnouncementSerializer,
    DailyPassSerializer, AttendanceSerializer, ShiftTypeSerializer,
    DailyShiftAssignmentSerializer, StaffAttendanceRecordSerializer
)


# ─── Auth Views ─────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """Authenticate user with username and password"""
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response(
            {'error': 'Username and password are required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user = authenticate(request, username=username, password=password)
    
    if user is not None:
        if user.is_superuser:
            login(request, user)
            return Response({
                'success': True,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'is_staff': user.is_staff,
                    'is_superuser': user.is_superuser,
                }
            })
        else:
            return Response(
                {'error': 'You do not have superuser access'},
                status=status.HTTP_403_FORBIDDEN
            )
    else:
        return Response(
            {'error': 'Invalid username or password'},
            status=status.HTTP_401_UNAUTHORIZED
        )


@api_view(['POST'])
@permission_classes([AllowAny])
def logout_view(request):
    """Log out the current user"""
    logout(request)
    return Response({'success': True})


@api_view(['GET'])
@ensure_csrf_cookie
@permission_classes([AllowAny])
def check_auth(request):
    """Check if the current user is authenticated"""
    if request.user.is_authenticated and request.user.is_superuser:
        return Response({
            'authenticated': True,
            'user': {
                'id': request.user.id,
                'username': request.user.username,
                'email': request.user.email,
                'is_staff': request.user.is_staff,
                'is_superuser': request.user.is_superuser,
            }
        })
    return Response({'authenticated': False}, status=status.HTTP_401_UNAUTHORIZED)


# ─── ViewSets ───────────────────────────────────────────────


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

    def get_permissions(self):
        """Allow public lead creation (registration form)"""
        if self.action == 'create':
            return [AllowAny()]
        return super().get_permissions()

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

    def get_permissions(self):
        """Allow public plan listing (pricing page)"""
        if self.action == 'list':
            return [AllowAny()]
        return super().get_permissions()


class TeamMemberViewSet(viewsets.ModelViewSet):
    queryset = TeamMember.objects.all()
    serializer_class = TeamMemberSerializer


class AnnouncementViewSet(viewsets.ModelViewSet):
    queryset = Announcement.objects.all()
    serializer_class = AnnouncementSerializer

    def get_permissions(self):
        """Allow public announcement listing (homepage)"""
        if self.action == 'list':
            return [AllowAny()]
        return super().get_permissions()


class DailyPassViewSet(viewsets.ModelViewSet):
    queryset = DailyPass.objects.all()
    serializer_class = DailyPassSerializer


class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        # Filter by date if provided
        date_filter = self.request.query_params.get('date')
        if date_filter:
            qs = qs.filter(check_in__date=date_filter)
        # Filter currently checked-in only
        checked_in = self.request.query_params.get('checked_in')
        if checked_in == 'true':
            qs = qs.filter(check_out__isnull=True)
        return qs

    @action(detail=False, methods=['post'], url_path='check-in')
    def check_in(self, request):
        member_id = request.data.get('member_id')
        if not member_id:
            return Response({'error': 'member_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            member = Member.objects.get(pk=member_id)
        except Member.DoesNotExist:
            return Response({'error': 'Member not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Validate member is active
        if member.status != 'active':
            return Response(
                {'error': f'Member is {member.status}. Only active members can check in.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if already checked in
        active_visit = Attendance.objects.filter(member=member, check_out__isnull=True).first()
        if active_visit:
            return Response(
                {'error': f'{member.name} is already checked in since {active_visit.check_in.strftime("%H:%M")}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        attendance = Attendance.objects.create(member=member)
        return Response(AttendanceSerializer(attendance).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], url_path='check-out')
    def check_out(self, request, pk=None):
        attendance = self.get_object()
        if attendance.check_out is not None:
            return Response({'error': 'Already checked out'}, status=status.HTTP_400_BAD_REQUEST)
        
        attendance.check_out = timezone.now()
        attendance.save()
        return Response(AttendanceSerializer(attendance).data)


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
    daily_passes_today = DailyPass.objects.filter(date=today).count()
    
    currently_in_gym = Attendance.objects.filter(check_out__isnull=True).count()
    
    return Response({
        'totalMembers': total_members,
        'activeMembers': active_members,
        'expiringSoon': expiring_soon,
        'newLeads': new_leads,
        'dailyPassesToday': daily_passes_today,
        'currentlyInGym': currently_in_gym
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
# Staff Attendance Views

class ShiftTypeViewSet(viewsets.ModelViewSet):
    queryset = ShiftType.objects.all()
    serializer_class = ShiftTypeSerializer


class DailyShiftAssignmentViewSet(viewsets.ModelViewSet):
    queryset = DailyShiftAssignment.objects.all()
    serializer_class = DailyShiftAssignmentSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        date_filter = self.request.query_params.get('date')
        if date_filter:
            qs = qs.filter(assignment_date=date_filter)
        return qs


class StaffAttendanceViewSet(viewsets.ModelViewSet):
    queryset = StaffAttendanceRecord.objects.all()
    serializer_class = StaffAttendanceRecordSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        date_filter = self.request.query_params.get('date')
        if date_filter:
            qs = qs.filter(attendance_date=date_filter)
        
        staff_filter = self.request.query_params.get('staff')
        if staff_filter:
            qs = qs.filter(staff=staff_filter)
            
        checked_in = self.request.query_params.get('checked_in')
        if checked_in == 'true':
            qs = qs.filter(check_in_time__isnull=False, check_out_time__isnull=True)
        
        return qs

    @action(detail=False, methods=['post'], url_path='check-in')
    def check_in(self, request):
        staff_id = request.data.get('staff_id')
        shift_type_id = request.data.get('shift_type_id')
        date = request.data.get('date', timezone.now().date())
        
        if not staff_id or not shift_type_id:
            return Response({'error': 'staff_id and shift_type_id are required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            staff = TeamMember.objects.get(pk=staff_id, is_active=True)
            shift_type = ShiftType.objects.get(pk=shift_type_id, is_active=True)
        except (TeamMember.DoesNotExist, ShiftType.DoesNotExist):
            return Response({'error': 'Staff member or shift type not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Check if already checked in for any shift today
        existing_checkin = StaffAttendanceRecord.objects.filter(
            staff=staff, 
            attendance_date=date,
            check_in_time__isnull=False,
            check_out_time__isnull=True
        ).first()
        
        if existing_checkin:
            return Response({
                'error': f'{staff.name} is already checked in for {existing_checkin.assigned_shift_type.name}'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Get or create attendance record
        record, created = StaffAttendanceRecord.objects.get_or_create(
            staff=staff,
            attendance_date=date,
            assigned_shift_type=shift_type,
            defaults={
                'created_by': 'system',
                'status': 'present'
            }
        )
        
        if record.check_in_time:
            return Response({
                'error': f'{staff.name} is already checked in for this shift'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        record.check_in_time = timezone.now()
        record.status = 'present'  # Will be updated by status calculation logic
        record.save()
        
        return Response(StaffAttendanceRecordSerializer(record).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], url_path='check-out')
    def check_out(self, request, pk=None):
        record = self.get_object()
        
        if not record.check_in_time:
            return Response({'error': 'Staff member is not checked in'}, status=status.HTTP_400_BAD_REQUEST)
            
        if record.check_out_time:
            return Response({'error': 'Already checked out'}, status=status.HTTP_400_BAD_REQUEST)
        
        record.check_out_time = timezone.now()
        record.status = 'present'  # Will be updated by status calculation logic
        record.save()
        
        return Response(StaffAttendanceRecordSerializer(record).data)

    @action(detail=False, methods=['get'], url_path='daily-summary')
    def daily_summary(self, request):
        date = request.query_params.get('date', timezone.now().date())
        
        shift_summaries = []
        for shift_type in ShiftType.objects.filter(is_active=True):
            records = StaffAttendanceRecord.objects.filter(
                attendance_date=date,
                assigned_shift_type=shift_type
            )
            
            summary = {
                'shift_type_name': shift_type.name,
                'total_assigned': records.count(),
                'present': records.filter(status='present').count(),
                'late': records.filter(status='late').count(),
                'early_leave': records.filter(status='early_leave').count(),
                'absent': records.filter(status='absent').count(),
                'incomplete': records.filter(status='incomplete').count(),
            }
            shift_summaries.append(summary)
        
        return Response({
            'date': date,
            'shift_summaries': shift_summaries
        })


@api_view(['POST'])
def verify_staff_pin(request):
    pin = request.data.get('pin')
    
    if not pin:
        return Response({'error': 'PIN is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Find staff by PIN
        staff = TeamMember.objects.get(pin=pin, is_active=True)
        return Response({
            'success': True,
            'staff': {
                'id': staff.id,
                'name': staff.name,
                'role': staff.role,
                'staff_id': staff.staff_id
            }
        })
    except TeamMember.DoesNotExist:
        return Response({'error': 'Invalid PIN'}, status=status.HTTP_401_UNAUTHORIZED)
    except TeamMember.MultipleObjectsReturned:
        return Response({'error': 'Duplicate PIN found. Please contact admin.'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def kiosk_check_in(request):
    pin = request.data.get('pin')
    date = request.data.get('date', timezone.now().date())
    
    if not pin:
        return Response({'error': 'PIN is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Find staff by PIN
        staff = TeamMember.objects.get(pin=pin, is_active=True)
    except TeamMember.DoesNotExist:
        return Response({'error': 'Invalid PIN'}, status=status.HTTP_404_NOT_FOUND)
    except TeamMember.MultipleObjectsReturned:
        return Response({'error': 'Duplicate PIN found. Please contact admin.'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Check if already checked in
    existing_record = StaffAttendanceRecord.objects.filter(
        staff=staff,
        attendance_date=date,
        check_in_time__isnull=False,
        check_out_time__isnull=True
    ).first()
    
    if existing_record:
        return Response({'error': 'Already checked in'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Determine current shift based on time
    current_time = timezone.now().time()
    
    # Find appropriate shift type based on current time
    shift_type = None
    for shift in ShiftType.objects.filter(is_active=True).order_by('start_time'):
        if shift.start_time <= current_time <= shift.end_time:
            shift_type = shift
            break
    
    # If no current shift matches, assign to the next upcoming shift
    if not shift_type:
        upcoming_shifts = ShiftType.objects.filter(
            is_active=True, 
            start_time__gt=current_time
        ).order_by('start_time')
        if upcoming_shifts.exists():
            shift_type = upcoming_shifts.first()
        else:
            # If no upcoming shifts today, use the first shift of the day
            shift_type = ShiftType.objects.filter(is_active=True).order_by('start_time').first()
    
    if not shift_type:
        return Response({'error': 'No active shifts available'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Create or get shift assignment for today
    assignment, created = DailyShiftAssignment.objects.get_or_create(
        staff=staff,
        assignment_date=date,
        shift_type=shift_type,
        defaults={
            'assigned_by': 'kiosk_auto',
            'override_reason': 'Auto-assigned during kiosk check-in'
        }
    )
    
    # Create or update attendance record
    record, created = StaffAttendanceRecord.objects.get_or_create(
        staff=staff,
        attendance_date=date,
        assigned_shift_type=shift_type,
        defaults={
            'created_by': 'kiosk',
            'status': 'present'
        }
    )
    
    record.check_in_time = timezone.now()
    record.status = 'present'
    record.save()
    
    return Response({
        'success': True,
        'action': 'check_in',
        'staff_name': staff.name,
        'shift': shift_type.name,
        'time': record.check_in_time,
        'auto_assigned': created
    })


@api_view(['POST'])
def kiosk_check_out(request):
    pin = request.data.get('pin')
    date = request.data.get('date', timezone.now().date())
    
    if not pin:
        return Response({'error': 'PIN is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Find staff by PIN
        staff = TeamMember.objects.get(pin=pin, is_active=True)
    except TeamMember.DoesNotExist:
        return Response({'error': 'Invalid PIN'}, status=status.HTTP_404_NOT_FOUND)
    except TeamMember.MultipleObjectsReturned:
        return Response({'error': 'Duplicate PIN found. Please contact admin.'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Find current checked-in record
    record = StaffAttendanceRecord.objects.filter(
        staff=staff,
        attendance_date=date,
        check_in_time__isnull=False,
        check_out_time__isnull=True
    ).first()
    
    if not record:
        return Response({'error': 'Not checked in'}, status=status.HTTP_400_BAD_REQUEST)
    
    record.check_out_time = timezone.now()
    record.save()
    
    return Response({
        'success': True,
        'action': 'check_out',
        'staff_name': staff.name,
        'shift': record.assigned_shift_type.name,
        'time': record.check_out_time
    })