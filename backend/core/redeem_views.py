from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Sum
from .models import RedeemOffer, Redemption, Points
from .serializers import RedeemOfferSerializer, RedemptionSerializer, PointsSerializer


class KarmaBalanceView(APIView):
    """Get user's karma balance (total earned - total spent)."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        # Points from the Points model (earned)
        earned = Points.objects.filter(user=user).aggregate(total=Sum('points'))['total'] or 0
        # Also include karma_score from user profile
        earned += user.karma_score or 0
        # Points spent on redemptions
        spent = Redemption.objects.filter(user=user).aggregate(total=Sum('points_spent'))['total'] or 0
        balance = earned - spent
        return Response({
            'earned': earned,
            'spent': spent,
            'balance': balance,
        })


class PointsHistoryView(APIView):
    """Get user's points earning history."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        points = Points.objects.filter(user=request.user).order_by('-created_at')[:50]
        return Response(PointsSerializer(points, many=True).data)


class RedeemOfferListView(APIView):
    """List all active redeem offers."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        offers = RedeemOffer.objects.filter(is_active=True)
        return Response(RedeemOfferSerializer(offers, many=True).data)


class RedeemOfferView(APIView):
    """Redeem an offer using karma points."""
    permission_classes = [IsAuthenticated]

    def post(self, request, offer_id):
        user = request.user
        try:
            offer = RedeemOffer.objects.get(id=offer_id, is_active=True)
        except RedeemOffer.DoesNotExist:
            return Response({'error': 'Offer not found or inactive'}, status=status.HTTP_404_NOT_FOUND)

        # Calculate balance
        earned = Points.objects.filter(user=user).aggregate(total=Sum('points'))['total'] or 0
        earned += user.karma_score or 0
        spent = Redemption.objects.filter(user=user).aggregate(total=Sum('points_spent'))['total'] or 0
        balance = earned - spent

        if balance < offer.points_required:
            return Response({'error': f'Insufficient karma points. Need {offer.points_required}, have {balance}'}, status=status.HTTP_400_BAD_REQUEST)

        redemption = Redemption.objects.create(
            user=user,
            offer=offer,
            points_spent=offer.points_required,
        )
        return Response({
            'message': f'Successfully redeemed {offer.discount_percent}% off at {offer.company_name}!',
            'redemption': RedemptionSerializer(redemption).data,
            'new_balance': balance - offer.points_required,
        }, status=status.HTTP_201_CREATED)


class RedemptionHistoryView(APIView):
    """Get user's redemption history."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        redemptions = Redemption.objects.filter(user=request.user).order_by('-redeemed_at')[:50]
        return Response(RedemptionSerializer(redemptions, many=True).data)
