from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
from .serializers import UserSerializer, UserDiscoverySerializer
from .models import INTEREST_TAGS

User = get_user_model()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        try:
            data = super().validate(attrs)
            # Add custom claims if needed
            return data
        except Exception as e:
            raise

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        
        # Validate input
        if not username or not password:
            return Response(
                {
                    'detail': 'Username and password are required.'
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if user exists
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response(
                {
                    'detail': 'Invalid username or password.'
                },
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Authenticate user
        user_auth = authenticate(username=username, password=password)
        if user_auth is None:
            return Response(
                {
                    'detail': 'Invalid username or password.'
                },
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Call parent class to get tokens
        return super().post(request, *args, **kwargs)

class InterestTagsView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        return Response({'tags': INTEREST_TAGS})

class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (permissions.AllowAny,)
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        return self.request.user

class ChangePasswordView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        user = request.user
        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")

        if not user.check_password(old_password):
            return Response({"error": "Incorrect old password"}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        return Response({"message": "Password changed successfully"}, status=status.HTTP_200_OK)

class JodiMatcherView(generics.ListAPIView):
    serializer_class = UserDiscoverySerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        from django.db.models import Q
        user = self.request.user
        qs = User.objects.filter(role='FOUNDER').exclude(id=user.id)
        # Optional: exclude same persona for complementary matching
        if user.persona and user.persona != 'NONE':
            qs = qs.exclude(persona=user.persona)
        # Filter by persona
        persona = self.request.query_params.get('persona', None)
        if persona:
            qs = qs.filter(persona=persona)
        # Filter by startup stage
        stage = self.request.query_params.get('stage', None)
        if stage:
            qs = qs.filter(startup_stage=stage)
        # Filter by province
        province = self.request.query_params.get('province', None)
        if province:
            qs = qs.filter(province=province)
        # Filter by interest tags (at least one match)
        tags = self.request.query_params.get('tags', None)
        if tags:
            tag_list = [t.strip() for t in tags.split(',') if t.strip()]
            if tag_list:
                filtered_ids = [u.id for u in qs if any(t in (u.interest_tags or []) for t in tag_list)]
                qs = qs.filter(id__in=filtered_ids)
        # Search by username or bio
        search = self.request.query_params.get('search', None)
        if search:
            qs = qs.filter(Q(username__icontains=search) | Q(bio__icontains=search))
        return qs
