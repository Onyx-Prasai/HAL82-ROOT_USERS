from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from core.models import ExpertProfile, Syndicate, KPISnapshot
from django.utils import timezone
import random
from datetime import timedelta

User = get_user_model()

class Command(BaseCommand):
    help = 'Seeds the database with synthetic data for SANGAM'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding data...')

        # Creators
        personas = ['HACKER', 'HIPSTER', 'HUSTLER']
        stages = ['IDEA', 'MVP', 'REVENUE']
        
        # 1. Create Founders
        founders_data = [
            {'username': 'anish_dev', 'persona': 'HACKER', 'bio': 'Full-stack dev interested in FinTech.'},
            {'username': 'sita_design', 'persona': 'HIPSTER', 'bio': 'Product designer with a focus on UI/UX.'},
            {'username': 'raj_hustles', 'persona': 'HUSTLER', 'bio': 'Growth hacker and sales specialist.'},
            {'username': 'pema_pioneer', 'persona': 'HACKER', 'bio': 'AI researcher building local LLMs.'},
            {'username': 'bimal_growth', 'persona': 'HUSTLER', 'bio': 'Experienced manager scaling startups.'},
        ]

        founders = []
        for data in founders_data:
            user, created = User.objects.get_or_create(
                username=data['username'],
                defaults={
                    'email': f"{data['username']}@example.com",
                    'role': 'FOUNDER',
                    'persona': data['persona'],
                    'startup_stage': random.choice(stages),
                    'bio': data['bio'],
                    'is_verified': True
                }
            )
            if created:
                user.set_password('pass123')
                user.save()
            founders.append(user)

        # 2. Create Experts
        experts_data = [
            {'username': 'lawyer_laxman', 'spec': 'Legal', 'bio': 'Specialized in Export Law & Tax.'},
            {'username': 'ca_binita', 'spec': 'Accountant', 'bio': 'Chartered Accountant for Agri-Business.'},
            {'username': 'dev_dorje', 'spec': 'Developer', 'bio': 'Senior React architect.'},
        ]

        for data in experts_data:
            user, created = User.objects.get_or_create(
                username=data['username'],
                defaults={
                    'email': f"{data['username']}@example.com",
                    'role': 'EXPERT',
                    'is_verified': True
                }
            )
            if created:
                user.set_password('pass123')
                user.save()
            
            ExpertProfile.objects.get_or_create(
                user=user,
                defaults={
                    'specialization': data['spec'],
                    'bio': data['bio'],
                    'hourly_rate': random.randint(20, 100),
                    'is_vetted': True
                }
            )

        # 3. Create Syndicates
        syndicates_data = [
            {'title': 'Agri-Tech Confluence', 'goal': 50000, 'current': 12500},
            {'title': 'Kathmandu SaaS Fund', 'goal': 100000, 'current': 45000},
        ]

        for data in syndicates_data:
            Syndicate.objects.get_or_create(
                title=data['title'],
                defaults={
                    'founder': founders[0],
                    'description': f"A collective fund for {data['title']} enthusiasts.",
                    'funding_goal': data['goal'],
                    'current_funding': data['current']
                }
            )

        # 4. Create KPI Snapshots for one founder
        today = timezone.now().date()
        for i in range(5):
            week_date = today - timedelta(days=today.weekday() + (i * 7) + 1) # Last few Sundays
            KPISnapshot.objects.get_or_create(
                user=founders[0],
                week_ending=week_date,
                defaults={
                    'revenue': 1000 * (i + 1),
                    'users': 50 * (i * 2 + 1),
                    'expenses': 500,
                    'is_public': True
                }
            )

        self.stdout.write(self.style.SUCCESS('Successfully seeded synthetic data!'))
