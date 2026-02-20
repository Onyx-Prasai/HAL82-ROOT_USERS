from rest_framework import serializers
from .models import Syndicate, Investment, ExpertProfile, KPISnapshot, TrialProposal, Notification, Booking, RedeemOffer, Redemption, Points
from django.contrib.auth import get_user_model

User = get_user_model()


class TrialProposalSerializer(serializers.ModelSerializer):
    proposer_username = serializers.ReadOnlyField(source='proposer.username')
    recipient_username = serializers.ReadOnlyField(source='recipient.username')

    class Meta:
        model = TrialProposal
        fields = ('id', 'proposer', 'proposer_username', 'recipient', 'recipient_username', 'status', 'message', 'created_at')
        read_only_fields = ('id', 'created_at')


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ('id', 'notification_type', 'title', 'message', 'read', 'payload', 'created_at')
        read_only_fields = ('id', 'created_at')


class BookingSerializer(serializers.ModelSerializer):
    expert_username = serializers.ReadOnlyField(source='expert.username')
    client_username = serializers.ReadOnlyField(source='client.username')

    class Meta:
        model = Booking
        fields = ('id', 'expert', 'expert_username', 'client', 'client_username', 'is_free_intro', 'amount', 'status', 'notes', 'created_at')
        read_only_fields = ('id', 'created_at')


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
        fields = ('id', 'title', 'founder_name', 'description', 'funding_goal', 'current_funding', 'progress', 'is_active', 'interest_tags', 'created_at')

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


class RedeemOfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = RedeemOffer
        fields = ('id', 'company_name', 'description', 'discount_percent', 'points_required', 'interest_tags', 'is_active', 'created_at')


class RedemptionSerializer(serializers.ModelSerializer):
    offer_name = serializers.ReadOnlyField(source='offer.company_name')
    discount_percent = serializers.ReadOnlyField(source='offer.discount_percent')

    class Meta:
        model = Redemption
        fields = ('id', 'offer', 'offer_name', 'discount_percent', 'points_spent', 'redeemed_at')


class PointsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Points
        fields = ('id', 'points', 'reason', 'created_at')
