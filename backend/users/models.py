from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('FOUNDER', 'Founder'),
        ('INVESTOR', 'Investor'),
        ('EXPERT', 'Expert'),
    )
    PERSONA_CHOICES = (
        ('HACKER', 'Hacker'),
        ('HIPSTER', 'Hipster'),
        ('HUSTLER', 'Hustler'),
        ('NONE', 'None'),
    )
    STAGE_CHOICES = (
        ('IDEA', 'Idea'),
        ('MVP', 'MVP'),
        ('REVENUE', 'Revenue'),
        ('NONE', 'None'),
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='FOUNDER')
    persona = models.CharField(max_length=20, choices=PERSONA_CHOICES, default='NONE')
    nagarik_id = models.CharField(max_length=50, blank=True, null=True)
    linkedin_profile = models.URLField(blank=True, null=True)
    startup_stage = models.CharField(max_length=20, choices=STAGE_CHOICES, default='NONE')
    karma_score = models.IntegerField(default=0)
    bio = models.TextField(blank=True, null=True)
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.username} ({self.role})"
