from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'members', views.MemberViewSet)
router.register(r'leads', views.LeadViewSet)
router.register(r'payments', views.PaymentViewSet)
router.register(r'plans', views.PlanViewSet)
router.register(r'team', views.TeamMemberViewSet)
router.register(r'announcements', views.AnnouncementViewSet)
router.register(r'settings', views.SettingsViewSet)
router.register(r'telegram-reminders', views.TelegramReminderViewSet)
router.register(r'daily-passes', views.DailyPassViewSet)
router.register(r'attendance', views.AttendanceViewSet)
# Staff Attendance endpoints
router.register(r'shift-types', views.ShiftTypeViewSet)
router.register(r'shift-assignments', views.DailyShiftAssignmentViewSet)
router.register(r'staff-attendance', views.StaffAttendanceViewSet)

urlpatterns = [
    # Staff Attendance kiosk endpoints
    path('staff/verify-pin/', views.verify_staff_pin, name='verify-staff-pin'),
    path('kiosk/check-in/', views.kiosk_check_in, name='kiosk-check-in'),
    path('kiosk/check-out/', views.kiosk_check_out, name='kiosk-check-out'),
    path('', include(router.urls)),
    # Auth endpoints
    path('auth/login/', views.login_view, name='auth-login'),
    path('auth/logout/', views.logout_view, name='auth-logout'),
    path('auth/check/', views.check_auth, name='auth-check'),
    # Dashboard endpoints
    path('dashboard/stats', views.dashboard_stats, name='dashboard-stats'),
    path('dashboard/expiring-members', views.expiring_members, name='expiring-members'),
    path('dashboard/leads', views.dashboard_leads, name='dashboard-leads'),
    path('dashboard/payments', views.recent_payments, name='recent-payments'),
    path('dashboard/revenue', views.revenue_chart, name='revenue-chart'),
    # Telegram endpoints
    path('telegram/test', views.send_test_telegram, name='telegram-test'),
    path('telegram/send-reminders', views.send_telegram_reminders, name='telegram-send-reminders'),
    path('telegram/send-announcement', views.send_announcement_telegram, name='telegram-send-announcement'),
    path('telegram/stats', views.telegram_stats, name='telegram-stats'),
]

