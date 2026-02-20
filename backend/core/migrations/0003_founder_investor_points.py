# Generated migration for FounderProfile and InvestorProfile models

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0002_expertprofile_syndicate_investment'),
    ]

    operations = [
        migrations.CreateModel(
            name='FounderProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('company_name', models.CharField(blank=True, max_length=200, null=True)),
                ('founded_date', models.DateField(blank=True, null=True)),
                ('team_size', models.IntegerField(default=1)),
                ('traction', models.TextField(blank=True, null=True)),
                ('website', models.URLField(blank=True, null=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='founder_profile', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='InvestorProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('firm_name', models.CharField(blank=True, max_length=200, null=True)),
                ('investment_stage', models.CharField(choices=[('PRESEED', 'Pre-seed'), ('SEED', 'Seed'), ('SERIES_A', 'Series A'), ('LATE', 'Late Stage'), ('ANGEL', 'Angel')], default='SEED', max_length=20)),
                ('available_capital', models.DecimalField(decimal_places=2, default=0, max_digits=12)),
                ('focus_areas', models.CharField(blank=True, max_length=255, null=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='investor_profile', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Points',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('points', models.IntegerField(default=0)),
                ('reason', models.CharField(blank=True, max_length=255, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='points', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
    ]
