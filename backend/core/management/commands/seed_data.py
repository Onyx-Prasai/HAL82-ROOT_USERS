"""Seed ~100 users, syndicates, and experts for Jodi, Syndicate, and Experts sections."""
import random
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from core.models import Syndicate, ExpertProfile, RedeemOffer

User = get_user_model()

PERSONAS = ['HACKER', 'HIPSTER', 'HUSTLER']
STAGES = ['IDEA', 'MVP', 'REVENUE']
PROVINCES = ['KOSHI', 'MADHESH', 'BAGMATI', 'GANDAKI', 'LUMBINI', 'KARNALI', 'SUDURPASHCHIM']
INTEREST_TAGS = ['Agriculture', 'Tech', 'FinTech', 'Health', 'Education', 'Manufacturing', 'AI', 'Sustainability', 'General']

JODI_BIOS = [
    "Building the next AgriTech platform for Nepal's farmers.",
    "Full-stack developer passionate about EdTech solutions.",
    "Growth hacker focused on sustainable startups.",
    "UX designer with 8 years in FinTech.",
    "Backend engineer scaling systems for 1M+ users.",
    "Marketing expert specializing in D2C brands.",
    "Data scientist building AI for healthcare.",
    "Operations lead with manufacturing background.",
    "Strategic thinker bridging tech and business.",
    "Visionary founder with 3 successful exits.",
]

SYNDICATE_TITLES = [
    "Nepal AgriTech Fund I", "KTM FinTech Syndicate", "HealthTech Ventures", "EdTech Growth Fund",
    "Sustainable Energy Pool", "AI Innovation Capital", "Manufacturing 4.0 Fund", "Rural Tech Ventures",
    "Kathmandu Valley Tech", "Himalayan Startups Fund", "Digital Nepal Capital", "Smart Cities Syndicate",
    "Clean Water Tech Fund", "Mobility Innovation Pool", "FoodTech Nepal Fund", "ClimateTech Ventures",
    "B2B SaaS Growth Fund", "Consumer Tech Capital", "DeepTech Syndicate", "Women-Led Startups Fund",
    "Youth Innovation Pool", "Provincial Growth Fund I", "Provincial Growth Fund II", "Export Tech Fund",
    "Logistics Tech Capital", "RetailTech Ventures", "PropTech Nepal Fund", "InsurTech Syndicate",
    "LegalTech Innovation Pool", "HR Tech Growth Fund", "Cybersecurity Ventures", "IoT Nepal Capital",
]

SYNDICATE_DESCRIPTIONS = [
    "Supporting early-stage startups in agriculture technology across Nepal.",
    "Community-backed fund for FinTech innovations in the Himalayan region.",
    "Investing in healthcare technology that improves access in rural areas.",
    "Backing EdTech companies transforming education in Nepal.",
    "Focus on sustainable energy and climate solutions.",
    "Capital for AI-driven products and services.",
    "Modernizing Nepal's manufacturing sector through technology.",
]

EXPERT_SPECIALIZATIONS = [
    "Legal Compliance", "Tax & Accounting", "Brand Strategy", "UI/UX Design", "Fundraising",
    "Legal Structuring", "Financial Modeling", "Product Design", "Digital Marketing", "HR & Hiring",
    "Intellectual Property", "Venture Law", "Growth Marketing", "Technical Architecture", "Business Development",
]

EXPERT_BIOS = [
    "Vetted expert with 10+ years in startup advisory.",
    "Former Big 4 consultant now helping Nepali founders.",
    "Design lead from Silicon Valley startups.",
    "Legal expert specializing in startup incorporation.",
]

REDEEM_OFFERS = [
    {"company": "CloudNest Nepal", "desc": "Cloud hosting for startups - get premium tier at discounted rate.", "discount": 20, "points": 50, "tags": ["Tech", "AI"]},
    {"company": "DesignPro Studio", "desc": "Professional UI/UX design services for your product.", "discount": 15, "points": 40, "tags": ["Tech", "Education"]},
    {"company": "LegalEase Nepal", "desc": "Startup legal incorporation and compliance services.", "discount": 25, "points": 75, "tags": ["General"]},
    {"company": "MarketBoost", "desc": "Digital marketing package for early-stage startups.", "discount": 30, "points": 100, "tags": ["Tech", "FinTech"]},
    {"company": "AccountsFirst", "desc": "Tax filing and bookkeeping services for SMEs.", "discount": 15, "points": 35, "tags": ["FinTech"]},
    {"company": "HireRight Nepal", "desc": "Recruiting and HR services for growing teams.", "discount": 20, "points": 60, "tags": ["General"]},
    {"company": "PrintHub KTM", "desc": "Business cards, brochures, and marketing materials.", "discount": 40, "points": 30, "tags": ["General", "Manufacturing"]},
    {"company": "CoWork Valley", "desc": "Co-working space membership in Kathmandu.", "discount": 25, "points": 80, "tags": ["Tech"]},
    {"company": "DevOps Nepal", "desc": "Infrastructure setup and DevOps consulting.", "discount": 20, "points": 70, "tags": ["Tech", "AI"]},
    {"company": "GreenPack Solutions", "desc": "Eco-friendly packaging for product-based startups.", "discount": 15, "points": 45, "tags": ["Sustainability", "Manufacturing"]},
    {"company": "DataInsights Pro", "desc": "Business analytics and data visualization services.", "discount": 30, "points": 90, "tags": ["Tech", "AI", "FinTech"]},
    {"company": "TranslateNepal", "desc": "Professional translation and localization services.", "discount": 20, "points": 40, "tags": ["Education", "General"]},
    {"company": "PayWise Nepal", "desc": "Payment gateway integration for e-commerce and SaaS.", "discount": 20, "points": 55, "tags": ["FinTech", "Tech"]},
    {"company": "SocialWave Agency", "desc": "Social media management and content creation for brands.", "discount": 25, "points": 65, "tags": ["Tech", "Education"]},
    {"company": "SecureStack", "desc": "Cybersecurity audit and compliance for startups.", "discount": 30, "points": 95, "tags": ["Tech", "AI"]},
    {"company": "Himalayan Logistics", "desc": "Last-mile delivery and logistics solutions.", "discount": 15, "points": 42, "tags": ["General", "Manufacturing"]},
    {"company": "BrandCraft Nepal", "desc": "Logo design and brand identity packages.", "discount": 35, "points": 55, "tags": ["Tech", "General"]},
]


def random_tags(n=3):
    return random.sample(INTEREST_TAGS, min(n, len(INTEREST_TAGS)))


class Command(BaseCommand):
    help = 'Seed ~100 users (Jodi), syndicates, and experts'

    def handle(self, *args, **options):
        default_password = 'pass1234'

        # --- Jodi: ~40 founders ---
        self.stdout.write('Seeding Jodi founders...')
        for i in range(1, 41):
            username = f'founder_jodi_{i}'
            if User.objects.filter(username=username).exists():
                continue
            User.objects.create_user(
                username=username,
                email=f'founder{i}@jodi.test',
                password=default_password,
                role='FOUNDER',
                persona=random.choice(PERSONAS),
                startup_stage=random.choice(STAGES),
                province=random.choice(PROVINCES),
                bio=random.choice(JODI_BIOS),
                interest_tags=random_tags(),
                karma_score=random.randint(10, 200),
                linkedin_profile=f'https://linkedin.com/in/founder{i}' if random.random() > 0.5 else None,
            )
        self.stdout.write(self.style.SUCCESS(f'  Created founders (Jodi)'))

        # --- Experts: ~35 ---
        self.stdout.write('Seeding experts...')
        for i in range(1, 36):
            username = f'expert_{i}'
            if User.objects.filter(username=username).exists():
                continue
            user = User.objects.create_user(
                username=username,
                email=f'expert{i}@test.com',
                password=default_password,
                role='EXPERT',
                persona='NONE',
                province=random.choice(PROVINCES),
                bio=random.choice(EXPERT_BIOS),
                interest_tags=random_tags(),
                karma_score=random.randint(20, 150),
            )
            ExpertProfile.objects.get_or_create(
                user=user,
                defaults={
                    'specialization': random.choice(EXPERT_SPECIALIZATIONS),
                    'bio': random.choice(EXPERT_BIOS) + f" Expert #{i}.",
                    'hourly_rate': Decimal(str(round(random.uniform(25, 150), 2))),
                    'rating': Decimal(str(round(random.uniform(4.0, 5.0), 2))),
                    'is_vetted': random.random() > 0.3,
                }
            )
        self.stdout.write(self.style.SUCCESS(f'  Created experts'))

        # --- Syndicates: ~35 (need founders) ---
        self.stdout.write('Seeding syndicates...')
        founders = list(User.objects.filter(role='FOUNDER')[:50])
        if not founders:
            founders = [User.objects.filter(role='FOUNDER').first() or User.objects.first()]
        for i, title in enumerate(SYNDICATE_TITLES):
            if Syndicate.objects.filter(title=title).exists():
                continue
            founder = random.choice(founders)
            goal = Decimal(str(round(random.uniform(50000, 500000), 2)))
            current = goal * Decimal(str(random.uniform(0.1, 0.9)))
            Syndicate.objects.create(
                title=title,
                founder=founder,
                description=random.choice(SYNDICATE_DESCRIPTIONS) + f" {title}.",
                funding_goal=goal,
                current_funding=current,
                interest_tags=random_tags(),
                is_active=True,
            )
        self.stdout.write(self.style.SUCCESS(f'  Created syndicates'))

        # Ensure we have at least 1 syndicate per remaining titles
        for i in range(len(SYNDICATE_TITLES), 35):
            title = f"Syndicate Fund {i+1}"
            if Syndicate.objects.filter(title=title).exists():
                continue
            founder = random.choice(founders)
            goal = Decimal(str(round(random.uniform(50000, 300000), 2)))
            current = goal * Decimal(str(random.uniform(0.05, 0.8)))
            Syndicate.objects.create(
                title=title,
                founder=founder,
                description=random.choice(SYNDICATE_DESCRIPTIONS),
                funding_goal=goal,
                current_funding=current,
                interest_tags=random_tags(),
                is_active=True,
            )

        # --- Redeem Offers ---
        self.stdout.write('Seeding redeem offers...')
        for offer_data in REDEEM_OFFERS:
            if RedeemOffer.objects.filter(company_name=offer_data["company"]).exists():
                continue
            RedeemOffer.objects.create(
                company_name=offer_data["company"],
                description=offer_data["desc"],
                discount_percent=offer_data["discount"],
                points_required=offer_data["points"],
                interest_tags=offer_data["tags"],
                is_active=True,
            )
        self.stdout.write(self.style.SUCCESS(f'  Created redeem offers'))

        self.stdout.write(self.style.SUCCESS('Seed complete! Jodi, Syndicate, Experts, and Redeem Offers have sample data.'))
