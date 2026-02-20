from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GlobalStatsView, KPISnapshotViewSet, SyndicateViewSet, ExpertProfileViewSet, SmartStatuteView
from .chat_views import ChatHistoryView, MarkAsReadView
from .trial_views import ProposeTrialView, TrialProposalListView, TrialProposalRespondView
from .notification_views import NotificationListView, NotificationMarkReadView, NotificationMarkAllReadView, UnreadNotificationCountView
from .booking_views import BookSessionView, BookingListView, ExpertContactView
from .redeem_views import KarmaBalanceView, PointsHistoryView, RedeemOfferListView, RedeemOfferView, RedemptionHistoryView

router = DefaultRouter()
router.register(r'snapshots', KPISnapshotViewSet, basename='snapshot')
router.register(r'syndicates', SyndicateViewSet, basename='syndicate')
router.register(r'experts', ExpertProfileViewSet, basename='expert')

urlpatterns = [
    path('', include(router.urls)),
    path('stats/', GlobalStatsView.as_view(), name='global_stats'),
    path('statutes/<int:syndicate_id>/', SmartStatuteView.as_view(), name='smart_statute'),
    path('chat/history/<int:receiver_id>/', ChatHistoryView.as_view(), name='chat-history'),
    path('chat/mark-as-read/<int:receiver_id>/', MarkAsReadView.as_view(), name='chat-mark-as-read'),
    path('trial/propose/<int:recipient_id>/', ProposeTrialView.as_view(), name='propose-trial'),
    path('trial/', TrialProposalListView.as_view(), name='trial-list'),
    path('trial/<int:proposal_id>/respond/', TrialProposalRespondView.as_view(), name='trial-respond'),
    path('notifications/', NotificationListView.as_view(), name='notification-list'),
    path('notifications/<int:notification_id>/read/', NotificationMarkReadView.as_view(), name='notification-read'),
    path('notifications/read-all/', NotificationMarkAllReadView.as_view(), name='notification-read-all'),
    path('notifications/unread-count/', UnreadNotificationCountView.as_view(), name='notification-unread-count'),
    path('bookings/', BookingListView.as_view(), name='booking-list'),
    path('bookings/create/<int:expert_profile_id>/', BookSessionView.as_view(), name='booking-create'),
    path('experts/<int:expert_profile_id>/contact/', ExpertContactView.as_view(), name='expert-contact'),
    path('karma/balance/', KarmaBalanceView.as_view(), name='karma-balance'),
    path('karma/history/', PointsHistoryView.as_view(), name='karma-history'),
    path('redeem/offers/', RedeemOfferListView.as_view(), name='redeem-offers'),
    path('redeem/<int:offer_id>/', RedeemOfferView.as_view(), name='redeem-offer'),
    path('redeem/history/', RedemptionHistoryView.as_view(), name='redeem-history'),
]
