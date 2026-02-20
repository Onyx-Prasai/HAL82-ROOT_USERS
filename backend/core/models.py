
from django.db import models
from django.conf import settings

class Message(models.Model):
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_messages')
    receiver = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='received_messages')
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        return f"{self.sender.username} to {self.receiver.username}: {self.content[:20]}"

class KPISnapshot(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='kpi_snapshots')
    week_ending = models.DateField()
    revenue = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    users = models.IntegerField(default=0)
    expenses = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    is_public = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'week_ending')
        ordering = ['week_ending']

    def __str__(self):
        return f"{self.user.username} - Week {self.week_ending}"

class Syndicate(models.Model):
    title = models.CharField(max_length=200)
    founder = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='syndicates')
    description = models.TextField()
    funding_goal = models.DecimalField(max_digits=12, decimal_places=2)
    current_funding = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Investment(models.Model):
    syndicate = models.ForeignKey(Syndicate, on_delete=models.CASCADE, related_name='investments')
    investor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='made_investments')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

class ExpertProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='expert_profile')
    specialization = models.CharField(max_length=100)
    bio = models.TextField()
    hourly_rate = models.DecimalField(max_digits=10, decimal_places=2)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=5.0)
    is_vetted = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} - {self.specialization}"


class FounderProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='founder_profile')
    company_name = models.CharField(max_length=200, blank=True, null=True)
    founded_date = models.DateField(blank=True, null=True)
    team_size = models.IntegerField(default=1)
    traction = models.TextField(blank=True, null=True)
    website = models.URLField(blank=True, null=True)

    def __str__(self):
        return f"{self.user.username} - Founder @ {self.company_name or 'N/A'}"


class InvestorProfile(models.Model):
    INVESTMENT_STAGE = (
        ('PRESEED', 'Pre-seed'),
        ('SEED', 'Seed'),
        ('SERIES_A', 'Series A'),
        ('LATE', 'Late Stage'),
        ('ANGEL', 'Angel'),
    )

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='investor_profile')
    firm_name = models.CharField(max_length=200, blank=True, null=True)
    investment_stage = models.CharField(max_length=20, choices=INVESTMENT_STAGE, default='SEED')
    available_capital = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    focus_areas = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"{self.user.username} - Investor @ {self.firm_name or 'Independent'}"


class Points(models.Model):
    """A simple points system that can be attached to users.

    This keeps the domain small so contributors can add records and
    connect them to users (for leaderboards, rewards, etc.).
    """
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='points')
    points = models.IntegerField(default=0)
    reason = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username}: {self.points} ({self.reason})"
