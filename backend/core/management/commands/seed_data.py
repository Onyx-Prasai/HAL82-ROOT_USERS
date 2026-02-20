from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from core.models import ExpertProfile, Syndicate, KPISnapshot, FounderProfile, InvestorProfile
from django.utils import timezone
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from core.models import Points
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
        
        # 1. Create Founders (idempotent)
        founders_data = [
            {'username': 'anish_dev', 'persona': 'HACKER', 'bio': 'Full-stack dev interested in FinTech.', 'province': 'BAGMATI'},
            {'username': 'sita_design', 'persona': 'HIPSTER', 'bio': 'Product designer with a focus on UI/UX.', 'province': 'KOSHI'},
            {'username': 'raj_hustles', 'persona': 'HUSTLER', 'bio': 'Growth hacker and sales specialist.', 'province': 'LUMBINI'},
            {'username': 'pema_pioneer', 'persona': 'HACKER', 'bio': 'AI researcher building local LLMs.', 'province': 'GANDAKI'},
            {'username': 'bimal_growth', 'persona': 'HUSTLER', 'bio': 'Experienced manager scaling startups.', 'province': 'MADHESH'},
        ]

        founders = []
        for i, data in enumerate(founders_data, start=1):
            user, created = User.objects.update_or_create(
                username=data['username'],
                defaults={
                    'email': f"{data['username']}@example.com",
                    'role': 'FOUNDER',
                    'persona': data['persona'],
                    'startup_stage': random.choice(stages),
                    'bio': data['bio'],
                    'is_verified': True,
                    'province': data.get('province', 'NONE'),
                    'phone_number': f'+977-9800000{10 + i}',
                }
            )
            # Ensure known password for collaborators
            user.set_password('pass123')
            user.save()
            # Create a simple founder profile with sample fields
            FounderProfile.objects.update_or_create(
                user=user,
                defaults={
                    'company_name': f"{data['username']}_startup",
                    'team_size': random.randint(1, 10),
                    'traction': f"Early traction for {data['username']}",
                }
            )
            founders.append(user)

        # 2. Create Experts (idempotent)
        experts_data = [
            {'username': 'lawyer_laxman', 'spec': 'Legal', 'bio': 'Specialized in Export Law & Tax.', 'province': 'KOSHI'},
            {'username': 'ca_binita', 'spec': 'Accountant', 'bio': 'Chartered Accountant for Agri-Business.', 'province': 'BAGMATI'},
            {'username': 'dev_dorje', 'spec': 'Developer', 'bio': 'Senior React architect.', 'province': 'GANDAKI'},
        ]

        for i, data in enumerate(experts_data, start=1):
            user, created = User.objects.update_or_create(
                username=data['username'],
                defaults={
                    'email': f"{data['username']}@example.com",
                    'role': 'EXPERT',
                    'is_verified': True,
                    'province': data.get('province', 'NONE'),
                    'phone_number': f'+977-9801000{10 + i}',
                }
            )
            user.set_password('pass123')
            user.save()
            ExpertProfile.objects.update_or_create(
                user=user,
                defaults={
                    'specialization': data['spec'],
                    'bio': data['bio'],
                    'hourly_rate': random.randint(20, 100),
                    'is_vetted': True
                }
            )

        # 3. Create Investors
        investors_data = [
            {'username': 'investor_raj', 'bio': 'Early-stage angel investor', 'province': 'LUMBINI'},
            {'username': 'maya_cap', 'bio': 'Venture partner focused on SaaS', 'province': 'BAGMATI'},
        ]

        for i, data in enumerate(investors_data, start=1):
            user, created = User.objects.update_or_create(
                username=data['username'],
                defaults={
                    'email': f"{data['username']}@example.com",
                    'role': 'INVESTOR',
                    'bio': data['bio'],
                    'is_verified': True,
                    'province': data.get('province', 'NONE'),
                    'phone_number': f'+977-9810000{10 + i}',
                }
            )
            user.set_password('pass123')
            user.save()
            # Create investor profile
            InvestorProfile.objects.update_or_create(
                user=user,
                defaults={
                    'firm_name': f"{data['username']}_capital",
                    'investment_stage': 'SEED',
                    'available_capital': random.randint(10000, 200000),
                    'focus_areas': 'SaaS, Agri-Tech',
                }
            )

        # 4. Create Syndicates
        syndicates_data = [
            {'title': 'Agri-Tech Confluence', 'goal': 50000, 'current': 12500},
            {'title': 'Kathmandu SaaS Fund', 'goal': 100000, 'current': 45000},
        ]

        for data in syndicates_data:
            Syndicate.objects.update_or_create(
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
            KPISnapshot.objects.update_or_create(
                user=founders[0],
                week_ending=week_date,
                defaults={
                    'revenue': 1000 * (i + 1),
                    'users': 50 * (i * 2 + 1),
                    'expenses': 500,
                    'is_public': True
                }
            )

        # 5. Create an admin user for convenience (development only)
        admin_user, admin_created = User.objects.update_or_create(
            username='admin',
            defaults={
                'email': 'admin@example.com',
                'is_staff': True,
                'is_superuser': True,
                'role': 'FOUNDER',
                'province': 'BAGMATI',
                'phone_number': '+977-9800000000',
            }
        )
        admin_user.set_password('adminpass123')
        admin_user.save()

        # 6. Create requested superuser 'peepal' with password '1234' (development only)
        peepal, created = User.objects.update_or_create(
            username='peepal',
            defaults={
                'email': 'peepal@example.com',
                'is_staff': True,
                'is_superuser': True,
                'role': 'FOUNDER',
                'province': 'BAGMATI',
                'phone_number': '+977-9800012345',
            }
        )
        peepal.set_password('1234')
        peepal.save()

        # 7. Create sample Points records (so admin can see points table in admin)
        for i, u in enumerate(founders[:3]):
            Points.objects.update_or_create(
                user=u,
                reason=f"Onboarding bonus {i+1}",
                defaults={
                    'points': (i + 1) * 100,
                }
            )

        # 8. Create helpful groups with model permissions so collaborators
        # can assign roles in the admin UI. This creates three groups:
        # - Points Managers: can add/change/view Points
        # - User Details: can view/change User
        # - All Details: broad access to view/add/change core models (dev only)
        def ensure_group(name, perms):
            group, _ = Group.objects.get_or_create(name=name)
            group.permissions.set(perms)
            group.save()

        # helper to gather standard perms for a model
        def model_perms(model_class, actions=('add', 'change', 'view')):
            ct = ContentType.objects.get_for_model(model_class)
            qs = Permission.objects.filter(content_type=ct)
            selected = []
            for action in actions:
                codename = f"{action}_{model_class._meta.model_name}"
                p = qs.filter(codename=codename).first()
                if p:
                    selected.append(p)
            return selected

        points_perms = model_perms(Points)
        user_perms = model_perms(User, actions=('view', 'change'))
        syndicate_perms = model_perms(Syndicate)

        ensure_group('Points Managers', points_perms)
        ensure_group('User Details', user_perms)
        # All Details: combine a few example perms for development
        ensure_group('All Details', list(set(points_perms + user_perms + syndicate_perms)))
        self.stdout.write(self.style.SUCCESS('Successfully seeded synthetic data!'))
