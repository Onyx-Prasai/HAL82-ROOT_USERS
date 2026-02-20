from rest_framework import serializers
from .models import Syndicate, Investment, ExpertProfile, KPISnapshot
from django.contrib.auth import get_user_model

User = get_user_model()

class KPISnapshotSerializer(serializers.ModelSerializer):
    class Meta:
        model = KPISnapshot
        fields = ('id', 'week_ending', 'revenue', 'users', 'expenses', 'is_public', 'created_at')
        read_only_fields = ('id', 'created_at')

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class SyndicateSerializer(serializers.ModelSerializer):
    founder_name = serializers.ReadOnlyField(source='founder.username')
    progress = serializers.SerializerMethodField()

    class Meta:
        model = Syndicate
        fields = ('id', 'title', 'founder_name', 'description', 'funding_goal', 'current_funding', 'progress', 'is_active', 'created_at')

    def get_progress(self, obj):
        if obj.funding_goal == 0: return 0
        return (obj.current_funding / obj.funding_goal) * 100

class ExpertProfileSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')
    email = serializers.ReadOnlyField(source='user.email')
    interest_tags = serializers.ReadOnlyField(source='user.interest_tags')

    class Meta:
        model = ExpertProfile
        fields = ('id', 'username', 'email', 'specialization', 'bio', 'hourly_rate', 'rating', 'is_vetted', 'interest_tags')
