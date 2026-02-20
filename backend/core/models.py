from django.db import models
from django.conf import settings

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
