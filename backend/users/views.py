from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
from .serializers import UserSerializer

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
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        return User.objects.filter(role='FOUNDER').exclude(persona=user.persona).exclude(id=user.id)
