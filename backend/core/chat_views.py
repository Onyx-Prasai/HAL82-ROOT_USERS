from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from django.db.models import Q
from .models import Message

User = get_user_model()


class ChatHistoryView(APIView):
    """Returns chat messages between current user and the given receiver_id. Only sender/receiver can see."""
    permission_classes = [IsAuthenticated]

    def get(self, request, receiver_id):
        try:
            other = User.objects.get(id=receiver_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        # Only show messages where current user is sender or receiver
        messages = Message.objects.filter(
            (Q(sender=request.user) & Q(receiver=other)) |
            (Q(sender=other) & Q(receiver=request.user))
        ).order_by('timestamp')

        data = [
            {
                'id': m.id,
                'sender': m.sender.id,
                'receiver': m.receiver.id,
                'content': m.content,
                'timestamp': m.timestamp.isoformat(),
            }
            for m in messages
        ]
        return Response(data)


class MarkAsReadView(APIView):
    """Acknowledge reading messages (no-op for now; can extend Message model with read flag)."""
    permission_classes = [IsAuthenticated]

    def post(self, request, receiver_id):
        # Optional: mark messages from receiver as read if we add a read field
        return Response({'ok': True})
