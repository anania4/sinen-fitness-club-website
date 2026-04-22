from django.db import models
from django.utils import timezone


class Member(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('expired', 'Expired'),
        ('suspended', 'Suspended'),
        ('frozen', 'Frozen'),
    ]
    
    PAYMENT_STATUS_CHOICES = [
        ('paid', 'Paid'),
        ('pending', 'Pending'),
        ('overdue', 'Overdue'),
    ]
    
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    emergency_contact = models.CharField(max_length=20, blank=True, null=True)
    plan = models.CharField(max_length=100)
    start_date = models.DateField()
    expiry_date = models.DateField()
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    profile_photo = models.ImageField(upload_to='member_photos/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name


class Lead(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('contacted', 'Contacted'),
        ('converted', 'Converted'),
        ('lost', 'Lost'),
    ]
    
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    goal = models.CharField(max_length=255)
    preferred_time = models.CharField(max_length=100)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name


class Payment(models.Model):
    PAYMENT_METHODS = [
        ('cash', 'Cash'),
        ('card', 'Card'),
        ('bank_transfer', 'Bank Transfer'),
    ]
    
    member_name = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField(default=timezone.now)
    method = models.CharField(max_length=20, choices=PAYMENT_METHODS)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date', '-created_at']

    def __str__(self):
        return f"{self.member_name} - {self.amount} ETB"


class Plan(models.Model):
    DURATION_CHOICES = [
        ('Monthly', 'Monthly'),
        ('Quarterly', 'Quarterly'),
        ('Annual', 'Annual'),
    ]
    
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    duration = models.CharField(max_length=20, choices=DURATION_CHOICES)
    features = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['price']

    def __str__(self):
        return self.name


class TeamMember(models.Model):
    name = models.CharField(max_length=255)
    role = models.CharField(max_length=100)
    fitness_group = models.CharField(max_length=100)
    staff_id = models.CharField(max_length=20, unique=True, blank=True, null=True, help_text="Unique staff ID for kiosk check-in")
    pin = models.CharField(max_length=6, unique=True, blank=True, null=True, help_text="4-6 digit PIN for kiosk authentication")
    is_active = models.BooleanField(default=True)
    show_on_frontend = models.BooleanField(default=False, help_text="Show this staff member on the public team page")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']
        verbose_name = 'Staff Member'
        verbose_name_plural = 'Staff Members'

    def __str__(self):
        return f"{self.name} - {self.role}"


class Announcement(models.Model):
    title = models.CharField(max_length=255)
    message = models.TextField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class Settings(models.Model):
    telegram_bot_token = models.CharField(max_length=255, blank=True, null=True)
    telegram_chat_id = models.CharField(max_length=255, blank=True, null=True)
    reminder_days = models.IntegerField(default=7)
    auto_reminders_enabled = models.BooleanField(default=True)
    gym_phone = models.CharField(max_length=20, blank=True, null=True)
    gym_name = models.CharField(max_length=255, default='Sinen Gym')
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = 'Settings'

    def __str__(self):
        return 'Gym Settings'

    @classmethod
    def get_settings(cls):
        settings, created = cls.objects.get_or_create(pk=1)
        return settings


class TelegramReminder(models.Model):
    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='telegram_reminders')
    reminder_type = models.CharField(max_length=20, choices=[
        ('d_minus_3', 'D-3 days'),
        ('d_minus_1', 'D-1 day'),
        ('d_day', 'D-day'),
        ('d_plus_1', 'D+1 day'),
        ('d_plus_2', 'D+2 days'),
        ('d_plus_3', 'D+3 days'),
    ])
    sent_at = models.DateTimeField(auto_now_add=True)
    message = models.TextField()
    success = models.BooleanField(default=False)
    error_message = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ['-sent_at']
        unique_together = ['member', 'reminder_type']

    def __str__(self):
        return f"{self.member.name} - {self.reminder_type}"


class DailyPass(models.Model):
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20, blank=True, null=True)
    date = models.DateField(default=timezone.now)
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=100.00)
    payment_method = models.CharField(max_length=20, choices=Payment.PAYMENT_METHODS, default='cash')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date', '-created_at']

    def __str__(self):
        return f"{self.name} - {self.date}"


class Attendance(models.Model):
    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='attendance_records')
    check_in = models.DateTimeField(default=timezone.now)
    check_out = models.DateTimeField(blank=True, null=True)

    class Meta:
        ordering = ['-check_in']

    @property
    def is_checked_in(self):
        return self.check_out is None

    @property
    def duration_minutes(self):
        if self.check_out:
            delta = self.check_out - self.check_in
            return int(delta.total_seconds() / 60)
        delta = timezone.now() - self.check_in
        return int(delta.total_seconds() / 60)

    def __str__(self):
        return f"{self.member.name} - {self.check_in.strftime('%Y-%m-%d %H:%M')}"



# Staff Attendance Models

class ShiftType(models.Model):
    name = models.CharField(max_length=100)  # "Morning Shift", "Evening Shift"
    start_time = models.TimeField()  # 06:00, 14:00
    end_time = models.TimeField()    # 14:00, 22:00
    grace_period_minutes = models.IntegerField(default=15)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['start_time']

    def __str__(self):
        return f"{self.name} ({self.start_time} - {self.end_time})"


class DailyShiftAssignment(models.Model):
    staff = models.ForeignKey(TeamMember, on_delete=models.CASCADE, related_name='shift_assignments')
    assignment_date = models.DateField()
    shift_type = models.ForeignKey(ShiftType, on_delete=models.CASCADE)
    assigned_by = models.CharField(max_length=255)  # Admin username
    assigned_at = models.DateTimeField(auto_now_add=True)
    override_reason = models.TextField(blank=True, null=True)
    
    class Meta:
        unique_together = ['staff', 'assignment_date', 'shift_type']
        ordering = ['-assignment_date', 'shift_type__start_time']

    def __str__(self):
        return f"{self.staff.name} - {self.shift_type.name} on {self.assignment_date}"


class StaffAttendanceRecord(models.Model):
    STATUS_CHOICES = [
        ('present', 'Present'),
        ('late', 'Late'),
        ('early_leave', 'Early Leave'),
        ('absent', 'Absent'),
        ('incomplete', 'Incomplete'),
        ('excessive_duration', 'Excessive Duration'),
    ]
    
    staff = models.ForeignKey(TeamMember, on_delete=models.CASCADE, related_name='attendance_records')
    attendance_date = models.DateField()
    assigned_shift_type = models.ForeignKey(ShiftType, on_delete=models.CASCADE)
    check_in_time = models.DateTimeField(null=True, blank=True)
    check_out_time = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='absent')
    notes = models.TextField(blank=True, null=True)
    created_by = models.CharField(max_length=255)
    updated_by = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['staff', 'attendance_date', 'assigned_shift_type']
        ordering = ['-attendance_date', 'assigned_shift_type__start_time']

    def __str__(self):
        return f"{self.staff.name} - {self.assigned_shift_type.name} on {self.attendance_date}"

    @property
    def duration_minutes(self):
        if self.check_in_time and self.check_out_time:
            delta = self.check_out_time - self.check_in_time
            return int(delta.total_seconds() / 60)
        elif self.check_in_time:
            delta = timezone.now() - self.check_in_time
            return int(delta.total_seconds() / 60)
        return 0