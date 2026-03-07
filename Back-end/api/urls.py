from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'members', views.MemberViewSet)
router.register(r'leads', views.LeadViewSet)
router.register(r'payments', views.PaymentViewSet)
router.register(r'plans', views.PlanViewSet)
router.register(r'team', views.TeamMemberViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/stats', views.dashboard_stats, name='dashboard-stats'),
    path('dashboard/expiring-members', views.expiring_members, name='expiring-members'),
    path('dashboard/leads', views.dashboard_leads, name='dashboard-leads'),
    path('dashboard/payments', views.recent_payments, name='recent-payments'),
    path('dashboard/revenue', views.revenue_chart, name='revenue-chart'),
]
