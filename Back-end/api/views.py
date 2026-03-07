from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from django.db.models import Count, Sum, Q
from django.utils import timezone
from datetime import timedelta
from .models import Member, Lead, Payment, Plan, TeamMember
from .serializers import (
    MemberSerializer, LeadSerializer, PaymentSerializer, 
    PlanSerializer, TeamMemberSerializer
)


class MemberViewSet(viewsets.ModelViewSet):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer


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


@api_view(['GET'])
def dashboard_stats(request):
    total_members = Member.objects.count()
    active_members = Member.objects.filter(status='active').count()
    
    # Members expiring in next 14 days
    today = timezone.now().date()
    expiring_soon = Member.objects.filter(
        expiry_date__gte=today,
        expiry_date__lte=today + timedelta(days=14),
        status='active'
    ).count()
    
    new_leads = Lead.objects.filter(status='pending').count()
    
    return Response({
        'totalMembers': total_members,
        'activeMembers': active_members,
        'expiringSoon': expiring_soon,
        'newLeads': new_leads
    })


@api_view(['GET'])
def expiring_members(request):
    today = timezone.now().date()
    members = Member.objects.filter(
        expiry_date__gte=today,
        expiry_date__lte=today + timedelta(days=14),
        status='active'
    )
    serializer = MemberSerializer(members, many=True)
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
