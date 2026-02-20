from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import INTEREST_TAGS

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, min_length=6)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'password', 'role', 'persona', 'nagarik_id', 'linkedin_profile', 'startup_stage', 'karma_score', 'province', 'phone_number', 'bio', 'is_verified', 'interest_tags')
        extra_kwargs = {
            'username': {'required': True, 'allow_blank': False},
            'email': {'required': True, 'allow_blank': False},
            'first_name': {'required': False, 'allow_blank': True},
            'last_name': {'required': False, 'allow_blank': True},
            'role': {'required': False},
            'persona': {'required': False},
            'nagarik_id': {'required': False, 'allow_blank': True},
            'linkedin_profile': {'required': False, 'allow_blank': True},
            'startup_stage': {'required': False},
            'karma_score': {'read_only': True},
            'province': {'required': False},
            'phone_number': {'required': False, 'allow_blank': True},
            'bio': {'required': False, 'allow_blank': True},
            'is_verified': {'read_only': True},
            'interest_tags': {'required': False},
        }

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("This username is already taken.")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already registered.")
        return value

    def validate_password(self, value):
        if len(value) < 6:
            raise serializers.ValidationError("Password must be at least 6 characters long.")
        return value

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=password,
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            role=validated_data.get('role', 'FOUNDER'),
            persona=validated_data.get('persona', 'NONE'),
            nagarik_id=validated_data.get('nagarik_id', ''),
            linkedin_profile=validated_data.get('linkedin_profile', None),
            startup_stage=validated_data.get('startup_stage', 'NONE'),
            province=validated_data.get('province', 'NONE'),
            phone_number=validated_data.get('phone_number', ''),
            bio=validated_data.get('bio', ''),
            interest_tags=validated_data.get('interest_tags', []),
        )
        return user

class UserDiscoverySerializer(serializers.ModelSerializer):
    """Read-only serializer for Jodi discovery (no password)."""
    class Meta:
        model = User
        fields = ('id', 'username', 'persona', 'role', 'startup_stage', 'province', 'bio', 'interest_tags', 'linkedin_profile', 'karma_score')
