from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import INTEREST_TAGS

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'password', 'role', 'persona', 'nagarik_id', 'linkedin_profile', 'startup_stage', 'karma_score', 'province', 'phone_number', 'bio', 'is_verified', 'interest_tags')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            role=validated_data.get('role', 'FOUNDER'),
            persona=validated_data.get('persona', 'NONE'),
            nagarik_id=validated_data.get('nagarik_id', ''),
            linkedin_profile=validated_data.get('linkedin_profile', ''),
            startup_stage=validated_data.get('startup_stage', 'NONE'),
        )
        return user
