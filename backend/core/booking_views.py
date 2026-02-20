from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from decimal import Decimal
from .models import Booking, ExpertProfile, Notification
from .serializers import BookingSerializer

User = get_user_model()


class BookSessionView(APIView):
    """Book a session with an expert. First session is free (intro with contact details)."""
    permission_classes = [IsAuthenticated]

    def post(self, request, expert_profile_id):
        try:
            expert_profile = ExpertProfile.objects.get(id=expert_profile_id)
        except ExpertProfile.DoesNotExist:
            return Response({'error': 'Expert not found'}, status=status.HTTP_404_NOT_FOUND)

        expert_user = expert_profile.user
        # Check if client already has a free intro session with this expert
        existing = Booking.objects.filter(client=request.user, expert=expert_user, is_free_intro=True).exists()
        amount = request.data.get('amount', 0)
        is_free = not existing and (not amount or Decimal(str(amount)) == 0)

        if is_free:
            amount = Decimal('0')
        else:
            amount = Decimal(str(amount)) if amount else expert_profile.hourly_rate

        booking = Booking.objects.create(
            expert=expert_user,
            client=request.user,
            is_free_intro=is_free,
            amount=amount,
            notes=request.data.get('notes', ''),
        )
        Notification.objects.create(
            user=expert_user,
            notification_type='BOOKING',
            title='New Session Booking',
            message=f"{request.user.username} booked a {'free intro ' if is_free else ''}session with you.",
            payload={'booking_id': booking.id, 'client_id': request.user.id},
        )
        return Response(BookingSerializer(booking).data, status=status.HTTP_201_CREATED)


class BookingListView(APIView):
    """List user's bookings (as client or expert)."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = Booking.objects.filter(
            client=request.user
        ) | Booking.objects.filter(expert=request.user)
        qs = qs.distinct().order_by('-created_at')
        return Response(BookingSerializer(qs, many=True).data)


class ExpertContactView(APIView):
    """Get expert contact details for free intro session."""
    permission_classes = [IsAuthenticated]

    def get(self, request, expert_profile_id):
        try:
            profile = ExpertProfile.objects.get(id=expert_profile_id)
        except ExpertProfile.DoesNotExist:
            return Response({'error': 'Expert not found'}, status=status.HTTP_404_NOT_FOUND)

        expert_user = profile.user
        return Response({
            'username': expert_user.username,
            'email': expert_user.email,
            'phone_number': expert_user.phone_number or 'Not shared',
            'specialization': profile.specialization,
            'bio': profile.bio,
            'hourly_rate': str(profile.hourly_rate),
        })
