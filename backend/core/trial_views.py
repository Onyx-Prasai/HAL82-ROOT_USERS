from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import TrialProposal, Notification
from .serializers import TrialProposalSerializer

User = get_user_model()


class ProposeTrialView(APIView):
    """Create a trial proposal to another user (Jodi). Creates notification for recipient."""
    permission_classes = [IsAuthenticated]

    def post(self, request, recipient_id):
        try:
            recipient = User.objects.get(id=recipient_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        if recipient_id == request.user.id:
            return Response({'error': 'Cannot propose trial to yourself'}, status=status.HTTP_400_BAD_REQUEST)

        message = request.data.get('message', '')
        proposal = TrialProposal.objects.create(
            proposer=request.user,
            recipient=recipient,
            message=message or None,
        )
        # Create notification for recipient
        Notification.objects.create(
            user=recipient,
            notification_type='TRIAL_PROPOSAL',
            title='Trial Proposal',
            message=f"{request.user.username} wants to propose a 2-week digital trial with you.",
            payload={'trial_id': proposal.id, 'proposer_id': request.user.id},
        )
        return Response(TrialProposalSerializer(proposal).data, status=status.HTTP_201_CREATED)


class TrialProposalListView(APIView):
    """List trial proposals (sent or received)."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        received = TrialProposal.objects.filter(recipient=request.user)
        sent = TrialProposal.objects.filter(proposer=request.user)
        qs = (received | sent).distinct().order_by('-created_at')
        return Response(TrialProposalSerializer(qs, many=True).data)


class TrialProposalRespondView(APIView):
    """Accept or decline a trial proposal (recipient only)."""
    permission_classes = [IsAuthenticated]

    def post(self, request, proposal_id):
        try:
            proposal = TrialProposal.objects.get(id=proposal_id, recipient=request.user)
        except TrialProposal.DoesNotExist:
            return Response({'error': 'Proposal not found'}, status=status.HTTP_404_NOT_FOUND)

        action = request.data.get('action')
        if action == 'accept':
            proposal.status = 'ACCEPTED'
            proposal.save()
            Notification.objects.create(
                user=proposal.proposer,
                notification_type='TRIAL_PROPOSAL',
                title='Trial Accepted',
                message=f"{request.user.username} accepted your trial proposal.",
                payload={'trial_id': proposal.id},
            )
        elif action == 'decline':
            proposal.status = 'DECLINED'
            proposal.save()
        else:
            return Response({'error': 'Invalid action. Use accept or decline'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(TrialProposalSerializer(proposal).data)
