from django.contrib import admin
from .models import (
	KPISnapshot,
	Syndicate,
	Investment,
	ExpertProfile,
	FounderProfile,
	InvestorProfile,
	Points,
)


@admin.register(KPISnapshot)
class KPISnapshotAdmin(admin.ModelAdmin):
	list_display = ('user', 'week_ending', 'revenue', 'users', 'is_public')
	list_filter = ('is_public',)


@admin.register(Syndicate)
class SyndicateAdmin(admin.ModelAdmin):
	list_display = ('title', 'founder', 'funding_goal', 'current_funding', 'is_active')


@admin.register(Investment)
class InvestmentAdmin(admin.ModelAdmin):
	list_display = ('syndicate', 'investor', 'amount', 'created_at')


@admin.register(ExpertProfile)
class ExpertProfileAdmin(admin.ModelAdmin):
	list_display = ('user', 'specialization', 'hourly_rate', 'is_vetted')


@admin.register(FounderProfile)
class FounderProfileAdmin(admin.ModelAdmin):
	list_display = ('user', 'company_name', 'founded_date', 'team_size')
	search_fields = ('company_name', 'user__username')


@admin.register(InvestorProfile)
class InvestorProfileAdmin(admin.ModelAdmin):
	list_display = ('user', 'firm_name', 'investment_stage', 'available_capital')
	search_fields = ('firm_name', 'user__username', 'focus_areas')


@admin.register(Points)
class PointsAdmin(admin.ModelAdmin):
	list_display = ('user', 'points', 'reason', 'created_at')
	search_fields = ('user__username', 'reason')
